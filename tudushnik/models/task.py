from datetime import timedelta, datetime

from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse
from django.utils import timezone

from tudushnik.models.project import Project
from tudushnik.models.tag import Tag


class Task(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    begin_at = models.DateTimeField(default=timezone.now())
    # begin_at = models.DateTimeField(auto_now_add=True)
    # photo = models.ImageField(upload_to='photos/%Y/%m/%d/', verbose_name='Изображение', blank=True)
    is_done = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    # duration = models.DurationField(default=timedelta(minutes=5))
    duration = models.IntegerField(default=300)
    tags = models.ManyToManyField(Tag, related_name='tasks', blank=True)

    # views = models.IntegerField(default=0)
    # slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('task_detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
        ordering = ['-updated_at', 'title']
