from rest_framework import serializers

from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        # fields = ['id', 'title', 'content', 'begin_at', 'duration', 'project_id']
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        # fields = ['id', 'title', 'description', 'color']
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
