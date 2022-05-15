from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from .models import *


class AddProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
        }


class AddTaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'content', 'project']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'content': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
        }


class RegisterUserForm(UserCreationForm):
    username = forms.CharField(label='Логин', widget=forms.TextInput(attrs={'class': 'form-input'}))
    email = forms.EmailField(label='Email', widget=forms.EmailInput(attrs={'class': 'form-input'}))
    password1 = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'class': 'form-input'}))
    password2 = forms.CharField(label='Повтор пароля', widget=forms.PasswordInput(attrs={'class': 'form-input'}))

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'email']


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(label='Логин', widget=forms.TextInput(attrs={'class': 'form-input'}))
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'class': 'form-input'}))
