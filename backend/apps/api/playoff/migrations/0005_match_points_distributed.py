# Generated by Django 5.1.2 on 2024-11-15 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playoff', '0004_match_loser'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='points_distributed',
            field=models.BooleanField(default=False),
        ),
    ]