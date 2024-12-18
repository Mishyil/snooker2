from django.db import models
from apps.api.profiles.models import UserProfile


class PlayerProfile(models.Model):
    user = models.OneToOneField(
        UserProfile, on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    rating = models.IntegerField(default=500)
    series = models.ForeignKey(
        'series.TournamentSeries', on_delete=models.CASCADE, blank=True, null=True, related_name='player')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
