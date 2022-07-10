from django import forms

from tudushnik.models.project import Project
from tudushnik.models.task import Task


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
        labels = {
            'title': 'Название',
            'content': 'Содержимое',
            'project': 'Проект',
        }


class TaskUpdateForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'content', 'is_done', 'project']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'content': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),

            'is_done': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'project': forms.Select(attrs={
                'class': 'form-input'
            }),
        }
        labels = {
            'title': 'Название',
            'content': 'Содержание',
            'is_done': 'Выполнена?',
            'project': 'Проект',
        }
