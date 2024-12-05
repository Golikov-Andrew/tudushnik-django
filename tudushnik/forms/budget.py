from django import forms

from tudushnik.models.budget import Budget


class AddBudgetForm(forms.ModelForm):
    class Meta:
        model = Budget
        fields = ['title', 'description','current_value']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'current_value': forms.TextInput(attrs={
                'type': 'number',
                'step': '10',
                'min': '0'
            })
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'current_value': 'Текущее значение',
        }


class BudgetUpdateForm(forms.ModelForm):
    class Meta:
        model = Budget
        fields = ['title', 'description', 'current_value']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'current_value': forms.TextInput(attrs={
                'type': 'number',
                'step': '10',
                'min': '0'
            })
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'current_value': 'Текущее значение',
        }
