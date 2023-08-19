from django import forms

from tudushnik.models.task import Task


class AddTaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'content', 'project', 'tags', 'begin_at',
                  'duration'
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
            })
        }
        labels = {
            'title': 'Название',
            'content': 'Содержимое',
            'project': 'Проект',
            'tags': 'Тэги',
            'begin_at': 'Начало',
            'duration': 'Продолжительность',
        }


class TaskUpdateForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'content', 'is_done', 'project', 'tags', 'begin_at',
                  'duration'
                  ]
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

            'tags': forms.SelectMultiple(),
            'begin_at': forms.TextInput(attrs={
                'type': 'datetime-local'
            }),
            'duration': forms.TextInput(attrs={
                'type': 'number',
                'step': '60',
                'min': '0',
                'class': 'hidden_form_elem'
            })
        }
        labels = {
            'title': 'Название',
            'content': 'Содержание',
            'is_done': 'Выполнена?',
            'project': 'Проект',
            'tags': 'Тэги',
            'begin_at': 'Начало',
            'duration': 'Продолжительность',
        }
