# Generated by Django 4.0.3 on 2024-12-22 14:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tudushnik', '0005_budget_check'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskParentChild',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.AddField(
            model_name='task',
            name='children',
            field=models.ManyToManyField(blank=True, through='tudushnik.TaskParentChild', to='tudushnik.task'),
        ),
        migrations.AddField(
            model_name='taskparentchild',
            name='child',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='parent', to='tudushnik.task'),
        ),
        migrations.AddField(
            model_name='taskparentchild',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='child', to='tudushnik.task'),
        ),
        migrations.AddConstraint(
            model_name='taskparentchild',
            constraint=models.UniqueConstraint(fields=('parent', 'child'), name='parent_child'),
        ),
    ]
