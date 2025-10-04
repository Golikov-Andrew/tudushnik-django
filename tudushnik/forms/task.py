from django import forms
from django.contrib.auth.models import User
from django.db.models import Q

from tudushnik.models.project import Project
from tudushnik.models.task import Task
from tudushnik.models.users_group import UsersGroup


class AddTaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'content', 'project', 'tags', 'begin_at',
                  'duration', 'diagram_offset_x'
                  ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'content': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'tags': forms.SelectMultiple(),
            'begin_at': forms.TextInput(attrs={
                'type': 'datetime-local'
            }),
            'duration': forms.TextInput(attrs={
                'type': 'number',
                'step': '60',
                'min': '0',
                'class': 'hidden_form_elem'
            }),
            'diagram_offset_x': forms.TextInput(attrs={
                'type': 'number',
                'min': '0',
            }),

        }
        labels = {
            'title': 'Название',
            'content': 'Описание',
            'project': 'Проект',
            'tags': 'Тэги',
            'begin_at': 'Начало',
            'duration': 'Продолж.',
            'diagram_offset_x': 'Оффсет',
        }


class TaskUpdateForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'content', 'is_done', 'project', 'tags', 'begin_at',
                  'duration', 'children', 'accountable', 'responsible',
                  'consultant', 'informed'
                  ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'content': forms.Textarea(),

            'is_done': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'project': forms.Select(attrs={
                'class': 'form-input'
            }),

            'tags': forms.SelectMultiple(),
            'begin_at': forms.TextInput(attrs={
                'type': 'datetime-local'
            }),
            'duration': forms.TextInput(attrs={
                'type': 'number',
                'step': '60',
                'min': '0',
                'class': 'hidden'
            }),
            'children': forms.SelectMultiple(),
            'accountable': forms.Select(attrs={
                'class': 'form-input'
            }),
            'responsible': forms.SelectMultiple(),
            'consultant': forms.SelectMultiple(),
            'informed': forms.SelectMultiple(),
        }
        labels = {
            'title': 'Название',
            'content': 'Содержание',
            'is_done': 'Готово?',
            'project': 'Проект',
            'tags': 'Тэги',
            'begin_at': 'Начало',
            'duration': 'Продолж.',
            'children': 'Дочерние задачи',
            'accountable': 'Ответственный',
            'responsible': 'Исполнители',
            'consultant': 'Консультирующие',
            'informed': 'Информируемые',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        project_id = self.initial['project']

        user_groups_ids = UsersGroup.objects.filter(
            projects__in=[project_id, ], is_active=True
        ).values_list('id', flat=True)
        users = User.objects.filter(
            Q(users_groups__in=user_groups_ids,
              users_groups__is_active=True) | Q(project=project_id)).distinct()

        self.fields['accountable'].queryset = users
        self.fields['responsible'].queryset = users
        self.fields['consultant'].queryset = users
        self.fields['informed'].queryset = users
