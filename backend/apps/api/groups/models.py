from django.db import models
from apps.api.players.models import PlayerProfile
from apps.api.tournaments.models import Tournament


class Group(models.Model):
    name = models.CharField(max_length=50)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    players = models.ManyToManyField(
        PlayerProfile, related_name='group_memberships', blank=True)

    def __str__(self):
        return self.name


class Qualifiers(models.Model):
    tournament = models.ForeignKey(
        Tournament, on_delete=models.CASCADE, related_name='qualifiers_matches')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    data = models.DateField(blank=True, null=True)
    player_1 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE,
                                 related_name='qualifiers_player_1', blank=True, null=True)
    player_2 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE,
                                 related_name='qualifiers_player_2', blank=True, null=True)
    winner = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE,
                               related_name='qualifiers_winner', blank=True, null=True)
    score_player_1 = models.IntegerField(default=0)
    score_player_2 = models.IntegerField(default=0)
    points_distributed = models.BooleanField(default=False)

    def __str__(self):
        player_1_name = f'{self.player_1.first_name} {self.player_1.last_name}' if self.player_1 else "N/A"
        player_2_name = f'{self.player_2.first_name} {self.player_2.last_name}' if self.player_2 else "N/A"
        return f'{player_1_name} - {player_2_name}'
