from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from tuduapi.generators import BothHttpAndHttpsSchemaGenerator

schema_view = get_schema_view(
    openapi.Info(
        title="TUDUSHNIK API",
        default_version='v1',
        description="Аутентификация, CRUD Проектов, Задач и Тегов",
        terms_of_service="https://www.example.com/policies",
        contact=openapi.Contact(email="golikovandrew13@yandex.ru"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    patterns=[path('api/v1/', include('tuduapi.urls')), ],
    permission_classes=[permissions.IsAuthenticated],
    generator_class=BothHttpAndHttpsSchemaGenerator

)
