import json

from django.contrib.auth import get_user
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator
from django.db.models import Q, Count
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
from tuduapi.serializers import ProjectSerializer


class ProjectListView(ListView):
    model = Project
    template_name = 'tudushnik/projects_page.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectListView, self).get_context_data(**kwargs)
        context['title'] = 'Проекты'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')

        tags_section = self.request.GET.get('tags')
        filter_section = self.request.GET.get('filter')

        per_page = manage_user_settings(self.request.user.id, per_page)

        all_projects = Project.objects.filter(owner_id=self.request.user.id).all()
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()

        kw = dict()
        if search_section is not None:
            search_section_obj = json.loads(search_section)
            # kw = dict()
            for key, value in search_section_obj.items():
                if key == 'owner':
                    key = 'owner__username'
                kw[key + '__icontains'] = value
            all_projects = all_projects.filter(**kw).all()


        other_projects = Project.objects.filter(
            Q(users_groups__users=self.request.user.id) & Q(
                users_groups__is_active=True) & Q(
                users_groups__permission_view_project=True)).all()

        if search_section is not None:
            other_projects = other_projects.filter(**kw).all()

        union_projects = all_projects.union(other_projects)

        if sorting_section is not None:
            sorting_section_list = json.loads(sorting_section)
            ls = list()
            for item in sorting_section_list:
                ls.append(item['v'] + item['n'])

            union_projects = union_projects.order_by(*ls).all()

        print('union', union_projects.query)

        paginator = Paginator(union_projects, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(union_projects)
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
        target_project = Project.objects.filter(
            Q(owner_id=self.request.user.id) & Q(pk=context["project"].id)
        ).first()
        if target_project is None:
            target_project = Project.objects.filter(
                Q(users_groups__users=self.request.user.id) & Q(
                    users_groups__is_active=True) & Q(
                    users_groups__permission_view_project=True) & Q(
                    pk=context["project"].id)).first()
            if target_project is None:
                raise PermissionDenied(
                    "You do not have permission to view this object.")

        context['title'] = context["project"]
        context['project_color'] = context["project"].color
        project_id = context["project"].id

        all_tasks = Task.objects.filter(
            project=context['project']).select_related().prefetch_related(
            'tags')

        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        tags_section = self.request.GET.get('tags')
        filter_section = self.request.GET.get('filter')
        per_page = manage_user_settings(self.request.user.id, per_page)

        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()
        all_projects = Project.objects.filter(
            owner_id=self.request.user.id).all()

        other_projects = Project.objects.filter(
            Q(users_groups__users=self.request.user.id) & Q(
                users_groups__is_active=True) & Q(
                users_groups__permission_view_project=True))

        all_projects = all_projects.union(other_projects)

        if search_section is not None:
            search_section_obj = json.loads(search_section)
            kw = dict()
            for key, value in search_section_obj.items():
                kw[key + '__icontains'] = value
            all_tasks = all_tasks.filter(**kw)

        if tags_section is not None:
            tags_section_obj = [int(i) for i in tags_section.split(',')]
            query = Q()
            for t in tags_section_obj:
                query |= Q(tags=t)
            all_tasks = all_tasks.filter(query).distinct()

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
                if key == 'is_done':
                    kw[key] = True if value == 'yes' else False
                else:
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
        context['len_records'] = paginator.count
        context['all_tags'] = all_tags
        context['all_projects'] = all_projects
        context['project_id'] = project_id
        context['json_data'] = {
            'tags': [t.to_json() for t in all_tags],
            'project': context["project"].to_json()
        }
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
        context['form'].fields['tags'].queryset = Tag.objects.filter(
            owner_id=self.request.user.id).all()
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
        form.fields['tags'].queryset = Tag.objects.filter(
            owner_id=request.user.id).all()
    return render(request, 'tudushnik/add_project.html',
                  {'form': form, 'title': 'Добавление проекта',
                   'page_title_eng': 'projects_create'})


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


# class ProjectAPI(generics.ListCreateAPIView):
#     serializer_class = ProjectSerializer
#
#     def get_queryset(self):
#         return Project.objects.filter(owner_id=self.request.user.id).all()
