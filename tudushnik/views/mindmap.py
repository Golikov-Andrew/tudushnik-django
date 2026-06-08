import json

from django.contrib.auth import get_user
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, UpdateView
from rest_framework import generics

# from tudushnik.common import dispatch_event
from tudushnik.forms.mindmap import AddMindMapForm, MindMapUpdateForm
from tudushnik.middleware import set_client_timezone
from tudushnik.models import TaskStatus
from tudushnik.models.mindmap import MindMap

from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task
from tudushnik.models.task_mindmap import TaskMindMap

from tudushnik.models.user_profile_settings import manage_user_settings, \
    UserProfileSettings


# from tuduapi.serializers import MindMapSerializer


class MindMapListView(ListView):
    model = MindMap
    template_name = 'tudushnik/mindmaps_page.html'

    def get_context_data(self, **kwargs):
        context = super(MindMapListView, self).get_context_data(**kwargs)
        context['title'] = 'Интеллект-Карты'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')

        per_page = manage_user_settings(self.request.user.id, per_page)

        all_mindmaps = MindMap.objects.filter(
            owner_id=self.request.user.id).all()

        kw = dict()
        if search_section is not None:
            search_section_obj = json.loads(search_section)
            for key, value in search_section_obj.items():
                if key == 'owner':
                    key = 'owner__username'
                kw[key + '__icontains'] = value
            all_mindmaps = all_mindmaps.filter(**kw).all()

        if sorting_section is not None:
            sorting_section_list = json.loads(sorting_section)
            ls = list()
            for item in sorting_section_list:
                ls.append(item['v'] + item['n'])

            all_mindmaps = all_mindmaps.order_by(*ls).all()

        paginator = Paginator(all_mindmaps, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_mindmaps)
        context['page_title_eng'] = 'mindmaps_page'
        set_client_timezone(self.request, context)
        return context


class MindMapDetailView(DetailView):
    model = MindMap
    template_name = 'tudushnik/mindmap_detail.html'

    def get_queryset(self):
        return MindMap.objects.all()

    def get_object(self, query_set=None):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        request_user_id = self.request.user.id
        mindmap_id = context["mindmap"].id

        target_mindmap = MindMap.objects.filter(
            Q(owner_id=request_user_id) & Q(pk=mindmap_id)).first()

        context['title'] = target_mindmap.title

        all_tasks = Task.objects.filter(
            project_id=target_mindmap.project.id)

        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        tags_section = self.request.GET.get('tags')
        filter_section = self.request.GET.get('filter')

        all_tags = Tag.objects.filter(owner_id=request_user_id).all()

        all_statuses = TaskStatus.objects.all()

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

            q_main = Q()

            for item in filter_section_obj:
                key = item['n']
                value = item['v']
                is_many = item.get('m')
                operand = item.get('o', 'o')
                exclude = item.get('e', '0')

                query = Q()

                if is_many is None or is_many == '0':
                    v = True if value == '1' else False
                    query = Q(**{key: v})

                else:
                    values = value.split(',')
                    if operand == 'o':
                        for v in values:
                            query |= Q(**{key: v})

                        if exclude == '1':
                            query = ~query

                    elif operand == 'a':
                        if exclude != '1':
                            for v in values:
                                all_tasks = all_tasks.filter(**{key: v})
                        else:
                            subquery = Q()
                            for v in values:
                                subquery &= Q(**{key: v})
                            all_tasks = all_tasks.exclude(subquery)

                q_main &= query

            all_tasks = all_tasks.filter(q_main).distinct()

        all_tasks_mindmaps = TaskMindMap.objects.filter(
            mindmap_id=mindmap_id
        )
        all_tasks_ids = set(all_tasks.values_list('id', flat=True))
        all_tasks_mindmaps_ids = set(
            all_tasks_mindmaps.values_list('task_id', flat=True))

        difference = all_tasks_ids.difference(all_tasks_mindmaps_ids)

        if len(difference) > 0:
            for pk in difference:
                TaskMindMap.objects.create(
                    mindmap_id=mindmap_id,
                    task_id=pk
                )
            all_tasks_mindmaps = TaskMindMap.objects.filter(
                mindmap_id=mindmap_id
            )

        all_tasks = all_tasks.prefetch_related('tags')
        context['all_tags'] = all_tags
        context['all_tasks'] = all_tasks
        context['all_tasks_mindmaps'] = all_tasks_mindmaps
        context['all_statuses'] = all_statuses
        context['mindmap_id'] = mindmap_id
        context['json_data'] = {
            'tags': [t.to_json() for t in all_tags],
            'statuses': [t.to_json() for t in all_statuses],
            'mindmap': target_mindmap.to_json(),
            'tasks_mindmaps': [t.to_json() for t in all_tasks_mindmaps],
        }
        context['entity_type'] = 'Интеллект-Карта'
        context['page_title_eng'] = 'mindmaps_detail'
        set_client_timezone(self.request, context)
        return context


