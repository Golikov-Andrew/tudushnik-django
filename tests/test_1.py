import pytest
from django.contrib.auth.models import User
from django.db.models.base import ObjectDoesNotExist
from tudushnik.models.project import Project
from tudushnik.models.task import Task


@pytest.mark.django_db
def test_create_n_delete_user():
    test_user = User.objects.create(username='test_user_name',
                                    email='test_user@email.ru',
                                    password='sdifusifum')
    test_user_2 = User.objects.get(username='test_user_name')
    assert test_user == test_user_2
    test_user_2.delete()
    try:
        test_user_2 = User.objects.get(username='test_user_name')
    except ObjectDoesNotExist:
        test_user_2 = None
    assert test_user_2 is None


def test_with_guest_client(client):
    response = client.get('/')
    page_text = response.content.decode('utf-8')
    assert 'Для начала работы вам необходимо ' in page_text
    assert 'Проекты' not in page_text
    assert 'Задачи' not in page_text
    assert 'Тэги' not in page_text
    assert 'Админка' not in page_text


@pytest.mark.django_db
def test_with_authenticated_client(client, django_user_model):
    # Создание Клиента
    username = "foo_user"
    password = "bar_password"
    user = django_user_model.objects.create_user(username=username,
                                                 password=password)
    client.force_login(user)
    response = client.get('/')
    page_text = response.content.decode('utf-8')
    assert 'Для начала создайте Проект. Затем в нём Задачу.' in page_text

    # Создание Проекта
    response = client.post('/projects/create',
                           data={'title': 'test project name',
                                 'description': 'test project description'})
    created_project = Project.objects.get(title='test project name')
    assert response.url == '/projects/'
    assert response.status_code == 302
    assert created_project.description == 'test project description'

    # Создание Задачи
    response = client.post('/tasks/create',
                           data={'title': 'test task name',
                                 'content': 'test task description',
                                 'project': created_project.id,
                                 'begin_at': '2023-05-31T00:00:00',
                                 'tags': [],
                                 'duration': 200})
    created_task = Task.objects.get(title='test task name')
    assert created_task.content == 'test task description'
    assert response.status_code == 302
    assert response.url == '/tasks/'
