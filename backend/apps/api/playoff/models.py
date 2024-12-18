from django.db import models
from apps.api.players.models import PlayerProfile
from apps.api.tournaments.models import Tournament


class Stage(models.Model):
    TOURNAMENT_TYPES = [
        ('single_elimination', 'Single Elimination'),
        ('double_elimination', 'Double Elimination'),
    ]
    type = models.CharField(
        max_length=20,
        choices=TOURNAMENT_TYPES,
        default='single_elimination'
    )
    tournament = models.ForeignKey(
        Tournament, on_delete=models.CASCADE, related_name='stages')
    name = models.CharField(max_length=200, blank=True)
    number = models.IntegerField(default=1)
    settings = models.JSONField(default=dict, blank=True)
    players = models.ManyToManyField(
        PlayerProfile, related_name='stage', blank=True)

    def __str__(self):
        return f"Stage {self.number} - {self.tournament.name}"


class Participant(models.Model):
    name = models.CharField(max_length=100)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Match(models.Model):
    stage_id = models.ForeignKey(
        Stage, on_delete=models.CASCADE, related_name='matches')
    round_id = models.IntegerField()
    group_id = models.IntegerField()
    number = models.IntegerField()
    opponent1 = models.JSONField(null=True, blank=True)
    opponent2 = models.JSONField(null=True, blank=True)
    winner = models.ForeignKey(
        PlayerProfile, related_name='wins', on_delete=models.SET_NULL, null=True, blank=True)
    loser = models.ForeignKey(
        PlayerProfile, related_name='losses', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.IntegerField(default=2)
    child_count = models.IntegerField(default=0)
    points_distributed = models.BooleanField(default=False)

    def __str__(self):
        return f"Match {self.number} - {self.round_id}"
