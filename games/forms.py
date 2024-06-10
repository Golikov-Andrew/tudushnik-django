from django import forms

from .models import Game


class AddGameForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = ['title', 'state', 'creator']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'state': forms.Textarea(attrs={
                'class': 'form-input hidden'
            }),
            'creator': forms.TextInput(attrs={
                'class': 'form-input hidden'
            }),
        }
        labels = {
            'title': 'Название',
            'state': 'State',
            'creator': 'Создатель',
        }

