from django import forms
from tudushnik.models.tag import Tag


class AddTagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['title','color']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'color': forms.TextInput(attrs={
                'type': 'color'
            })
        }
        labels = {
            'title': 'Текст',
            'color': 'Цвет',
        }


class TagUpdateForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['title','color']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'color': forms.TextInput(attrs={
                'type': 'color'
            })
        }
        labels = {
            'title': 'Текст',
            'color': 'Цвет',
        }
