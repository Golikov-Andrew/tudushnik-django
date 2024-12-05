from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse

from tudushnik.models.budget import Budget
from tudushnik.models.tag import Tag


class Check(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    datetime_at = models.DateTimeField()
    is_done = models.BooleanField(default=False)
    is_profit = models.BooleanField(default=False)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE,
                                related_name='checks')
    creator = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='checks')
    value = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, related_name='checks', blank=True)


    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('check_detail', kwargs={'pk': self.pk})

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'datetime_at': self.datetime_at,
            'is_done': self.is_done,
            'is_profit': self.is_profit,
            'budget': str(self.budget),
            'creator': str(self.creator),
            'value': self.value
        }

    class Meta:
        verbose_name = 'Check'
        verbose_name_plural = 'Checks'
        ordering = ['-updated_at', 'title']
