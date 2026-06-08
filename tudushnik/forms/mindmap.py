from django import forms

from tudushnik.models.mindmap import MindMap


class AddMindMapForm(forms.ModelForm):
    class Meta:
        model = MindMap
        fields = ['title', 'description', 'project']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'project': forms.Select(),
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'project': 'Проект'
        }


class MindMapUpdateForm(forms.ModelForm):
    class Meta:
        model = MindMap
        fields = ['title', 'description']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            })
        }
        labels = {
            'title': 'Название',
            'description': 'Описание'
        }

