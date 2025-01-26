from django import forms

from tudushnik.models.project import Project


class AddProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'color']
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
            })
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'color': 'Цвет',
        }


class ProjectUpdateForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'color']
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
            })
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'color': 'Цвет',
        }
