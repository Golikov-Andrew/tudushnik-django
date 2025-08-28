from django.http import HttpResponseNotAllowed, JsonResponse

from tudushnik.models.user_profile_settings import UserProfileSettings


def upload_avatar(request, *args, **kwargs):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    image = request.FILES['image']

    user_settings = UserProfileSettings.objects.get(owner=request.user)
    user_settings.avatar = image
    user_settings.save()

    return JsonResponse(
        {
            'success': True,
            'path_to_avatar': user_settings.avatar.url
        }
    )
