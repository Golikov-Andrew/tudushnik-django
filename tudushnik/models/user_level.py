from django.db import models


class UserLevel(models.Model):
    title = models.CharField(max_length=150)
    min_points = models.IntegerField(null=False)
    max_points = models.IntegerField(null=False)

    def __str__(self):
        return self.title

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.title,
            'min_points': self.min_points,
            'max_points': self.max_points,
        }

    class Meta:
        verbose_name = 'UserLevel'
        verbose_name_plural = 'UserLevels'
        ordering = ['min_points']
