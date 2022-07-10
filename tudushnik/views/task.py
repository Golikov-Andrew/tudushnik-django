from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView

from tudushnik.forms.task import AddTaskForm, TaskUpdateForm
from tudushnik.models.project import Project
from tudushnik.models.task import Task


def tasks_page(request):
    tasks = Task.objects.filter(project__in=Project.objects.filter(owner_id=request.user.id))
    return render(request, 'tudushnik/tasks_page.html', {
        'title': 'Задачи',
        'tasks': tasks,
    })


class TaskListView(ListView):
    model = Task
    template_name = 'tudushnik/tasks_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Задачи'
        per_page = self.request.GET.get('limit')
        if per_page is None:
            per_page = 5
        all_projects = Project.objects.filter(owner_id=self.request.user.id).all()

        all_tasks = Task.objects.filter(project__in=all_projects)
        paginator = Paginator(all_tasks, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_tasks)
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
        # Project.objects.filter(owner_id=self.request.user.id)
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
        if form.is_valid():
            form.save()
            return redirect('tasks_page')
    else:
        form = AddTaskForm()
        form.fields['project'].queryset = Project.objects.filter(owner_id=request.user.id).all()
    return render(request, 'tudushnik/add_task.html', {'form': form, 'title': 'Добавление задачи'})


def add_task_to_project(request, project_pk):
    if request.method == 'POST':
        form = AddTaskForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('project_detail', pk=project_pk)
    else:
        proj = Project.objects.filter(owner_id=request.user.id, pk=project_pk)
        form = AddTaskForm(instance=Task(project=proj.first()))

        form.fields['project'].queryset = proj.all()
        # form.fields['project'].initial =proj.first()
        # form.fields['project']
    return render(request, 'tudushnik/add_task_to_project.html', {'form': form, 'title': 'Добавление задачи в проект'})


def task_delete(request, pk: int):
    if request.method == 'POST':
        target_object = Task.objects.filter(owner_id=request.user.id, pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})
