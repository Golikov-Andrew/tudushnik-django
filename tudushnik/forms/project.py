from django import forms

from tudushnik.models.project import Project


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
        labels = {
            'title': 'Название',
            'description': 'Описание',
        }


class ProjectUpdateForm(forms.ModelForm):
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
        labels = {
            'title': 'Название',
            'description': 'Описание',
        }
