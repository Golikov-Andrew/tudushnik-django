# middleware.py
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path_info = request.META.get('PATH_INFO')
        is_new_access_token = False
        if path_info is not None and '/swagger' in path_info:
            access_token = request.META.get('HTTP_AUTHORIZATION')
            if access_token is None:
                # при обычном заходе на сваггер
                access_token = request.COOKIES.get('access_token')
                refresh_token = request.COOKIES.get('refresh_token')
                if access_token and refresh_token:
                    try:
                        try:
                            access_token = AccessToken(access_token)
                            access_token.check_exp()
                            access_token = str(access_token.token)
                        except TokenError:
                            refresh = RefreshToken(refresh_token)
                            access_token = str(refresh.access_token)
                            is_new_access_token = True
                        finally:
                            request.META[
                                'HTTP_AUTHORIZATION'] = f'Bearer {access_token}'

                    except TokenError:
                        response = self.get_response(request)
                        response.status = status.HTTP_401_UNAUTHORIZED
                        return response

        response = self.get_response(request)
        if is_new_access_token:
            response.set_cookie('access_token', str(access_token),
                                secure=True, samesite='None')
        if '/logout' in path_info:
            response.delete_cookie('refresh_token', samesite='None')
            response.delete_cookie('access_token', samesite='None')
        return response
