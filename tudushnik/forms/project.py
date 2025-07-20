from django import forms

from tudushnik.models.project import Project


class AddProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'color', 'tags']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'color': forms.TextInput(attrs={
                'type': 'color'
            }),
            'tags': forms.SelectMultiple(),
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'color': 'Цвет',
            'tags': 'Тэги'
        }


class ProjectUpdateForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'color', 'tags']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'color': forms.TextInput(attrs={
                'type': 'color'
            }),
            'tags': forms.SelectMultiple(),
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'color': 'Цвет',
            'tags': 'Тэги'
        }
