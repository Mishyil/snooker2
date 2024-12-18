from apps.api.tournaments.models import TournamentPlayerRating
from .models import RatingChange
# Переделать
def distribute_points(tournament):
    if tournament.points_distributed:
        return
    stage_points = {
        'quarterfinal': tournament.quarterfinal_points,
        'semifinal': tournament.semifinal_points,
        'final': tournament.final_points,
        'winner': tournament.winner_points,
    }

    winner_match = tournament.matches.filter(stage='final').first()
    if winner_match:
        winner = winner_match.winner
        if winner:
            old_rating = winner.rating
            winner.rating += stage_points['winner']
            winner.save()

    for stage, points in stage_points.items():
        if stage != 'winner':
            matches = tournament.matches.filter(stage=stage)
            for match in matches:
                match.player1.rating += points
                match.player1.save()

                old_rating = match.player2.rating
                match.player2.rating += points
                match.player2.save()

    tournament.points_distributed = True
    tournament.save()

# Удалить
def elo_rating_change(winner_rating, loser_rating, score_difference, K=32):
    expected_score_winner = 1 / \
        (1 + 10 ** ((loser_rating - winner_rating) / 400))
    actual_score_winner = 1 if score_difference > 0 else 0.5

    rating_change = K * (actual_score_winner - expected_score_winner)

    return round(rating_change)


def calculate_rating_change(winner_rating, loser_rating, winner_score, loser_score, K=32):
    score_difference = winner_score - loser_score

    rating_change = elo_rating_change(
        winner_rating, loser_rating, score_difference, K)

    winner_points = rating_change
    loser_points = -rating_change

    return winner_points, loser_points

# Пофиксить
def ratio_rating_change(winner_rating, loser_rating, winner_score, loser_score):
    rating_diff = (abs(winner_rating - loser_rating)) // 100 + 1
    ratio = (10, 10 * rating_diff)
    if winner_rating <= loser_rating:
        winner_points = (winner_score * ratio[1]) - (loser_score * ratio[0])
        loser_points = (loser_score * ratio[0]) - (winner_score * ratio[1])
    else:
        winner_points = (winner_score * ratio[0]) - (loser_score * ratio[1])
        loser_points = (loser_score * ratio[1]) - (winner_score * ratio[0])
    return winner_points, loser_points


def distribute_rating_and_save_history(match_instance, winner, player1, player2, winner_points, loser_points, reason=""):
    player1_old_rating = player1.rating
    player2_old_rating = player2.rating

    # Обновляем рейтинги
    player1_new_rating = player1_old_rating + \
        winner_points if winner == player1 else player1_old_rating + loser_points
    player2_new_rating = player2_old_rating + \
        winner_points if winner == player2 else player2_old_rating + loser_points

    player1.rating = player1_new_rating
    player2.rating = player2_new_rating
    player1.save()
    player2.save()

    tournament = match_instance.stage_id.tournament
    player1_tournament_rating, _ = TournamentPlayerRating.objects.get_or_create(
        player=player1, tournament=tournament)
    player2_tournament_rating, _ = TournamentPlayerRating.objects.get_or_create(
        player=player2, tournament=tournament)

    player1_tournament_old_rating = player1_tournament_rating.rating
    player2_tournament_old_rating = player2_tournament_rating.rating

    player1_tournament_rating.rating += winner_points if winner == player1 else loser_points
    player2_tournament_rating.rating += winner_points if winner == player2 else loser_points

    player1_tournament_rating.save()
    player2_tournament_rating.save()

    # Сохраняем изменения в историю
    RatingChange.objects.create(
        player=player1, old_rating=player1_old_rating, new_rating=player1_new_rating, reason=reason)
    RatingChange.objects.create(
        player=player2, old_rating=player2_old_rating, new_rating=player2_new_rating, reason=reason)

    match_instance.points_distributed = True
    match_instance.save()

    return player1_new_rating, player2_new_rating
