from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from tuduapi.serializers import TaskSerializer, ProjectSerializer, TagSerializer
from tuduapi.views import CustomPagination
from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task
from tudushnik.serializers import UserSerializer, UserSerializerPost, \
    UserSerializerDetails, UserSerializerUpdate


class UserAPIList(generics.ListAPIView):
    serializer_class = UserSerializer
    pagination_class = CustomPagination
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return User.objects.all()


class UserAPICreate(generics.CreateAPIView):
    serializer_class = UserSerializerPost

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UserAPIRetrieve(generics.RetrieveAPIView):
    serializer_class = UserSerializerDetails
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return User.objects.filter(pk=self.kwargs['pk']).all()

    def get(self, request, *args, **kwargs):
        instance = User.objects.get(pk=kwargs['pk'])
        if instance.pk != request.user.pk:
            serializer = UserSerializerDetails(instance,
                                               exclude=['password',
                                                        'is_superuser',
                                                        'is_staff', 'is_active',
                                                        'groups',
                                                        'user_permissions'])
        else:
            serializer = UserSerializerDetails(instance)
        return Response(serializer.data)


class UserAPIUpdate(generics.UpdateAPIView):
    serializer_class = UserSerializerUpdate
    http_method_names = ['patch']

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.id).all()


class TaskAPIListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    pagination_class = CustomPagination
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Task.objects.filter(owner_id=self.request.user.id).all()


class TaskAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(owner_id=self.request.user.id).all()


class ProjectAPIListCreate(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    pagination_class = CustomPagination
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Project.objects.filter(owner_id=self.request.user.id).all()


class ProjectAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner_id=self.request.user.id).all()


class TagAPIListCreate(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    pagination_class = CustomPagination
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Tag.objects.filter(owner_id=self.request.user.id).all()


class TagAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(owner_id=self.request.user.id).all()
