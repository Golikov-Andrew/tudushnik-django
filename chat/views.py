from django.shortcuts import render


def chat_page(request, *args, **kwargs):
    return render(request, 'chat/chat_page.html')


def room(request, room_name, *args, **kwargs):
    return render(request, "chat/room.html", {"room_name": room_name})
