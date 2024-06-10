from django.urls import path

from .views import chat_page, room

urlpatterns = [
    path('', chat_page, name='chat_page'),
    path("<str:room_name>/", room, name="room"),
]
