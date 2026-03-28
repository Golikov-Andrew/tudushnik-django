from django.db import models

from tudushnik.models.user_profile_settings import UserProfileSettings


class UserEventSnapshot(models.Model):
    user_settings = models.ForeignKey(UserProfileSettings,
                                      on_delete=models.CASCADE,
                                      related_name='events')
    event_title = models.CharField(max_length=150)
    event_description = models.TextField(blank=True)
    event_points_delta = models.FloatField(default=0)
    happened_at = models.DateTimeField(auto_now_add=True)
    user_points_after_event = models.FloatField(default=0)

    def __str__(self):
        return f'{self.happened_at} : {self.event_title} : {self.event_points_delta} pts'

    def to_json(self):
        return {
            'pk': self.pk,
            'user_settings_id': self.user_settings,
            'title': self.event_title,
            'description': self.event_description,
            'points_delta': self.event_points_delta,
            'user_points_after_event': self.user_points_after_event,
            'happened_at': self.happened_at,
        }

    class Meta:
        verbose_name = 'UserEventSnapshot'
        verbose_name_plural = 'UserEventSnapshots'
        ordering = ['happened_at']
