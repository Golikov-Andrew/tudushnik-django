import json

from django.contrib.auth import get_user
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView
from rest_framework import generics

from tudushnik.forms.project import AddProjectForm, ProjectUpdateForm
from tudushnik.middleware import set_client_timezone
from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task
from tudushnik.models.user_profile_settings import manage_user_settings
from tudushnik.serializers import ProjectSerializer


class ProjectListView(ListView):
    model = Project
    template_name = 'tudushnik/projects_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Проекты'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        per_page = manage_user_settings(self.request.user.id, per_page)
        all_projects = Project.objects.filter(owner_id=self.request.user.id)
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
        context['page_title_eng'] = 'projects_page'
        set_client_timezone(self.request, context)
        return context


class ProjectDetailView(DetailView):
    model = Project
    template_name = 'tudushnik/project_detail.html'

    def get_queryset(self):
        return Project.objects.all()

    def get_object(self, query_set=None):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = context["project"]
        context['project_color'] = context["project"].color
        project_id = context["project"].id
        all_tasks = Task.objects.filter(
            project=context['project']).select_related().prefetch_related(
            'tags')
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        per_page = manage_user_settings(self.request.user.id, per_page)
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()
        all_projects = Project.objects.filter(
            owner_id=self.request.user.id).all()
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
        context['len_records'] = paginator.count
        context['all_tags'] = all_tags
        context['all_projects'] = all_projects
        context['project_id'] = project_id
        context['entity_type'] = 'Проект'
        context['page_title_eng'] = 'projects_detail'
        set_client_timezone(self.request, context)
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
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Project.objects.filter(owner_id=self.request.user.id)
        # context['title'] = context["project"]
        context['page_title_eng'] = 'project_edit'
        return context


# def projects_page(request):
#     projects = Project.objects.filter(owner_id=request.user.id)
#     print(projects, flush=True)
#     return render(request, 'tudushnik/projects_page.html', {
#         'title': 'Проекты',
#         'projects': projects,
#     })


def add_project(request, *args, **kwargs):
    if request.method == 'POST':
        form = AddProjectForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.owner = get_user(request)
            form.save()
            return redirect('projects_page')
    else:
        form = AddProjectForm()
    return render(request, 'tudushnik/add_project.html',
                  {'form': form, 'title': 'Добавление проекта', 'page_title_eng': 'projects_create'})


def project_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = Project.objects.filter(owner_id=request.user.id,
                                               pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})


class ProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner_id=self.request.user.id).all()
