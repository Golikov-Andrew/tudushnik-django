from rest_framework import generics

from tuduapi.serializers import TaskSerializer, ProjectSerializer, TagSerializer
from tuduapi.views import CustomPagination
from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task


class TaskAPIListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Task.objects.filter(owner_id=self.request.user.id).all()


class TaskAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(owner_id=self.request.user.id).all()


class ProjectAPIListCreate(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Project.objects.filter(owner_id=self.request.user.id).all()


class ProjectAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner_id=self.request.user.id).all()


class TagAPIListCreate(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Tag.objects.filter(owner_id=self.request.user.id).all()


class TagAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(owner_id=self.request.user.id).all()
