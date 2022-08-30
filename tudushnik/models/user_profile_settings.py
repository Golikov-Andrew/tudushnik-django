from django.contrib.auth.models import User
from django.db import models


class UserProfileSettings(models.Model):
    limit_items_per_page = models.IntegerField(default=5)
    owner = models.OneToOneField(User, on_delete=models.DO_NOTHING, related_name='profile_settings')

    class Meta:
        verbose_name = 'UserProfileSettings'
        verbose_name_plural = 'UserProfileSettings'


def manage_user_settings(user_id, per_page):
    user_settings = UserProfileSettings.objects.filter(owner_id=user_id).first()

    if per_page is None:
        if user_settings is None:
            per_page = 5
            new_user_settings = UserProfileSettings(owner_id=user_id)
            new_user_settings.save()
        else:
            per_page = user_settings.limit_items_per_page
    else:
        if user_settings is None:
            new_user_settings = UserProfileSettings(limit_items_per_page=int(per_page), owner_id=user_id)
            new_user_settings.save()
        else:
            if user_settings.limit_items_per_page != int(per_page):
                user_settings.limit_items_per_page = int(per_page)
                user_settings.save()

    return per_page
