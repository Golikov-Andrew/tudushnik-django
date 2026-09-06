from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse

from tudushnik.models.project import Project


class MindMap(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    project = models.ForeignKey(Project, on_delete=models.DO_NOTHING,
                                related_name='c')
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING,
                              related_name='mindmaps')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('mindmap_detail', kwargs={'pk': self.pk})

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'project': str(self.project),
            'owner': str(self.owner),
        }

    class Meta:
        verbose_name = 'MindMap'
        verbose_name_plural = 'MindMaps'
        ordering = ['-updated_at', 'title']
