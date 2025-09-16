from django.contrib.auth.models import User
from rest_framework import serializers

from tudushnik.models.project import Project
from tudushnik.models.tag import Tag
from tudushnik.models.task import Task


class DefaultValueSerializerMixin:
    def get_fields(self):
        fields = super().get_fields()
        for field_name, field in fields.items():
            model_field = self.Meta.model._meta.get_field(field_name)
            if hasattr(model_field, 'default'):
                field.default = model_field.default
        return fields


class TaskSerializer(DefaultValueSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Task
        # fields = ['id', 'title', 'content', 'begin_at', 'duration', 'project_id']
        read_only_fields = ('owner',)
        fields = '__all__'

    def create(self, validated_data):
        validated_data['owner_id'] = self.context.get('request').user.pk
        tags = validated_data.pop('tags')
        task = Task.objects.create(**validated_data)
        task.tags.set(tags)
        task.save()
        return task


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        # fields = ['id', 'title', 'description', 'color']
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
