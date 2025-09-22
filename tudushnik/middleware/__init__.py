from urllib.parse import unquote


def set_client_timezone(request, context):
    cur_tz = request.content_params['client_timezone']
    context['client_timezone'] = cur_tz
    return cur_tz


class DetectTimeZoneMiddleware:
    def __init__(self, get_response):
        self._get_response = get_response

    def __call__(self, request, *args, **kwargs):
        tz = request.COOKIES.get('timezone')
        if tz is None:
            tz = 'UTC'
        else:
            tz = unquote(tz)
        request.content_params['client_timezone'] = tz
        return self._get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path.startswith('/admin/') or request.path.startswith(
                '/media/') or request.path.startswith('/swagger/'):
            return

        view_kwargs.update(
            {'client_timezone': request.content_params['client_timezone']})
        return view_func(request, *view_args, **view_kwargs)
