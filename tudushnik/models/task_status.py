from django.db import models
from django.utils.translation import gettext_lazy as _

STATUS_CHOICES = [
    ('New', _('New')),
    ('In Progress', _('In Progress')),
    ('Done', _('Done')),
    ('Paused', _('Paused')),
    ('On Review', _('On Review')),
    ('Rejected', _('Rejected')),
    ('In Revision', _('In Revision')),
    ('Closed', _('Closed')),
    ('Archived', _('Archived')),
    ('Awaiting Resources', _('Awaiting Resources')),
]


class TaskStatus(models.Model):
    title = models.CharField(max_length=50, unique=True, choices=STATUS_CHOICES)
    color = models.CharField(max_length=7, default='#FFFFFF')
    text_color = models.CharField(max_length=7, default='#000000')

    def __str__(self):
        return self.get_title_display()

    class Meta:
        verbose_name = 'TaskStatus'
        verbose_name_plural = 'TaskStatuses'
        ordering = ['pk']

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.get_title_display(),
            'color': self.color,
            'text_color': self.text_color,
        }
