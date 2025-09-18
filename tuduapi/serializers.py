from django.contrib.auth.models import User
from django.db.models import NOT_PROVIDED
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
        read_only_fields = ('owner',)
        fields = '__all__'

    def create(self, validated_data):
        validated_data['owner_id'] = self.context.get('request').user.pk
        tags = validated_data.pop('tags')
        task = Task.objects.create(**validated_data)
        if not isinstance(tags, NOT_PROVIDED):
            task.tags.set(tags)
        task.save()
        return task


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('owner',)
        tags = serializers.ListField(
            child=serializers.IntegerField(),
            required=False
        )

    def create(self, validated_data):
        validated_data['owner_id'] = self.context.get('request').user.pk
        tags = None
        if 'tags' in validated_data:
            tags = validated_data.pop('tags')

        project = Project.objects.create(**validated_data)
        if not isinstance(tags, NOT_PROVIDED) and tags is not None:
            project.tags.set(tags)
        project.save()
        return project


class TagSerializer(DefaultValueSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ('owner',)

    def create(self, validated_data):
        validated_data['owner_id'] = self.context.get('request').user.pk
        return Tag.objects.create(**validated_data)
