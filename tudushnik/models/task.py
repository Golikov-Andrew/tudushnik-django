from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse

from tudushnik.models.project import Project
from tudushnik.models.tag import Tag


class Task(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    begin_at = models.DateTimeField(null=True)
    # begin_at = models.DateTimeField(auto_now_add=True)
    # photo = models.ImageField(upload_to='photos/%Y/%m/%d/',
    # verbose_name='Изображение', blank=True)
    is_done = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE,
                                related_name='tasks')
    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='tasks')
    duration = models.IntegerField(default=300)
    tags = models.ManyToManyField(Tag, related_name='tasks', blank=True)
    width = models.IntegerField(default=400)
    diagram_offset_x = models.IntegerField(default=100)
    children = models.ManyToManyField(
        'self', blank=True,
        symmetrical=False,
        through='TaskParentChild'
    )

    # views = models.IntegerField(default=0)
    # slug = models.SlugField(max_length=255, unique=True,
    # db_index=True, verbose_name='URL')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('task_detail', kwargs={'pk': self.pk})

    def to_json(self):
        children = self.children.all()
        parents = Task.objects.filter(children=self).all()
        return {
            'pk': self.pk,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'begin_at': self.begin_at,
            'is_done': self.is_done,
            'project': str(self.project),
            'owner': str(self.owner),
            'duration': self.duration,
            'width': self.width,
            'diagram_offset_x': self.diagram_offset_x,
            'children': [c.to_json() for c in children],
            'parents': [i.pk for i in parents]
        }

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
        ordering = ['-updated_at', 'title']


class TaskParentChild(models.Model):
    parent = models.ForeignKey(Task, on_delete=models.DO_NOTHING,
                               related_name='child')
    child = models.ForeignKey(Task, on_delete=models.DO_NOTHING,
                              related_name='parent')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['parent', 'child'],
                name='parent_child'
            )
        ]
