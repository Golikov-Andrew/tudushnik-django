# Generated by Django 4.0.3 on 2025-07-20 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tudushnik', '0008_snippet'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='projects', to='tudushnik.tag'),
        ),
    ]
