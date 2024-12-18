# Generated by Django 5.1.2 on 2024-10-27 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('players', '0002_initial'),
        ('playoff', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='match',
            name='tournament',
        ),
        migrations.RemoveField(
            model_name='participant',
            name='tournament',
        ),
        migrations.AddField(
            model_name='stage',
            name='players',
            field=models.ManyToManyField(blank=True, related_name='stage', to='players.playerprofile'),
        ),
    ]
