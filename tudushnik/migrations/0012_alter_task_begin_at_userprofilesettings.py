# Generated by Django 4.0.3 on 2022-08-28 10:46

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tudushnik', '0011_alter_task_begin_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='begin_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 28, 10, 46, 28, 417458, tzinfo=utc)),
        ),
        migrations.CreateModel(
            name='UserProfileSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('limit_items_per_page', models.IntegerField(default=5)),
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, related_name='profile_settings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'UserProfileSettings',
                'verbose_name_plural': 'UserProfileSettings',
            },
        ),
    ]
