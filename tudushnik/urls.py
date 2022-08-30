from django.urls import path

from .views import index
from .views.auth import LoginUser, profile, logout_user, RegisterUser
from .views.project import add_project, ProjectListView, ProjectDetailView, project_delete, ProjectUpdateView
from .views.tag import TagListView, TagDetailView, tag_delete, TagUpdateView, add_tag

from .views.task import add_task, TaskListView, TaskDetailView, task_delete, TaskUpdateView, \
    add_task_to_project

urlpatterns = [
    path('', index, name='homepage'),
    path('projects/', ProjectListView.as_view(), name='projects_page'),
    path('projects/detail/<int:pk>/', ProjectDetailView.as_view(), name='project_detail'),
    path('projects/delete/<int:pk>/', project_delete, name='project_delete'),
    path('projects/edit/<int:pk>/', ProjectUpdateView.as_view(), name='project_edit'),
    path('projects/create', add_project, name='add_project'),

    path('tasks/', TaskListView.as_view(), name='tasks_page'),
    path('tasks/detail/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
    path('tasks/delete/<int:pk>/', task_delete, name='task_delete'),
    path('tasks/edit/<int:pk>/', TaskUpdateView.as_view(), name='task_edit'),
    path('tasks/create', add_task, name='add_task'),
    path('tasks/add_to_project/<int:project_pk>/', add_task_to_project, name='add_task_to_project'),

    path('tags/', TagListView.as_view(), name='tags_page'),
    path('tags/detail/<int:pk>/', TagDetailView.as_view(), name='tag_detail'),
    path('tags/delete/<int:pk>/', tag_delete, name='tag_delete'),
    path('tags/edit/<int:pk>/', TagUpdateView.as_view(), name='tag_edit'),
    path('tags/create', add_tag, name='add_tag'),

    path('login/', LoginUser.as_view(), name='login'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('profile/', profile, name='profile'),
    path('logout/', logout_user, name='logout')
]
