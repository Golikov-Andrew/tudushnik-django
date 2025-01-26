import json
from datetime import datetime, timedelta

import pytz
from django.core.exceptions import ObjectDoesNotExist

from django.core.paginator import Paginator
from django.db.models import Count, Q
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
        current_task = context['task']
        task_pk = current_task.pk
        owner_id = self.request.user.id
        context['form'].fields['project'].queryset = Project.objects.filter(
            owner_id=owner_id).all()
        context['form'].fields['tags'].queryset = Tag.objects.filter(
            owner_id=owner_id).all()

        all_other_tasks = Task.objects.filter(owner_id=owner_id).exclude(
            pk=task_pk)

        all_parents_task = all_other_tasks.filter(
            children=current_task).all()

        all_children_tasks = current_task.children.all()

        other_tasks_without_children = all_other_tasks.difference(
            all_children_tasks)
        other_tasks_without_parents = all_other_tasks.difference(
            all_parents_task)

        context['form'].fields[
            'children'].queryset = other_tasks_without_parents
        context[
            'all_other_tasks_and_not_children'] = other_tasks_without_children
        context['parents'] = all_parents_task
        set_client_timezone(self.request, context)
        return context

    def form_valid(self, form):

        def move_task(task_obj, move_settings):
            task_obj.begin_at += timedelta(
                seconds=int(move_settings['begin_at_delta']))
            task_obj.save()
            if move_settings['recursive']:
                for child_obj in task_obj.children.all():
                    move_task(child_obj, move_settings)

        naived = timezone.make_naive(form.instance.begin_at)
        form.instance.begin_at = timezone.make_aware(naived, pytz.timezone(
            self.kwargs['client_timezone']))
        parents_id = [int(i) for i in self.request.POST.getlist('parents[]')]
        prev_parents_ids_set = [i['id'] for i in list(Task.objects.filter(
            owner_id=self.request.user.id).filter(
            children=form.instance.pk).values('id'))]
        parents_for_unlink = set(prev_parents_ids_set).difference(
            set(parents_id))
        parents_for_link = set(parents_id).difference(set(prev_parents_ids_set))
        for pid in parents_for_link:
            parent = Task.objects.filter(
                owner_id=self.request.user.id).filter(pk=pid).first()
            parent.children.add(form.instance)
        for pid in parents_for_unlink:
            parent = Task.objects.filter(
                owner_id=self.request.user.id).filter(pk=pid).first()
            parent.children.remove(form.instance)

        is_move_with_children = self.request.POST.get('is_move_with_children')
        is_move_with_children_recursive = self.request.POST.get(
            'is_move_with_children_recursive')
        is_move_with_children_recursive = False if \
            is_move_with_children_recursive is None else True
        begin_at_delta = self.request.POST.get('begin_at_delta')
        if is_move_with_children is not None and begin_at_delta is not None:
            children = self.object.children.all()
            for child in children:
                move_task(child, {
                    'recursive': is_move_with_children_recursive,
                    'begin_at_delta': begin_at_delta
                })

        return super().form_valid(form)


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
        diagram_offset_x = request.GET.get('diagram_offset_x')
        begin_at = request.GET.get('begin_at')
        if diagram_offset_x is not None and begin_at is not None:
            form = AddTaskForm(
                instance=Task(
                    owner=request.user,
                    begin_at=begin_at,
                    diagram_offset_x=int(diagram_offset_x)
                )
            )
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
        diagram_offset_x = request.GET.get('diagram_offset_x')
        begin_at = request.GET.get('begin_at')
        if diagram_offset_x is not None and begin_at is not None:
            form = AddTaskForm(
                instance=Task(
                    project=proj.first(),
                    owner=request.user,
                    begin_at=begin_at,
                    diagram_offset_x=int(diagram_offset_x)
                )
            )
        else:
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
        form.fields['tags'].queryset = Tag.objects.filter(
            owner_id=request.user.id).all()

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
        json_data = json.loads(request.body)
        task_id = int(json_data['task_id'])
        json_data['task_id'] = task_id
        target_object = None
        try:
            target_object = Task.objects.filter(owner_id=request.user.id,
                                                pk=task_id).first()
        except ObjectDoesNotExist:
            json_resp = {
                'success': False,
                'error_message': f'Ошибка! '
                                 f'Задачи с id {task_id} не существует!'
            }
            json_resp.update(json_data)
            return JsonResponse(json_resp)

        is_done = json_data.get('is_done')
        if is_done is not None:
            target_object.is_done = is_done

        diagram_offset_x = json_data.get('diagram_offset_x')
        if diagram_offset_x is not None:
            target_object.diagram_offset_x = diagram_offset_x

        width = json_data.get('width')
        if width is not None:
            target_object.width = width

        duration = json_data.get('duration')
        if duration is not None:
            target_object.duration = duration

        begin_at = json_data.get('begin_at')
        if begin_at is not None:
            begin_at = timezone.make_aware(datetime.fromisoformat(begin_at),
                                           pytz.timezone(
                                               kwargs['client_timezone']))
            print(begin_at)
            target_object.begin_at = begin_at

        new_child_id = json_data.get('new_child_id')
        if new_child_id is not None:
            new_child_task = Task.objects.filter(owner_id=request.user.id,
                                                 pk=new_child_id).first()
            target_object.children.add(new_child_task)

        target_object.save()
        print(request)
        json_resp = {'success': True, 'task_id': task_id}
        json_resp.update(json_data)
        return JsonResponse(json_resp)


def tasks_fetch(request, *args, **kwargs):
    if request.method == 'POST':
        date_from = request.POST['date_from']
        date_to = request.POST['date_to']
        projects_ids = request.POST.getlist('selected_projects[]')
        cur_tz = set_client_timezone(request, kwargs)
        offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
        date_from_parsed = datetime.fromisoformat(date_from)
        date_to_parsed = datetime.fromisoformat(date_to)
        date_from = (date_from_parsed - offset).strftime('%Y-%m-%dT%H:%M')
        date_to = (date_to_parsed - offset).strftime('%Y-%m-%dT%H:%M')

        query = Task.objects.filter(
            owner_id=request.user.id,
            begin_at__gt=date_from,
            begin_at__lt=date_to
        )
        if projects_ids is not None:
            query = query.filter(project_id__in=projects_ids)

        result = query.all()

        if result is None:
            result = list()

        return JsonResponse(
            {
                'success': True,
                'offset': str(offset),
                'tasks': [t.to_json() for t in result]
            }
        )
