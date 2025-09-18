from django.contrib.auth.models import Group, User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from tudushnik.models.user_profile_settings import UserProfileSettings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ('last_login', 'is_active', 'date_joined', 'groups')
        exclude = (
            'password', 'is_staff', 'is_superuser', 'user_permissions',
            'groups')


class UserSerializerDetails(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        excluded_fields = kwargs.pop('exclude', None)
        super().__init__(*args, **kwargs)
        if excluded_fields:
            current_fields = list(self.fields.keys())
            for field_name in excluded_fields:
                if field_name in current_fields:
                    self.fields.pop(field_name)

    class Meta:
        model = User
        read_only_fields = (
            'last_login', 'is_active', 'date_joined', 'user_permissions',
            'is_staff', 'is_superuser',)
        fields = '__all__'


class UserSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = (
            'is_staff', 'is_superuser', 'user_permissions',
            'last_login', 'is_active', 'date_joined', 'groups')
        exclude = ('is_staff', 'is_superuser', 'user_permissions',
                   'last_login', 'is_active', 'date_joined',
                   )

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        password = validated_data.get('password')
        if password is not None:
            instance.set_password(password)
            instance.save()

        return instance


class UserSerializerPost(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        read_only_fields = ('last_login', 'is_active', 'date_joined', 'groups')
        exclude = ('is_staff', 'is_superuser', 'user_permissions')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        new_user_settings = UserProfileSettings(owner=user)
        new_user_settings.save()
        return user


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
