import json
from datetime import datetime

import pytz
from django.core.exceptions import ObjectDoesNotExist

from django.core.paginator import Paginator
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views.generic import ListView, DetailView, UpdateView

from tudushnik.forms.check import AddCheckForm, CheckUpdateForm
from tudushnik.middleware import set_client_timezone
from tudushnik.models.budget import Budget
from tudushnik.models.tag import Tag
from tudushnik.models.check import Check
from tudushnik.models.user_profile_settings import manage_user_settings


class CheckListView(ListView):
    model = Check
    template_name = 'tudushnik/checks_page.html'

    def get_context_data(self, **kwargs):
        context = super(CheckListView, self).get_context_data(**kwargs)
        context['title'] = 'Чеки'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        filter_section = self.request.GET.get('filter')
        per_page = manage_user_settings(self.request.user.id, per_page)

        all_budgets = Budget.objects.filter(
            owner_id=self.request.user.id).all()
        all_checks = Check.objects.filter(budget__in=all_budgets).all()
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()

        if search_section is not None:
            search_section_obj = json.loads(search_section)
            kw = dict()
            for key, value in search_section_obj.items():
                kw[key + '__icontains'] = value
            all_checks = all_checks.filter(**kw)
        if sorting_section is not None:
            sorting_section_list = json.loads(sorting_section)
            ls = list()
            for item in sorting_section_list:
                ls.append(item['v'] + item['n'])
            print(ls)
            all_checks = all_checks.order_by(*ls)
        if filter_section is not None:
            filter_section_obj = json.loads(filter_section)

            kw = dict()
            for key, value in filter_section_obj.items():
                k = key + '__in'
                if k not in kw:
                    kw[k] = list()
                for v in value:
                    kw[k].append(v)

            all_checks = all_checks.filter(**kw).annotate(dcount=Count('tags'))

        paginator = Paginator(all_checks, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_checks)
        context['all_tags'] = all_tags
        set_client_timezone(self.request, context)

        return context


class CheckDetailView(DetailView):
    model = Check
    template_name = 'tudushnik/check_detail.html'

    def get_queryset(self):
        return Check.objects.all()

    def get_object(self):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = context["check"]
        set_client_timezone(self.request, context)
        return context


class CheckUpdateView(UpdateView):
    model = Check
    template_name_suffix = '_update_form'
    form_class = CheckUpdateForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        test = Budget.objects.filter(owner_id=self.request.user.id).all()
        context['form'].fields['budget'].queryset = test
        set_client_timezone(self.request, context)
        return context

    def form_valid(self, form):
        naived = timezone.make_naive(form.instance.datetime_at)
        form.instance.datetime_at = timezone.make_aware(naived, pytz.timezone(
            self.kwargs['client_timezone']))
        return super().form_valid(form)


def add_check(request, *args, **kwargs):
    cur_tz = set_client_timezone(request, kwargs)
    if request.method == 'POST':
        form = AddCheckForm(request.POST, request.FILES)
        form.instance.creator = request.user

        if form.is_valid():
            offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
            if str(offset) != '0:00:00':
                print(form.instance.datetime_at, flush=True)
                print(offset, flush=True)
                temp = form.instance.datetime_at - offset
                form.instance.datetime_at = temp

            form.save()
            return redirect('tasks_page')
    else:
        form = AddCheckForm(
            instance=Check(
                creator=request.user,
                datetime_at=timezone.localtime(
                    timezone.now(), pytz.timezone(cur_tz)
                ).strftime('%Y-%m-%dT%H:%M')
            )
        )
        form.fields['budget'].queryset = Budget.objects.filter(
            owner_id=request.user.id).all()
        form.fields['tags'].queryset = Tag.objects.filter(
            owner_id=request.user.id).all()
    kwargs.update({'form': form, 'title': 'Добавление чека'})
    return render(request, 'tudushnik/add_check.html', kwargs)


def add_check_to_budget(request, budget_pk, *args, **kwargs):
    cur_tz = set_client_timezone(request, kwargs)
    if request.method == 'POST':
        form = AddCheckForm(request.POST, request.FILES)
        form.instance.creator = request.user

        if form.is_valid():
            offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
            if str(offset) != '0:00:00':
                # time.sleep(3)
                begin = form.instance.datetime_at
                print('debug', begin)

                form.instance.datetime_at = begin - offset
            form.save()
            return redirect('budget_detail', pk=budget_pk)
    else:
        proj = Budget.objects.filter(owner_id=request.user.id, pk=budget_pk)
        form = AddCheckForm(
            instance=Check(
                budget=proj.first(),
                creator=request.user,
                datetime_at=timezone.localtime(
                    timezone.now(), pytz.timezone(cur_tz)
                ).strftime('%Y-%m-%dT%H:%M')
            )
        )
        form.fields['budget'].queryset = proj.all()

    kwargs.update({'form': form, 'title': 'Добавление чека в бюджет'})
    return render(request, 'tudushnik/add_check_to_budget.html', kwargs)


def check_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = Check.objects.filter(creator_id=request.user.id,
                                            pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})


def check_update_attrs(request, *args, **kwargs):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        check_id = int(json_data['check_id'])
        json_data['check_id'] = check_id
        target_object = None
        try:
            target_object = Check.objects.filter(creator_id=request.user.id,
                                                pk=check_id).first()
        except ObjectDoesNotExist:
            json_resp = {
                'success': False,
                'error_message': f'Ошибка! '
                                 f'Чека с id {check_id} не существует!'
            }
            json_resp.update(json_data)
            return JsonResponse(json_resp)

        is_done = json_data.get('is_done')
        if is_done is not None:
            target_object.is_done = is_done

        # diagram_offset_x = json_data.get('diagram_offset_x')
        # if diagram_offset_x is not None:
        #     target_object.diagram_offset_x = diagram_offset_x
        #
        # width = json_data.get('width')
        # if width is not None:
        #     target_object.width = width

        value = json_data.get('value')
        if value is not None:
            target_object.value = value

        datetime_at = json_data.get('datetime_at')
        if datetime_at is not None:
            datetime_at = timezone.make_aware(datetime.fromisoformat(datetime_at), pytz.timezone(
                kwargs['client_timezone']))
            print(datetime_at)
            target_object.datetime_at = datetime_at

        target_object.save()
        print(request)
        json_resp = {'success': True, 'check_id': check_id}
        json_resp.update(json_data)
        return JsonResponse(json_resp)


def checks_fetch(request, *args, **kwargs):
    if request.method == 'POST':
        date_from = request.POST['date_from']
        date_to = request.POST['date_to']
        cur_tz = set_client_timezone(request, kwargs)
        offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
        # if str(offset) != '0:00:00':
        #     print(offset)
        date_from_parsed = datetime.fromisoformat(date_from)
        date_to_parsed = datetime.fromisoformat(date_to)
        date_from = (date_from_parsed - offset).strftime('%Y-%m-%dT%H:%M')
        date_to = (date_to_parsed - offset).strftime('%Y-%m-%dT%H:%M')

        query = Check.objects.filter(
            creator_id=request.user.id,
            datetime_at__gt=date_from,
            datetime_at__lt=date_to
        )

        result = query.all()

        if result is None:
            result = list()

        return JsonResponse(
            {
                'success': True,
                'offset': str(offset),
                'checks': [t.to_json() for t in result]
            }
        )
