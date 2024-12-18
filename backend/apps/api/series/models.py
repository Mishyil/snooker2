from django.db import models
from apps.api.profiles.models import UserProfile
from apps.api.players.models import PlayerProfile

class TournamentSeries(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name='tournament_series')
    visible = models.BooleanField(default=False)
    players = models.ManyToManyField(PlayerProfile, related_name='tournament_series', blank=True)

    def __str__(self):
        return self.name