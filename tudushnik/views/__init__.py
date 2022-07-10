# from django.contrib.auth import logout, login, get_user
# from django.contrib.auth.views import LoginView
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, redirect
# from django.urls import reverse_lazy
# from django.views.generic import CreateView


# from .forms import AddProjectForm, RegisterUserForm, LoginUserForm, AddTaskForm
# from .models import *


def index(request):
    return render(request, 'tudushnik/homepage.html', {'title': 'Главная'})




def pageNotFound(request, exception):
    return HttpResponseNotFound(content='<h1>Page Not Found</h1>')
