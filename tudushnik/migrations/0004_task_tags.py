# Generated by Django 4.0.3 on 2022-08-27 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tudushnik', '0003_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='tags',
            field=models.ManyToManyField(related_name='tasks', to='tudushnik.tag'),
        ),
    ]
