from django.urls import path, re_path

from .views import games_main_page, durak_main_page, GameCreateView, \
    GameDetailView

urlpatterns = [
    path('', games_main_page, name='games_main_page'),
    path('durak/', durak_main_page, name='durak_main_page'),
    path('durak/create', GameCreateView.as_view(),
         name='create_new_durak_game'),
    path('durak/game/<int:pk>/', GameDetailView.as_view(),
         name='durak_game_play'),
    # path("<str:room_name>/", room, name="room"),
]
