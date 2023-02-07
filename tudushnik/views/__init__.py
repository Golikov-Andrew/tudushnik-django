from django.http import HttpResponseNotFound
from django.shortcuts import render

from tudushnik.middleware import set_client_timezone


def index(request, **kwargs):
    kwargs.update({'title': 'Главная'})
    set_client_timezone(request, kwargs)
    return render(request, 'tudushnik/homepage.html', kwargs)


def pageNotFound(request, exception):
    return HttpResponseNotFound(content='<h1>Page Not Found</h1>')