class MindMapUpdateView(UpdateView):
    model = MindMap
    template_name_suffix = '_update_form'
    form_class = MindMapUpdateForm
    success_url = reverse_lazy('mindmaps_page')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # MindMap.objects.filter(owner_id=self.request.user.id)
        # context['title'] = context["mindmap"]
        context['page_title_eng'] = 'mindmap_edit'

        return context


def add_mindmap(request, *args, **kwargs):
    if request.method == 'POST':
        form = AddMindMapForm(request.POST, request.FILES)
        if form.is_valid():
            current_user = get_user(request)
            form.instance.owner = current_user
            form.save()
            user_settings = UserProfileSettings.objects.get(owner=current_user)
            # dispatch_event('create_mindmap', user_settings)

            return redirect('mindmaps_page')
    else:
        form = AddMindMapForm()
        form.fields['project'].queryset = Project.objects.filter(
            owner_id=request.user.id).all()
    return render(request, 'tudushnik/add_mindmap.html',
                  {'form': form, 'title': 'Добавление интеллект-карты',
                   'page_title_eng': 'mindmaps_create'})


def mindmap_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = MindMap.objects.filter(owner_id=request.user.id,
                                               pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})


# class MindMapList(generics.ListCreateAPIView):
#     serializer_class = MindMapSerializer
#
#     def get_queryset(self):
#         return MindMap.objects.filter(owner_id=self.request.user.id).all()

def task_mindmap_update_attrs(request, *args, **kwargs):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        task_mindmap_id = int(json_data['task_mindmap_id'])
        json_data['task_mindmap_id'] = task_mindmap_id
        target_object = None
        try:
            target_object = TaskMindMap.objects.filter(
                pk=task_mindmap_id).first()
            target_mindmap = MindMap.objects.filter(owner_id=request.user.id,
                                                    pk=target_object.mindmap.pk).first()

            # raise ObjectDoesNotExist()

        except ObjectDoesNotExist:
            json_resp = {
                'success': False,
                'error_message': f'Ошибка! '
                                 f'Карточки с id {task_mindmap_id} не существует!'
            }
            json_resp.update(json_data)
            return JsonResponse(json_resp)

        except PermissionDenied:
            json_resp = {
                'success': False,
                'error_message': 'You do not have permission for this operation!'
            }
            json_resp.update(json_data)
            return JsonResponse(json_resp)

        x = json_data.get('x')
        if x is not None:
            target_object.x = x

        y = json_data.get('y')
        if y is not None:
            target_object.y = y

        width = json_data.get('width')
        if width is not None:
            target_object.width = width

        height = json_data.get('height')
        if height is not None:
            target_object.height = height

        target_object.save()

        json_resp = {'success': True, 'task_mindmap': target_object.to_json()}
        json_resp.update(json_data)
        return JsonResponse(json_resp)
