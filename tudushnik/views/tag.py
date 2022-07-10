from django.shortcuts import render, redirect


# from tudushnik.forms.task import AddTaskForm
# from tudushnik.models.project import Project
# from tudushnik.models.task import Task


def tags_page(request):
    # tasks = Tags.objects.filter(project__in=Project.objects.filter(owner_id=request.user.id))
    return render(request, 'tudushnik/tags_page.html', {
        'title': 'Тэги',
        # 'tasks': tasks,
    })


def add_tag(request):
    # if request.method == 'POST':
    #     form = AddTaskForm(request.POST, request.FILES)
    #     if form.is_valid():
    #         form.save()
    #         return redirect('tasks_page')
    # else:
    #     form = AddTaskForm()
    #     form.fields['project'].queryset =Project.objects.filter(owner_id=request.user.id).all()
    # return render(request, 'tudushnik/add_task.html', {'form': form, 'title': 'Добавление задачи'})

    return render(request, 'tudushnik/tags_page.html', {
        'title': 'Тэги',
        # 'tasks': tasks,
    })
