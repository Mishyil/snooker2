from django.db import models

from apps.api.profiles.models import UserProfile
from apps.api.series.models import TournamentSeries
from apps.api.players.models import PlayerProfile


class Tournament(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    place = models.CharField(max_length=255, blank=True)
    coefficient = models.IntegerField(default=1)
    visible = models.BooleanField(default=False)
    players = models.ManyToManyField(
        PlayerProfile, related_name='tournament', blank=True)
    owner = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name='tournament')
    series = models.ForeignKey(TournamentSeries, on_delete=models.CASCADE,
                               related_name='tournaments')
    size = models.IntegerField(default=16)
    previous_tournament = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='next_tournament'
    )

    def __str__(self):
        return self.name


class TournamentPlayerRating(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0)

    class Meta:
        unique_together = ('player', 'tournament')
