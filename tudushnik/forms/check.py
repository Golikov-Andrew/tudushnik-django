from django import forms

from tudushnik.models.check import Check


class AddCheckForm(forms.ModelForm):
    class Meta:
        model = Check
        fields = ['title', 'content', 'budget', 'is_done', 'is_profit',
                  'datetime_at','value','tags'
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
            'datetime_at': forms.TextInput(attrs={
                'type': 'datetime-local'
            }),
            'value': forms.TextInput(attrs={
                'type': 'number',
                'step': '1',
                'min': '0'
            })
        }
        labels = {
            'title': 'Название',
            'content': 'Описание',
            'budget': 'Бюджет',
            'tags': 'Тэги',
            'datetime_at': 'Дата-время',
            'value': 'Значение',
            'is_profit': 'Доход?',
            'is_done': 'Произведён?',
        }


class CheckUpdateForm(forms.ModelForm):
    class Meta:
        model = Check
        fields = ['title', 'content', 'budget', 'is_done', 'is_profit',
                  'datetime_at', 'value', 'tags'
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
            'datetime_at': forms.TextInput(attrs={
                'type': 'datetime-local'
            }),
            'value': forms.TextInput(attrs={
                'type': 'number',
                'step': '1',
                'min': '0'
            })
        }
        labels = {
            'title': 'Название',
            'content': 'Описание',
            'budget': 'Бюджет',
            'tags': 'Тэги',
            'datetime_at': 'Дата-время',
            'value': 'Значение',
            'is_profit': 'Доход?',
            'is_done': 'Произведён?',
        }
