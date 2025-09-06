from django import forms

from tudushnik.models.users_group import UsersGroup


class AddUsersGroupForm(forms.ModelForm):
    class Meta:
        model = UsersGroup
        fields = [
            'title',
            'description',
            'is_active',
            'tags',
            'permission_view_project',
            'permission_view_tasks_list',
            'permission_view_project_tasks',
            'permission_create_task',
            'permission_update_task',
            'permission_delete_task',
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'tags': forms.SelectMultiple(),
            'permission_view_project': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_view_tasks_list': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_view_project_tasks': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_create_task': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_update_task': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_delete_task': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'is_active': 'Активирована?',
            'tags': 'Тэги',
            'permission_view_project': 'Право просмотра проектов',
            'permission_view_tasks_list': 'Право просмотра листинга задач проекта',
            'permission_view_project_tasks': 'Право просмотра задачи проекта',
            'permission_create_task': 'Право создавать задачу',
            'permission_update_task': 'Право редактировать задачу',
            'permission_delete_task': 'Право удалять задачу',
        }


class UsersGroupUpdateForm(forms.ModelForm):
    class Meta:
        model = UsersGroup
        fields = [
            'title',
            'description',
            'is_active',
            'tags',
            'projects',
            'users',
            'permission_view_project',
            'permission_view_tasks_list',
            'permission_view_project_tasks',
            'permission_create_task',
            'permission_update_task',
            'permission_delete_task',
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input'
            }),
            'description': forms.Textarea(attrs={
                'cols': 60,
                'rows': 10
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'tags': forms.SelectMultiple(),
            'projects': forms.SelectMultiple(),
            'users': forms.SelectMultiple(),
            'permission_view_project': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_view_tasks_list': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_view_project_tasks': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_create_task': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_update_task': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
            'permission_delete_task': forms.CheckboxInput(attrs={
                'class': 'form-input'
            }),
        }
        labels = {
            'title': 'Название',
            'description': 'Описание',
            'is_active': 'Активирована?',
            'tags': 'Тэги',
            'projects': 'Проекты',
            'users': 'Участники',
            'permission_view_project': 'Право просмотра проектов',
            'permission_view_tasks_list': 'Право просмотра листинга задач проекта',
            'permission_view_project_tasks': 'Право просмотра задачи проекта',
            'permission_create_task': 'Право создавать задачу',
            'permission_update_task': 'Право редактировать задачу',
            'permission_delete_task': 'Право удалять задачу',
        }
