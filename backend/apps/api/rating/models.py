from django.db import models
from apps.api.players.models import PlayerProfile
from apps.api.series.models import TournamentSeries
from apps.api.tournaments.models import Tournament
from apps.api.groups.models import Qualifiers
from apps.api.playoff.models import Match

class RatingChange(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='rating_changes')
    old_rating = models.IntegerField()
    new_rating = models.IntegerField()
    changed_at = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'Rating changed for {self.player} from {self.old_rating} to {self.new_rating} on {self.changed_at}'
    


class Break(models.Model):
    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE, related_name='breaks')
    match = models.ForeignKey(
        Match, on_delete=models.CASCADE, null=True, blank=True, related_name='breaks')
    qualifier = models.ForeignKey(
        Qualifiers, on_delete=models.CASCADE, null=True, blank=True, related_name='breaks')
    points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    tournament = models.ForeignKey(
        Tournament, on_delete=models.CASCADE, related_name='breaks')

    def __str__(self):
        match_type = "Match" if self.match else "Qualifier"
        match_id = self.match.id if self.match else self.qualifier.id
        return f"{self.player.first_name} {self.player.last_name}: {self.points} points in {match_type} {match_id}"

