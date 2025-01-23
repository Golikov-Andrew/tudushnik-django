from django.shortcuts import render

from tudushnik.models.project import Project


def gantt_chart_page(request, *args, **kwargs):
    if request.method == 'GET':
        gantt_chart_datetime_from = request.GET.get('gantt_chart_datetime_from')
        gantt_chart_datetime_to = request.GET.get('gantt_chart_datetime_to')
        selected_projects = request.GET.getlist('project')
        print(gantt_chart_datetime_from, gantt_chart_datetime_to,
              selected_projects)
        all_projects = Project.objects.filter(owner_id=request.user.id)
        kwargs.update(
            {'title': 'Диаграмма Ганта', 'all_projects': all_projects})
        return render(request, 'tudushnik/gantt_chart_page.html', kwargs)
