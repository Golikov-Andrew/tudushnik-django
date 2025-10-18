from django.db import models


class TaskStatus(models.Model):
    title = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'TaskStatus'
        verbose_name_plural = 'TaskStatuses'
        ordering = ['pk']

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.title
        }
