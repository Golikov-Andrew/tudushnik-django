from django import forms

from tudushnik.models.task import Task


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
                  'duration', 'children'
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
            }),
            'children': forms.SelectMultiple(),
        }
        labels = {
            'title': 'Название',
            'content': 'Содержание',
            'is_done': 'Done?',
            'project': 'Проект',
            'tags': 'Тэги',
            'begin_at': 'Начало',
            'duration': 'Продолж.',
            'children': 'Дочерние задачи',
        }
