from django.urls import path

from .views import *

urlpatterns = [
    path('', index, name='homepage'),
    path('projects/', projects_page, name='projects_page'),
    path('tasks/', tasks_page, name='tasks_page'),
    path('tags/', tags_page, name='tags_page'),
    path('projects/create', add_project, name='add_project'),
    path('tasks/create', add_task, name='add_task'),
    path('login/', LoginUser.as_view(), name='login'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('profile/', profile, name='profile'),
    path('logout/', logout_user, name='logout')
]

