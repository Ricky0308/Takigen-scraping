# Generated by Django 3.2 on 2022-11-26 03:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('conditions', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conditioncluster',
            name='data_version',
        ),
        migrations.RemoveField(
            model_name='conditioncluster',
            name='in_progress',
        ),
        migrations.RemoveField(
            model_name='conditioncluster',
            name='target_company',
        ),
        migrations.RemoveField(
            model_name='conditioncluster',
            name='target_url',
        ),
    ]