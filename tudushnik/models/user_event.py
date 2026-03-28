from django.db import models


class UserEvent(models.Model):
    event_type = models.CharField(max_length=150)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    points_delta = models.FloatField(default=0)

    def __str__(self):
        return self.title

    def to_json(self):
        return {
            'pk': self.pk,
            'type': self.event_type,
            'title': self.title,
            'description': self.description,
            'points_delta': self.points_delta,
        }

    class Meta:
        verbose_name = 'UserEvent'
        verbose_name_plural = 'UserEvents'
