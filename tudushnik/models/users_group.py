from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse

from tudushnik.models.project import Project
from tudushnik.models.tag import Tag


class UsersGroup(models.Model):
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING,
                                related_name='own_users_groups')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    projects = models.ManyToManyField(Project,
                                      related_name='users_groups',
                                      blank=True)
    users = models.ManyToManyField(User, related_name='users_groups',
                                   blank=True)

    tags = models.ManyToManyField(Tag, related_name='users_groups', blank=True)

    permission_view_project = models.BooleanField(default=True)
    permission_view_tasks_list = models.BooleanField(default=True)
    permission_view_project_tasks = models.BooleanField(default=True)
    permission_create_task = models.BooleanField(default=False)
    permission_update_task = models.BooleanField(default=False)
    permission_delete_task = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('users_group_detail', kwargs={'pk': self.pk})

    # def to_json(self):
    #     children = self.children.all()
    #     tags = self.tags.all()
    #     parents = Task.objects.filter(children=self).all()
    #     return {
    #         'pk': self.pk,
    #         'title': self.title,
    #         'content': self.content,
    #         'created_at': self.created_at,
    #         'updated_at': self.updated_at,
    #         'begin_at': self.begin_at,
    #         'is_done': self.is_done,
    #         'project': str(self.project),
    #         'project_color': self.project.color,
    #         'owner': str(self.owner),
    #         'duration': self.duration,
    #         'width': self.width,
    #         'diagram_offset_x': self.diagram_offset_x,
    #         'children': [c.to_json() for c in children],
    #         'parents': [i.pk for i in parents],
    #         'tags': [t.to_json() for t in tags]
    #     }

    class Meta:
        verbose_name = 'UsersGroup'
        verbose_name_plural = 'UsersGroups'
        ordering = ['-updated_at', 'title']
