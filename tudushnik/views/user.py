import json
from datetime import datetime, timedelta

import pytz
from django.contrib.auth.models import Group, User
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from django.views.generic import ListView, DetailView
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions, viewsets

from tudushnik.middleware import set_client_timezone
from tudushnik.models.user_event_snapshot import UserEventSnapshot
from tudushnik.models.user_level import UserLevel
from tudushnik.models.user_profile_settings import UserProfileSettings, \
    manage_user_settings
from tudushnik.models.user_rank import UserRank
from tudushnik.serializers import UserSerializer, GroupSerializer


class APIDocHideMixin(viewsets.ModelViewSet):
    @swagger_auto_schema(auto_schema=None)
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class UserViewSet(APIDocHideMixin):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(APIDocHideMixin):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserListView(ListView):
    model = UserProfileSettings
    template_name = 'tudushnik/users_page.html'

    def get_context_data(self, **kwargs):
        context = super(UserListView, self).get_context_data(**kwargs)
        context['title'] = 'Люди'
        per_page = self.request.GET.get('limit')
        search_section = self.request.GET.get('search')
        sorting_section = self.request.GET.get('sorting')
        filter_section = self.request.GET.get('filter')
        per_page = manage_user_settings(self.request.user.id, per_page)
        request_user_id = self.request.user.id

        all_users = UserProfileSettings.objects.all()
        all_levels = UserLevel.objects.all()
        all_ranks = UserRank.objects.all()

        if search_section is not None:
            search_section_obj = json.loads(search_section)
            kw = dict()
            for key, value in search_section_obj.items():
                kw[key + '__icontains'] = value
            all_users = all_users.filter(**kw)

        if sorting_section is not None:
            sorting_section_list = json.loads(sorting_section)
            ls = list()
            for item in sorting_section_list:
                ls.append(item['v'] + item['n'])
            print(ls)
            all_users = all_users.order_by(*ls)

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
                                all_users = all_users.filter(**{key: v})
                        else:
                            subquery = Q()
                            for v in values:
                                subquery &= Q(**{key: v})
                            all_users = all_users.exclude(subquery)

                q_main &= query

            all_users = all_users.filter(q_main).distinct()

        paginator = Paginator(all_users, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_users)
        context['all_levels'] = all_levels
        context['all_ranks'] = all_ranks
        context['json_data'] = {
            'all_ranks': [t.to_json() for t in all_ranks],
        }
        context['page_title_eng'] = 'users_page'
        set_client_timezone(self.request, context)

        return context


class UserDetailView(DetailView):
    model = UserProfileSettings
    template_name = 'tudushnik/user_detail.html'

    def get_queryset(self):
        return UserProfileSettings.objects.all()

    def get_object(self):
        obj = super().get_object()
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title_eng'] = "account_page"
        context['user_settings_id'] = context['object'].pk
        set_client_timezone(self.request, context)
        return context


def events_fetch(request, *args, **kwargs):
    if request.method == 'POST':
        json_obj = json.loads(request.body)
        user_settings_id = json_obj['user_settings_id']
        days = json_obj['days']
        date_to = datetime.now()
        date_from = date_to - timedelta(days=int(days))

        cur_tz = set_client_timezone(request, kwargs)
        offset = pytz.timezone(cur_tz).utcoffset(datetime.now())
        # date_from_parsed = datetime.fromisoformat(date_from)
        # date_to_parsed = datetime.fromisoformat(date_to)
        date_from = (date_from + offset).strftime('%Y-%m-%dT%H:%M')
        date_to = (date_to + offset).strftime('%Y-%m-%dT%H:%M')

        query = UserEventSnapshot.objects.filter(
            user_settings__id=user_settings_id,
            happened_at__gte=date_from,
            happened_at__lt=date_to
        )

        result = query.all()
        if result is None:
            result = list()

        return JsonResponse(
            {
                'success': True,
                # 'offset': str(offset),
                'events': [t.to_json() for t in result]
            }
        )