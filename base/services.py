from django.core.exceptions import ValidationError


def get_path_upload_avatar(instance, file):
    """format: (media)/avatar/user_id/photo.jpg
    """
    return f'avatar/{instance.id}/{file}'


def validate_size_image(file_obj):
    megabyte_limit = 2
    if file_obj.size > megabyte_limit * 1024 * 1024:
        raise ValidationError(f"Максимальные размер файла {megabyte_limit}MB")
