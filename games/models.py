from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse


class Game(models.Model):
    title = models.CharField(max_length=150)
    type_of_game = models.CharField(max_length=150, default='durak')
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING,
                                related_name='games')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    state = models.JSONField()
    status = models.CharField(max_length=32, default='new')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('game_detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'Game'
        verbose_name_plural = 'Games'
        ordering = ['-updated_at']
