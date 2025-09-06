import json
from datetime import datetime, timedelta

from django.db.models import Q
from django.shortcuts import render

from tudushnik.models.project import Project


def gantt_chart_page(request, *args, **kwargs):
    if request.method == 'GET':
        gantt_chart_datetime_from = request.GET.get('gantt_chart_datetime_from')
        gantt_chart_datetime_to = request.GET.get('gantt_chart_datetime_to')
        selected_projects = [int(i) for i in request.GET.getlist(
            'selected_projects[]')]
        if gantt_chart_datetime_from is None:
            gantt_chart_datetime_from = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%dT%H:%M')

        if gantt_chart_datetime_to is None:
            gantt_chart_datetime_to = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%dT%H:%M')

        print(gantt_chart_datetime_from, gantt_chart_datetime_to,
              selected_projects)
        gantt_apply_filters = {
            "date_from": gantt_chart_datetime_from,
            "date_to": gantt_chart_datetime_to,
        }
        all_projects = Project.objects.filter(owner_id=request.user.id)

        other_projects = Project.objects.filter(
            Q(users_groups__users=request.user.id) & Q(
                users_groups__is_active=True) & Q(
                users_groups__permission_view_project=True))

        all_projects = all_projects.union(other_projects)

        if len(selected_projects) == 0:
            selected_projects = [int(i.pk) for i in all_projects.all()]
        gantt_apply_filters['selected_projects'] = selected_projects
        kwargs.update(
            {
                "title": "Диаграмма Ганта", "all_projects": all_projects,
                'selected_projects': selected_projects,
                "gantt_apply_filters": json.dumps(gantt_apply_filters),
                "page_title_eng": 'gantt'
            }
        )
        return render(request, 'tudushnik/gantt_chart_page.html', kwargs)
