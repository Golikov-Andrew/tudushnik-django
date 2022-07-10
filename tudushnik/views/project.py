from django.contrib.auth import get_user
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views.generic import ListView, CreateView, DetailView, UpdateView

from tudushnik.forms.project import AddProjectForm, ProjectUpdateForm
from tudushnik.models.project import Project
from tudushnik.models.task import Task


class ProjectListView(ListView):
    model = Project
    template_name = 'tudushnik/projects_page.html'
    # context_object_name = 'projects'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Проекты'
        per_page = self.request.GET.get('limit')
        if per_page is None:
            per_page = 5
        all_projects = Project.objects.filter(owner_id=self.request.user.id).all()
        paginator = Paginator(all_projects, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_projects)
        return context


class ProjectDetailView(DetailView):
    model = Project
    template_name = 'tudushnik/project_detail.html'

    def get_queryset(self):
        return Project.objects.all()

    def get_object(self):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Project.objects.filter(owner_id=self.request.user.id)
        context['title'] = context["project"]
        # project = Project.objects.filter(owner_id=self.request.user.id, pk=self.request).all()
        all_tasks = Task.objects.filter(project=context['project'])
        per_page = self.request.GET.get('limit')
        if per_page is None:
            per_page = 5
        paginator = Paginator(all_tasks, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_tasks)
        return context


class ProjectUpdateView(UpdateView):
    model = Project
    # fields = ['title', 'description']
    template_name_suffix = '_update_form'
    form_class = ProjectUpdateForm



    # def get_queryset(self):
    #     return Project.objects.all()
    #
    # def get_object(self):
    #     obj = super().get_object()
    #     return obj
    #
    # def get_context_data(self, **kwargs):
    #     context = super().get_context_data(**kwargs)
    #     Project.objects.filter(owner_id=self.request.user.id)
    #     context['title'] = context["project"]
    #     return context


# def projects_page(request):
#     projects = Project.objects.filter(owner_id=request.user.id)
#     print(projects, flush=True)
#     return render(request, 'tudushnik/projects_page.html', {
#         'title': 'Проекты',
#         'projects': projects,
#     })


def add_project(request):
    if request.method == 'POST':
        form = AddProjectForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.owner = get_user(request)
            form.save()
            return redirect('projects_page')
    else:
        form = AddProjectForm()
    return render(request, 'tudushnik/add_project.html', {'form': form, 'title': 'Добавление проекта'})


def project_delete(request, pk: int):
    if request.method == 'POST':
        target_object = Project.objects.filter(owner_id=request.user.id, pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})
