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
from rest_framework import generics

from tudushnik.forms.task import AddTaskForm, TaskUpdateForm
from tudushnik.forms.users_group import AddUsersGroupForm, UsersGroupUpdateForm
from tudushnik.middleware import set_client_timezone
from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task
from tudushnik.models.user_profile_settings import manage_user_settings
from tudushnik.models.users_group import UsersGroup
from tudushnik.serializers import TaskSerializer


class UsersGroupListView(ListView):
    model = Task
    template_name = 'tudushnik/users_groups_page.html'

    def get_context_data(self, **kwargs):
        context = super(UsersGroupListView, self).get_context_data(**kwargs)
        context['title'] = 'Группы'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        tags_section = self.request.GET.get('tags')
        filter_section = self.request.GET.get('filter')
        per_page = manage_user_settings(self.request.user.id, per_page)

        all_projects = Project.objects.filter(
            owner_id=self.request.user.id).all()
        all_tasks = Task.objects.filter(project__in=all_projects).all()
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()
        all_users_groups = UsersGroup.objects.filter(creator_id=self.request.user.id).all()

        # if search_section is not None:
        #     search_section_obj = json.loads(search_section)
        #     kw = dict()
        #     for key, value in search_section_obj.items():
        #         kw[key + '__icontains'] = value
        #     all_tasks = all_tasks.filter(**kw)
        #
        # if tags_section is not None:
        #     tags_section_obj = [int(i) for i in tags_section.split(',')]
        #     query = Q()
        #     for t in tags_section_obj:
        #         query |= Q(tags=t)
        #     all_tasks = all_tasks.filter(query).distinct()
        # if sorting_section is not None:
        #     sorting_section_list = json.loads(sorting_section)
        #     ls = list()
        #     for item in sorting_section_list:
        #         ls.append(item['v'] + item['n'])
        #     print(ls)
        #     all_tasks = all_tasks.order_by(*ls)
        # if filter_section is not None:
        #     filter_section_obj = json.loads(filter_section)
        #
        #     kw = dict()
        #     for key, value in filter_section_obj.items():
        #         k = key + '__in'
        #         if k not in kw:
        #             kw[k] = list()
        #         for v in value:
        #             kw[k].append(v)
        #
        #     all_tasks = all_tasks.filter(**kw).annotate(dcount=Count('tags'))

        paginator = Paginator(all_users_groups, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_users_groups)
        context['all_tags'] = all_tags
        # context['json_data'] = {
        #     'tags': [t.to_json() for t in all_tags]
        # }
        # context['page_title_eng'] = 'tasks_page'
        set_client_timezone(self.request, context)

        return context


class UsersGroupDetailView(DetailView):
    model = UsersGroup
    template_name = 'tudushnik/users_group_detail.html'

    def get_queryset(self):
        return UsersGroup.objects.all()

    def get_object(self):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = context["usersgroup"]
        set_client_timezone(self.request, context)
        return context


class UsersGroupUpdateView(UpdateView):
    model = UsersGroup
    template_name_suffix = '_update_form'
    # template_name = 'users_group_update_form.html'
    form_class = UsersGroupUpdateForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_users_group = context['usersgroup']
        current_users_group_pk = current_users_group.pk
        creator_id = self.request.user.id
        context['form'].fields['projects'].queryset = Project.objects.filter(
            owner_id=creator_id).all()
        context['form'].fields['tags'].queryset = Tag.objects.filter(
            owner_id=creator_id).all()

        # context['page_title_eng'] = 'tasks_edit'
        set_client_timezone(self.request, context)
        return context

    def form_valid(self, form):
        return super().form_valid(form)


def add_users_group(request, *args, **kwargs):
    cur_tz = set_client_timezone(request, kwargs)
    if request.method == 'POST':
        form = AddUsersGroupForm(request.POST, request.FILES)
        form.instance.creator = request.user

        if form.is_valid():
            form.save()
            if request.POST.get('referer') is not None and request.POST.get('referer') != '':
                return redirect(request.POST.get('referer'))
            return redirect('users_groups_page')
    else:
        form = AddUsersGroupForm(
            instance=UsersGroup(
                creator=request.user
            )
        )

        form.fields['tags'].queryset = Tag.objects.filter(
            owner_id=request.user.id).all()
    kwargs.update({
        'form': form, 'title': 'Создание группы пользователей',
        'referer': request.META['HTTP_REFERER'],
        'page_title_eng': 'users_group_create'
    })
    return render(request, 'tudushnik/add_users_group.html', kwargs)


def users_group_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = UsersGroup.objects.filter(creator_id=request.user.id,
                                            pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})
