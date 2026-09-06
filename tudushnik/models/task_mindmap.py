from django.db import models
from django.urls import reverse

from tudushnik.models.mindmap import MindMap
from tudushnik.models.task import Task


class TaskMindMap(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE,
                             related_name='mindmaps')
    mindmap = models.ForeignKey(MindMap, on_delete=models.CASCADE,
                                related_name='tasks')
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    width = models.IntegerField(default=200)
    height = models.IntegerField(default=100)

    def __str__(self):
        return f'{self.task.title} - {self.mindmap.title}'

    def get_absolute_url(self):
        return reverse('mindmap_detail', kwargs={'pk': self.pk})

    def to_json(self):
        return {
            'pk': self.pk,
            'task': self.task.to_json(),
            'mindmap': self.mindmap.id,
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
        }

    class Meta:
        verbose_name = 'TaskMindMap'
        verbose_name_plural = 'TasksMindMaps'
