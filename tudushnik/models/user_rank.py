from django.db import models


class UserRank(models.Model):
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
        verbose_name = 'UserRank'
        verbose_name_plural = 'UserRanks'
        ordering = ['min_points']
