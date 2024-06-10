from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import DetailView

from tudushnik.middleware import set_client_timezone
from .forms import AddGameForm
from .models import Game


def games_main_page(request, *args, **kwargs):
    return render(request, 'games/games_main_page.html')


def durak_main_page(request, *args, **kwargs):
    games = Game.objects.all()
    return render(request, "games/durak_main_page.html", {'games': games})


class GameCreateView(View):
    model = Game
    template_name = 'games/durak_create_new_game_page.html'
    form_class = AddGameForm
    initial = {
        "state": '{"players":["human_1","bot_1"],'
                 '"active_player":0,"defender_player":1}',
    }

    def get(self, request, *args, **kwargs):
        self.initial.update({
            "creator": request.user.id,
        })
        form = self.form_class(initial=self.initial)
        # form = self.form_class()
        return render(request, self.template_name, {"form": form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            game = form.save()
            return redirect("durak_game_play", game.pk)

        return render(request, self.template_name, {"form": form})


class GameDetailView(DetailView):
    model = Game
    template_name = 'games/durak_game_play.html'

    # def get_queryset(self):
    #     return Game.objects.all()
    #
    # def get_object(self, *arg, **kwargs):
    #     obj = super().get_object({'pk': self.kwargs['game_id']})
    #     return obj
    #
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)

        # set_client_timezone(self.request, context)
        return context
