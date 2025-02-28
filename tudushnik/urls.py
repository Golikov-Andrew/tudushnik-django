from django.urls import path

from .views import index
from .views.auth import LoginUser, profile, logout_user, RegisterUser
from .views.calendar import calendar_page
from .views.check import CheckListView, CheckDetailView, checks_fetch, \
    check_delete, CheckUpdateView, \
    check_update_attrs, add_check, add_check_to_budget
from .views.financy import BudgetListView, BudgetDetailView, budget_delete, \
    BudgetUpdateView, add_budget
from .views.gantt import gantt_chart_page
from .views.project import add_project, ProjectListView, ProjectDetailView, \
    project_delete, ProjectUpdateView
from .views.snippet import SnippetList, SnippetDetail
# from .views.snippet import view_snippets
from .views.tag import TagListView, TagDetailView, tag_delete, TagUpdateView, \
    add_tag

from .views.task import add_task, TaskListView, TaskDetailView, task_delete, \
    TaskUpdateView, add_task_to_project, task_update_attrs, tasks_fetch, TaskList

urlpatterns = [
    path('', index, name='homepage'),

    path('projects/', ProjectListView.as_view(), name='projects_page'),
    path('projects/detail/<int:pk>/', ProjectDetailView.as_view(),
         name='project_detail'),
    path('projects/delete/<int:pk>/', project_delete, name='project_delete'),
    path('projects/edit/<int:pk>/', ProjectUpdateView.as_view(),
         name='project_edit'),
    path('projects/create', add_project, name='add_project'),

    path('budgets/', BudgetListView.as_view(), name='budgets_page'),
    path('budgets/detail/<int:pk>/', BudgetDetailView.as_view(),
         name='budget_detail'),
    path('budgets/delete/<int:pk>/', budget_delete, name='budget_delete'),
    path('budgets/edit/<int:pk>/', BudgetUpdateView.as_view(),
         name='budget_edit'),
    path('budgets/create', add_budget, name='add_budget'),

    path('tasks/', TaskListView.as_view(), name='tasks_page'),
    path('tasks/fetch', tasks_fetch, name='tasks_fetch'),
    path('tasks/detail/<int:pk>/', TaskDetailView.as_view(),
         name='task_detail'),
    path('tasks/delete/<int:pk>/', task_delete, name='task_delete'),
    path('tasks/edit/<int:pk>/', TaskUpdateView.as_view(), name='task_edit'),
    path('tasks/update_attrs', task_update_attrs, name='task_update_attrs'),
    path('tasks/create', add_task, name='add_task'),
    path('tasks/add_to_project/<int:project_pk>/', add_task_to_project,
         name='add_task_to_project'),

    path('gantt/', gantt_chart_page, name='gantt_chart_page'),
    path('calendar/', calendar_page, name='calendar_page'),
    path('calendar/list', TaskList.as_view()),

    path('checks/', CheckListView.as_view(), name='checks_page'),
    path('checks/fetch', checks_fetch, name='checks_fetch'),
    path('checks/detail/<int:pk>/', CheckDetailView.as_view(),
         name='check_detail'),
    path('checks/delete/<int:pk>/', check_delete, name='check_delete'),
    path('checks/edit/<int:pk>/', CheckUpdateView.as_view(), name='check_edit'),
    path('checks/update_attrs', check_update_attrs, name='check_update_attrs'),
    path('checks/create', add_check, name='add_check'),
    path('checks/add_to_budget/<int:budget_pk>/', add_check_to_budget,
         name='add_check_to_budget'),

    path('tags/', TagListView.as_view(), name='tags_page'),
    path('tags/detail/<int:pk>/', TagDetailView.as_view(), name='tag_detail'),
    path('tags/delete/<int:pk>/', tag_delete, name='tag_delete'),
    path('tags/edit/<int:pk>/', TagUpdateView.as_view(), name='tag_edit'),
    path('tags/create', add_tag, name='add_tag'),

    path('login/', LoginUser.as_view(), name='login'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('profile/', profile, name='profile'),
    path('logout/', logout_user, name='logout'),

    path('snippets/', SnippetList.as_view()),
    path('snippets/<int:pk>/', SnippetDetail.as_view()),
    # path('snippet/', view_snippets, name='view_snippets'),
]
