import json

from django.contrib.auth import get_user
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView

from tudushnik.forms.budget import AddBudgetForm, BudgetUpdateForm
from tudushnik.middleware import set_client_timezone
from tudushnik.models.budget import Budget
from tudushnik.models.tag import Tag
from tudushnik.models.check import Check
from tudushnik.models.user_profile_settings import manage_user_settings


class BudgetListView(ListView):
    model = Budget
    template_name = 'tudushnik/budgets_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Бюджеты'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        per_page = manage_user_settings(self.request.user.id, per_page)
        all_projects = Budget.objects.filter(owner_id=self.request.user.id)
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()
        if search_section is not None:
            search_section_obj = json.loads(search_section)
            kw = dict()
            for key, value in search_section_obj.items():
                kw[key + '__icontains'] = value
            all_projects = all_projects.filter(**kw)
        if sorting_section is not None:
            sorting_section_list = json.loads(sorting_section)
            ls = list()
            for item in sorting_section_list:
                ls.append(item['v'] + item['n'])
            print(ls)
            all_projects = all_projects.order_by(*ls)

        paginator = Paginator(all_projects, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_projects)
        context['all_tags'] = all_tags
        set_client_timezone(self.request, context)
        return context


class BudgetDetailView(DetailView):
    model = Budget
    template_name = 'tudushnik/budget_detail.html'

    def get_queryset(self):
        return Budget.objects.all()

    def get_object(self, query_set=None):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = context["budget"]
        budget_id = context["budget"].id
        all_checks = Check.objects.filter(
            budget=context['budget']).select_related().prefetch_related(
            'tags')
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        per_page = manage_user_settings(self.request.user.id, per_page)
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

        paginator = Paginator(all_checks, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = paginator.count
        context['all_tags'] = all_tags
        context['budget_id'] = budget_id
        context['entity_type'] = 'Бюджет'
        set_client_timezone(self.request, context)
        return context


class BudgetUpdateView(UpdateView):
    model = Budget
    template_name_suffix = '_update_form'
    form_class = BudgetUpdateForm

def add_budget(request, *args, **kwargs):
    if request.method == 'POST':
        form = AddBudgetForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.owner = get_user(request)
            form.save()
            return redirect('budgets_page')
    else:
        form = AddBudgetForm()
    return render(request, 'tudushnik/add_budget.html',
                  {'form': form, 'title': 'Добавление бюджета'})


def budget_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = Budget.objects.filter(owner_id=request.user.id,
                                               pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})
