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

from tudushnik.forms.task import AddTaskForm, TaskUpdateForm
from tudushnik.middleware import set_client_timezone
from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task
from tudushnik.models.user_profile_settings import manage_user_settings


class TaskListView(ListView):
    model = Task
    template_name = 'tudushnik/tasks_page.html'

    def get_context_data(self, **kwargs):
        context = super(TaskListView, self).get_context_data(**kwargs)
        context['title'] = 'Задачи'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        filter_section = self.request.GET.get('filter')
        per_page = manage_user_settings(self.request.user.id, per_page)

        all_projects = Project.objects.filter(
            owner_id=self.request.user.id).all()
        all_tasks = Task.objects.filter(project__in=all_projects).all()
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()

        if search_section is not None:
            search_section_obj = json.loads(search_section)
            kw = dict()
            for key, value in search_section_obj.items():
                kw[key + '__icontains'] = value
            all_tasks = all_tasks.filter(**kw)
        if sorting_section is not None:
            sorting_section_list = json.loads(sorting_section)
            ls = list()
            for item in sorting_section_list:
                ls.append(item['v'] + item['n'])
            print(ls)
            all_tasks = all_tasks.order_by(*ls)
        if filter_section is not None:
            filter_section_obj = json.loads(filter_section)

            kw = dict()
            for key, value in filter_section_obj.items():
                k = key + '__in'
                if k not in kw:
                    kw[k] = list()
                for v in value:
                    kw[k].append(v)

            all_tasks = all_tasks.filter(**kw).annotate(dcount=Count('tags'))

        paginator = Paginator(all_tasks, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_tasks)
        context['all_tags'] = all_tags
        set_client_timezone(self.request, context)

        return context


class TaskDetailView(DetailView):
    model = Task
    template_name = 'tudushnik/task_detail.html'

    def get_queryset(self):
        return Task.objects.all()

    def get_object(self):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = context["task"]
        set_client_timezone(self.request, context)
        return context


class TaskUpdateView(UpdateView):
    model = Task
    template_name_suffix = '_update_form'
    form_class = TaskUpdateForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        test = Project.objects.filter(owner_id=self.request.user.id).all()
        context['form'].fields['project'].queryset = test
        begin_at_formated_value = context['object'].begin_at.strftime(
            '%Y-%m-%dT%H:%M:%S')
        context['form'].initial['begin_at'] = begin_at_formated_value
        set_client_timezone(self.request, context)
        return context


def add_task(request, *args, **kwargs):
    cur_tz = set_client_timezone(request, kwargs)
    if request.method == 'POST':
        form = AddTaskForm(request.POST, request.FILES)
        form.instance.owner = request.user

        if form.is_valid():
            offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
            if str(offset) != '0:00:00':
                print(form.instance.begin_at, flush=True)
                print(offset, flush=True)
                temp = form.instance.begin_at - offset
                form.instance.begin_at = temp

            form.save()
            return redirect('tasks_page')
    else:
        form = AddTaskForm(
            instance=Task(
                owner=request.user,
                begin_at=timezone.localtime(
                    timezone.now(), pytz.timezone(cur_tz)
                ).strftime('%Y-%m-%dT%H:%M')
            )
        )
        form.fields['project'].queryset = Project.objects.filter(
            owner_id=request.user.id).all()
        form.fields['tags'].queryset = Tag.objects.filter(
            owner_id=request.user.id).all()
    kwargs.update({'form': form, 'title': 'Добавление задачи'})
    return render(request, 'tudushnik/add_task.html', kwargs)


def add_task_to_project(request, project_pk, *args, **kwargs):
    cur_tz = set_client_timezone(request, kwargs)
    if request.method == 'POST':
        form = AddTaskForm(request.POST, request.FILES)
        form.instance.owner = request.user

        if form.is_valid():
            offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
            if str(offset) != '0:00:00':
                # time.sleep(3)
                begin = form.instance.begin_at
                print('debug', begin)

                form.instance.begin_at = begin - offset
            form.save()
            return redirect('project_detail', pk=project_pk)
    else:
        proj = Project.objects.filter(owner_id=request.user.id, pk=project_pk)
        form = AddTaskForm(
            instance=Task(
                project=proj.first(),
                owner=request.user,
                begin_at=timezone.localtime(
                    timezone.now(), pytz.timezone(cur_tz)
                ).strftime('%Y-%m-%dT%H:%M')
            )
        )
        form.fields['project'].queryset = proj.all()

    kwargs.update({'form': form, 'title': 'Добавление задачи в проект'})
    return render(request, 'tudushnik/add_task_to_project.html', kwargs)


def task_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = Task.objects.filter(owner_id=request.user.id,
                                            pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})


def task_update_attrs(request, *args, **kwargs):
    if request.method == 'POST':
        task_id = int(request.POST['task_id'])
        is_done = True if request.POST['is_done'] == 'true' else False
        try:
            target_object = Task.objects.filter(owner_id=request.user.id,
                                                pk=task_id).first()

            target_object.is_done = is_done
            target_object.save()
            print(request)
            return JsonResponse(
                {'success': True, 'task_id': task_id, 'is_done': is_done})
        except ObjectDoesNotExist:
            return JsonResponse(
                {'success': False,
                 'error_message': f'Ошибка! '
                                  f'Задачи с id {task_id} не существует!',
                 'is_done': is_done})


def tasks_fetch(request, *args, **kwargs):
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

        query = Task.objects.filter(
            owner_id=request.user.id,
            begin_at__gt=date_from,
            begin_at__lt=date_to
        )

        result = query.all()

        if result is None:
            result = list()

        return JsonResponse(
            {'success': True, 'tasks': [t.to_json() for t in result]})
