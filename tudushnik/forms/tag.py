from django import forms
from tudushnik.models.tag import Tag


class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['title', 'color', 'text_color']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'color': forms.TextInput(attrs={
                'type': 'color'
            }),
            'text_color': forms.TextInput(attrs={
                'type': 'color'
            })
        }
        labels = {
            'title': 'Текст',
            'color': 'Цвет',
            'text_color': 'Цвет текста',
        }
