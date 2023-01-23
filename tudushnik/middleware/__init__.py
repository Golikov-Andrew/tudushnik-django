from urllib.parse import unquote


class DetectTimeZoneMiddleware:
    def __init__(self, get_response):
        self._get_response = get_response

    def __call__(self, request, *args, **kwargs):
        tz = request.COOKIES.get('timezone')
        tz = 'UTC' if tz is None else unquote(tz)
        # request.context_data['client_timezone'] = tz
        request.content_params['client_timezone'] = tz
        response = self._get_response(request)
        return response

    def process_view(self, request, view_func, *view_args, **view_kwargs):
        # view_func.view_initkwargs['client_timezone'] = request.content_params['client_timezone']
        return view_func(request, client_timezone=request.content_params['client_timezone'])
