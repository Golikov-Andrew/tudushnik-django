import json
from datetime import datetime

from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView

from tudushnik.forms.task import AddTaskForm, TaskUpdateForm
from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task
from tudushnik.models.user_profile_settings import UserProfileSettings, manage_user_settings


class TaskListView(ListView):
    model = Task
    template_name = 'tudushnik/tasks_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Задачи'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        per_page = manage_user_settings(self.request.user.id, per_page)
        all_projects = Project.objects.filter(owner_id=self.request.user.id).all()
        all_tasks = Task.objects.filter(project__in=all_projects).select_related().prefetch_related('tags')
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

        paginator = Paginator(all_tasks, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_tasks)
        context['all_tags'] = all_tags

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
        return context


class TaskUpdateView(UpdateView):
    model = Task
    template_name_suffix = '_update_form'
    form_class = TaskUpdateForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        test = Project.objects.filter(owner_id=self.request.user.id).all()
        context['form'].fields['project'].queryset = test
        return context


def add_task(request):
    if request.method == 'POST':
        form = AddTaskForm(request.POST, request.FILES)
        form.instance.owner = request.user
        if form.is_valid():
            form.save()
            return redirect('tasks_page')
    else:
        form = AddTaskForm(instance=Task(owner=request.user, begin_at=datetime.now().strftime('%Y-%m-%dT%H:%M')))
        form.fields['project'].queryset = Project.objects.filter(owner_id=request.user.id).all()
    return render(request, 'tudushnik/add_task.html', {'form': form, 'title': 'Добавление задачи'})


def add_task_to_project(request, project_pk):
    if request.method == 'POST':
        form = AddTaskForm(request.POST, request.FILES)
        form.instance.owner = request.user
        if form.is_valid():
            form.save()
            return redirect('project_detail', pk=project_pk)
    else:
        proj = Project.objects.filter(owner_id=request.user.id, pk=project_pk)
        form = AddTaskForm(
            instance=Task(project=proj.first(), owner=request.user, begin_at=datetime.now().strftime('%Y-%m-%dT%H:%M'))
            # instance=Task(project=proj.first(), owner=request.user, begin_at=datetime.now().timestamp())
        )
        form.fields['project'].queryset = proj.all()
    return render(request, 'tudushnik/add_task_to_project.html', {'form': form, 'title': 'Добавление задачи в проект'})


def task_delete(request, pk: int):
    if request.method == 'POST':
        target_object = Task.objects.filter(owner_id=request.user.id, pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})
