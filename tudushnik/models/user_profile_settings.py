from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.db import models


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            self.delete(name)
        return name


def user_avatar_path(instance, filename):
    return f'user_avatars/{instance.owner_id}/avatar.jpg'


class UserProfileSettings(models.Model):
    limit_items_per_page = models.IntegerField(default=5)
    owner = models.OneToOneField(User, on_delete=models.DO_NOTHING,
                                 related_name='profile_settings')
    avatar = models.ImageField(
        default='user_avatars/default_user_avatar.jpg',
        upload_to=user_avatar_path,
        storage=OverwriteStorage()
    )

    class Meta:
        verbose_name = 'UserProfileSettings'
        verbose_name_plural = 'UserProfileSettings'


def manage_user_settings(user_id, per_page):
    user_settings = UserProfileSettings.objects.filter(
        owner_id=user_id).first()

    if per_page is None:
        if user_settings is None:
            per_page = 5
            new_user_settings = UserProfileSettings(owner_id=user_id)
            new_user_settings.save()
        else:
            per_page = user_settings.limit_items_per_page
    else:
        if user_settings is None:
            new_user_settings = UserProfileSettings(
                limit_items_per_page=int(per_page), owner_id=user_id)
            new_user_settings.save()
        else:
            if user_settings.limit_items_per_page != int(per_page):
                user_settings.limit_items_per_page = int(per_page)
                user_settings.save()

    return per_page
