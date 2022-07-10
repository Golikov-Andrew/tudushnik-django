from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views.generic import CreateView

from tudushnik.forms.user import RegisterUserForm, LoginUserForm


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
