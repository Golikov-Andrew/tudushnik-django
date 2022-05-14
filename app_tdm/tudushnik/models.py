from django.db import models
from django.urls import reverse

from app_tdm.custom_auth.models import AuthUser


class Project(models.Model):
    title=models.CharField(max_length=150, db_index=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(AuthUser, on_delete=models.CASCADE)

    # def get_absolute_url(self):
    #     return reverse('project', kwargs={'project_id': self.pk})

    def __str__(self):
        return self.title


    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['title']


class Task(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    begin_at = models.DateTimeField(auto_now_add=True)
    # photo = models.ImageField(upload_to='photos/%Y/%m/%d/', verbose_name='Изображение', blank=True)
    is_done = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    # views = models.IntegerField(default=0)
    # slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')

    def __str__(self):
        return self.title

    # def get_absolute_url(self):
    #     return reverse('view_news', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
        ordering = ['-created_at', 'title']
