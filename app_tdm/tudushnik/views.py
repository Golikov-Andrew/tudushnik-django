from django.contrib.auth import logout, login, get_user
from django.contrib.auth.views import LoginView
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .forms import AddProjectForm, RegisterUserForm, LoginUserForm, AddTaskForm
from .models import *


def index(request):
    return render(request, 'tudushnik/homepage.html', {'title': 'homepage'})


def projects_page(request):
    projects = Project.objects.filter(owner_id=request.user.id)
    print(projects, flush=True)
    return render(request, 'tudushnik/projects_page.html', {
        'title': 'projects_page',
        'projects': projects,
    })


def tasks_page(request):
    tasks = Task.objects.filter(project__in=Project.objects.filter(owner_id=request.user.id))
    return render(request, 'tudushnik/tasks_page.html', {
        'title': 'tasks_page',
        'tasks': tasks,
    })


def tags_page(request):
    return HttpResponse('Tags Page')


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


def add_task(request):
    if request.method == 'POST':
        form = AddTaskForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('tasks_page')
    else:
        form = AddTaskForm()
    return render(request, 'tudushnik/add_task.html', {'form': form, 'title': 'Добавление задачи'})


def pageNotFound(request, exception):
    return HttpResponseNotFound(content='<h1>Page Not Found</h1>')


class RegisterUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'tudushnik/register.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('profile')


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'tudushnik/login.html'

    def get_success_url(self):
        return reverse_lazy('profile')


def profile(request):
    return render(request, 'tudushnik/profile.html', {'title': 'Профиль'})


def logout_user(request):
    logout(request)
    return redirect('login')
