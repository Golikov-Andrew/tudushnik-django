from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse


class Budget(models.Model):
    title = models.CharField(max_length=150, db_index=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    current_value = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('budget_detail', kwargs={'pk': self.pk})

    def to_json(self):
        return {
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'current_value': self.current_value,
            'owner': self.owner,
        }

    class Meta:
        verbose_name = 'Budget'
        verbose_name_plural = 'Budgets'
        ordering = ['-updated_at']
