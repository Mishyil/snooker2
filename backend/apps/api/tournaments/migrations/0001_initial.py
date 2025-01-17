# Generated by Django 5.1.2 on 2024-10-26 15:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('place', models.CharField(blank=True, max_length=255)),
                ('coefficient', models.IntegerField(default=1)),
                ('visible', models.BooleanField(default=False)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('single_elimination', 'Single Elimination'), ('double_elimination', 'Double Elimination')], default='single_elimination', max_length=20)),
                ('name', models.CharField(blank=True, max_length=200)),
                ('number', models.IntegerField(default=1)),
                ('size', models.IntegerField(default=4)),
                ('settings', models.JSONField(blank=True, default=dict)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stages', to='tournaments.tournament')),
            ],
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('rating', models.IntegerField(default=0)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='tournaments.tournament')),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('round_id', models.IntegerField()),
                ('group_id', models.IntegerField()),
                ('number', models.IntegerField()),
                ('opponent1', models.JSONField(blank=True, null=True)),
                ('opponent2', models.JSONField(blank=True, null=True)),
                ('status', models.IntegerField(default=0)),
                ('child_count', models.IntegerField(default=0)),
                ('winner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='wins', to='tournaments.participant')),
                ('stage_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='tournaments.stage')),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='tournaments.tournament')),
            ],
        ),
    ]
