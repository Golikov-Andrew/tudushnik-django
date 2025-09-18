from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.http import HttpResponseForbidden
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views.generic import CreateView
from rest_framework_simplejwt.tokens import RefreshToken

from tudushnik.forms.user import RegisterUserForm, LoginUserForm
from tudushnik.middleware import set_client_timezone


class RegisterUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'tudushnik/register.html'
    success_url = reverse_lazy('login')

    def get_context_data(self, **kwargs):
        context = super(RegisterUser, self).get_context_data(**kwargs)
        context['page_title_eng'] = 'register_page'
        return context

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('profile')


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'tudushnik/login.html'

    def get_context_data(self, **kwargs):
        context = super(LoginUser, self).get_context_data(**kwargs)
        context['page_title_eng'] = 'login_page'
        return context

    def get_success_url(self):
        return reverse_lazy('profile')

    def form_valid(self, form):
        user = form.get_user()
        refresh = RefreshToken.for_user(user)
        response = super().form_valid(form)

        response.set_cookie('refresh_token', str(refresh),
                             httponly=True, secure=True, samesite='None')
        response.set_cookie('access_token', str(refresh.access_token),
                             httponly=True, secure=True, samesite='None')
        return response

    def form_invalid(self, form):
        return HttpResponseForbidden({'error': 'Неверные учетные данные'})


def profile(request, **kwargs):
    set_client_timezone(request, kwargs)
    kwargs.update({'title': 'Профиль'})
    kwargs.update({'page_title_eng': 'account_page'})
    return render(request, 'tudushnik/profile.html', kwargs)


def logout_user(request, **kwargs):
    logout(request)
    response = redirect('login')
    response.delete_cookie('refresh_token', samesite='None')
    response.delete_cookie('access_token', samesite='None')
    return response
