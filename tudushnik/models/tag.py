from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse


class Tag(models.Model):
    title = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    color = models.TextField(blank=False, default='#aaaaaa')
    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='tags')

    def __str__(self):
        return self.title

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.title,
            'color': self.color
        }

    def get_absolute_url(self):
        return reverse('tag_detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ['-updated_at', 'title']
