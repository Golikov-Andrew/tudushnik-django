import base64
import os

from django.http import HttpResponse

from tudushnik.custom_conf import BASIC_AUTH_USER, BASIC_AUTH_PSWD


class WWWBasicAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # if request.method == 'GET' and 'HTTP_AUTHORIZATION' in request.META:
        # if request.user.is_authenticated:
        #     return self.get_response(request)
        if request.method == 'GET':
            if request.path.startswith('/favicon.ico'):
                filepath = os.path.join(os.path.dirname(__file__),
                                        f'favicon.ico')
                print(filepath)
                with open(filepath, 'rb') as f:
                    result = f.read()
                    return HttpResponse(result, 'image/png')

            # spec_key = request.GET.get('cdkey')
            # if spec_key == INTERNAL_API_KEY and request.path.startswith(
            #         '/design_utils/email_widget/countdown/create_countdown_gif/'):
            #     return self.get_response(request)
            if 'HTTP_AUTHORIZATION' in request.META:
                auth = request.META['HTTP_AUTHORIZATION'].split()
                if len(auth) == 2:
                    if auth[0].lower() == "basic":
                        uname, passwd = base64.b64decode(auth[1]).split(b':')
                        if uname.decode(
                                'utf-8') == BASIC_AUTH_USER and passwd.decode(
                                'utf-8') == BASIC_AUTH_PSWD:
                            return self.get_response(request)
        if 'HTTP_AUTHORIZATION' in request.META:
            auth = request.META['HTTP_AUTHORIZATION'].split()
            if len(auth) == 2:
                if auth[0].lower() == "basic":
                    uname, passwd = base64.b64decode(auth[1]).split(b':')
                    if uname.decode(
                            'utf-8') == BASIC_AUTH_USER and passwd.decode(
                            'utf-8') == BASIC_AUTH_PSWD:
                        return self.get_response(request)

        # elif request.method == 'POST' and request.path in ('/products/api/get_new_content_export_files/',
        #                                                    '/products/api/update_clued_product_content_export/',
        #                                                    '/products/api/create_clued_product_content_json/',
        #                                                    '/orders/api/update_orders_from_date/',
        #                                                    '/user/api/login/'):
        #     json_obj = json.loads(request.body)
        #     if json_obj['api_key'] == INTERNAL_API_KEY:
        #         return self.get_response(request)

        response = HttpResponse()
        response.status_code = 401
        response[
            'WWW-Authenticate'] = 'Basic realm="%s"' % "Basic Auth Protected"
        return response
