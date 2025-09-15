from django.urls import path
from . import api
from .views import DecoratedTokenObtainPairView, DecoratedTokenRefreshView

urlpatterns = [
    path('token/', DecoratedTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', DecoratedTokenRefreshView.as_view(),
         name='token_refresh'),

    path('users/', api.UserAPIList.as_view(),
         name='api_users_list'),
    path('users/create/', api.UserAPICreate.as_view(),
         name='api_users_create'),
    path('users/details/<int:pk>/', api.UserAPIRetrieve.as_view(),
         name='api_users_retrieve'),
    path('users/update/<int:pk>/', api.UserAPIUpdate.as_view(),
         name='api_users_update'),

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
