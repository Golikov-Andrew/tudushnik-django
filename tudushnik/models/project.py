from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse


class Project(models.Model):
    title = models.CharField(max_length=150, db_index=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    color = models.TextField(blank=False, default='#aaaaaa')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('project_detail', kwargs={'pk': self.pk})

    def to_json(self):
        return {
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'owner': self.owner,
            'color': self.color,
        }

    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-updated_at']
