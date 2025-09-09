from django.urls import path
from . import api

urlpatterns = [
    path('tasks/', api.TaskAPIListCreate.as_view(),
         name='api_tasks_list_create'),
    path('tasks/<int:pk>/', api.TaskAPIRetrieveUpdateDestroy.as_view(),
         name='api_tasks_retrieve_update-destroy'),
    path('projects/', api.ProjectAPIListCreate.as_view(),
         name='api_projects_list_create'),
    path('projects/<int:pk>/', api.ProjectAPIRetrieveUpdateDestroy.as_view(),
         name='api_projects_retrieve_update-destroy'),
    path('tags/', api.TagAPIListCreate.as_view(),
         name='api_tags_list_create'),
    path('tags/<int:pk>/', api.TagAPIRetrieveUpdateDestroy.as_view(),
         name='api_tags_retrieve_update-destroy'),

]
