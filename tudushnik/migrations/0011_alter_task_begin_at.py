# Generated by Django 4.0.3 on 2022-08-28 10:31

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('tudushnik', '0010_alter_task_begin_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='begin_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 28, 10, 31, 34, 343095, tzinfo=utc)),
        ),
    ]
