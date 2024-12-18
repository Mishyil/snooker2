from apps.api.tournaments.models import Tournament
from .models import Group, Qualifiers
from itertools import combinations

def generate_matches_for_tournament(tournament_id):
    tournament = Tournament.objects.get(id=tournament_id)
    groups = Group.objects.filter(tournament=tournament)
    Qualifiers.objects.filter(tournament=tournament).delete()
    for group in groups:
        players = list(group.players.all())
        for player1, player2 in combinations(players, 2):
            Qualifiers.objects.create(
                tournament=tournament,
                group=group,
                player_1=player1,
                player_2=player2,
                data=None
            )