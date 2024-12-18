from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from apps.api.groups.models import Qualifiers
from rest_framework.response import Response
from rest_framework import status

from apps.api.players.models import PlayerProfile
from .utils import distribute_rating_and_save_history, ratio_rating_change
from apps.api.playoff.models import Match



class DistributeRating(APIView):
    def post(self, request, match_type, match_id):

        if match_type == 'qualifiers':
            match_instance = get_object_or_404(Qualifiers, id=match_id)
            player1 = match_instance.player_1
            player2 = match_instance.player_2
            score_player1 = match_instance.score_player_1
            score_player2 = match_instance.score_player_2
            winner = match_instance.winner
        elif match_type == 'playoff':
            match_instance = get_object_or_404(Match, id=match_id)

            opponent1 = match_instance.opponent1
            opponent2 = match_instance.opponent2

            if not opponent1 or not opponent2:
                return Response({"error": "Match opponents are not set"}, status=status.HTTP_400_BAD_REQUEST)

            player1 = PlayerProfile.objects.get(id=opponent1["id"])
            player2 = PlayerProfile.objects.get(id=opponent2["id"])
            score_player1 = opponent1.get("score", 0)
            score_player2 = opponent2.get("score", 0)
            

            if opponent1.get("result") == "win":
                winner = player1
            elif opponent2.get("result") == "win":
                winner = player2
            else:
                return Response({"error": "Match winner is not determined"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Unsupported match type"}, status=status.HTTP_400_BAD_REQUEST)


        points_distributed = match_instance.points_distributed
        if points_distributed:
            return Response({"error": "Points already distributed"}, status=status.HTTP_400_BAD_REQUEST)

        player1_rating = player1.rating
        player2_rating = player2.rating

        if winner == player1:
            winner_points, loser_points = ratio_rating_change(
                player1_rating, player2_rating, score_player1, score_player2)
        else:
            winner_points, loser_points = ratio_rating_change(
                player2_rating, player1_rating, score_player2, score_player1)


        distribute_rating_and_save_history(
            match_instance, winner, player1, player2, winner_points, loser_points, reason="Match rating distribution"
        )

        # Отмечаем, что очки были распределены
        match_instance.points_distributed = True
        match_instance.save()

        return Response({"message": "Rating distribution completed successfully."})

