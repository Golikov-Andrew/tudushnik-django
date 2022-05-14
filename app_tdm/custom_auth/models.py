from django.db import models
from django.core.validators import FileExtensionValidator

from base.services import get_path_upload_avatar, validate_size_image


class AuthUser(models.Model):
    """
    custom user
    """
    email = models.EmailField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    country = models.CharField(max_length=40, blank=True, null=True)
    city = models.CharField(max_length=40, blank=True, null=True)
    biography = models.TextField(max_length=2000, blank=True, null=True)
    display_name = models.CharField(max_length=40, blank=True, null=True)
    avatar = models.ImageField(
        upload_to=get_path_upload_avatar, blank=True, null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg']),
            validate_size_image
        ]
    )

    @property
    def is_authenticated(self):
        return True

    def __str__(self):
        return self.email
