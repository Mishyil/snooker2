from math import ceil, log2
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from apps.api.players.models import PlayerProfile
from apps.api.players.serializers import PlayerIDsSerializer, PlayerProfileSerializer
from apps.api.tournaments.serializers import TournamentSerializer
from apps.api.rating.models import Break
from .services import create_elimination_bracket
from .models import Tournament, Match, Stage
from .serializers import MatchStatusUpdateSerializer, MatchUpdateSerializer, TournamentGridSerializer, MatchSerializer, ParticipantSerializer, StageSerializer
from rest_framework import status
from .services import calculate_round, create_groups
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F
from django.db import models


class TournamentBracketView(APIView):
    def get(self, request, tournamentId):
        try:
            stages = Stage.objects.filter(tournament=tournamentId)
            if not stages.exists():
                return Response({}, status=status.HTTP_200_OK)

            participants = PlayerProfile.objects.filter(
                stage__in=stages)
            participants_serialized = ParticipantSerializer(
                participants, many=True).data
            if not participants_serialized:
                participants_serialized = [{}]

            stages_serialized = StageSerializer(stages, many=True).data

            matches = Match.objects.filter(stage_id__in=stages)
            matches_serialized = MatchSerializer(matches, many=True).data

            tournament_type = stages.first().type
            tournament_size = stages.first().settings.get('size')

            groups = create_groups(tournament_type)
            rounds = calculate_round(tournament_size, tournament_type)
            response_data = {
                "participant": participants_serialized,
                "stage": stages_serialized,
                "group": groups,
                "round": rounds,
                "match": matches_serialized,
                "match_game": []
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=TournamentGridSerializer,
        responses={200: openapi.Response(
            description="Generated tournament grid")},
    )
    def post(self, request, tournamentId):
        serializer = TournamentGridSerializer(data=request.data)
        if serializer.is_valid():
            tournament_type = serializer.validated_data["tournament_type"]
            size = serializer.validated_data["size"]
            tournament = Tournament.objects.get(id=tournamentId)
            data = create_elimination_bracket(
                size, tournament_type, tournament)

            response_data = {
                "participant": data['participant'],
                "stage": data['stage'],
                "group": data['groups'],
                "round": data['round'],
                "match": data['matches'],
                "match_game": [],
            }

            return Response(response_data, status=200)
        return Response(serializer.errors, status=400)

    @swagger_auto_schema(
        operation_description="Удаление матча квалификации",
        responses={204: 'No Content', 404: 'Match Not Found'}
    )
    def delete(self, response, tournamentId):
        stage = get_object_or_404(Stage, tournament=tournamentId)
        stage.delete()
        return Response({"message": "Stage deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class BraketParticipantView(APIView):

    @swagger_auto_schema(
        operation_description="Участники сетки",
        responses={200: PlayerProfileSerializer}
    )
    def get(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, id=tournamentId)
        stage = get_object_or_404(Stage, tournament=tournament)
        participants = stage.players.all()

        # Передаем текущий турнир в контекст сериализатора
        participant_serialized = PlayerProfileSerializer(
            participants, many=True, context={'current_tournament': tournament}
        ).data

        return Response(participant_serialized)

    @swagger_auto_schema(
        operation_description="Добавить игроков к сетке",
        request_body=PlayerIDsSerializer,
        responses={200: PlayerIDsSerializer, 400: 'Bad Request'}
    )
    def put(self, request, tournamentId):
        stage = get_object_or_404(Stage, tournament=tournamentId)

        player_ids = request.data.get("player_ids", [])

        if not player_ids:
            return Response(
                {"error": "No player IDs provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        players = PlayerProfile.objects.filter(id__in=player_ids)

        if players.count() != len(player_ids):
            return Response(
                {"error": "One or more players not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        stage.players.add(*players)

        players_serialized = PlayerProfileSerializer(
            stage.players.all(), many=True).data

        return Response({
            "stage_id": stage.id,
            "added_players": players_serialized,
        }, status=status.HTTP_200_OK)


class BraketParticipantDelete(APIView):
    @swagger_auto_schema(
        operation_description="Удалить игроков",
        responses={204: 'Players removed successfully',
                   400: 'Bad Request', 404: 'Not Found'}
    )
    def delete(self, request, tournamentId, playerId):
        stage = get_object_or_404(Stage, tournament=tournamentId)

        player = get_object_or_404(PlayerProfile, id=playerId)

        if not stage.players.filter(id=player.id).exists():
            return Response(
                {"error": "Player not found in this stage"},
                status=status.HTTP_404_NOT_FOUND
            )

        stage.players.remove(player)

        return Response(status=status.HTTP_204_NO_CONTENT)


class MatchView(APIView):
    @swagger_auto_schema(
        operation_description="Обновить данные матча с брейками",
        request_body=MatchUpdateSerializer,
        responses={200: MatchUpdateSerializer,
                   400: 'Bad Request', 404: 'Match Not Found'}
    )
    def put(self, request, matchId):
        match = get_object_or_404(Match, id=matchId)

        serializer = MatchUpdateSerializer(match, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(MatchUpdateSerializer(match).data, status=status.HTTP_200_OK)


class MatchStatusView(APIView):
    @swagger_auto_schema(
        operation_description="Обновить статус матча с последующем распределением мест для победителя и проигравшего",
        request_body=MatchStatusUpdateSerializer,
        responses={200: MatchStatusUpdateSerializer,
                   400: 'Bad Request', 404: 'Match Not Found'}
    )
    def put(self, request, matchId, stageId):
        match = get_object_or_404(Match, id=matchId)

        serializer = MatchStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        match.status = serializer.validated_data['status']

        if match.opponent1 and match.opponent2:
            score1 = match.opponent1.get('score', 0)
            score2 = match.opponent2.get('score', 0)

            if score1 > score2:
                match.winner = PlayerProfile.objects.get(
                    id=match.opponent1.get('id'))
                match.loser = PlayerProfile.objects.get(
                    id=match.opponent2.get('id'))
                match.opponent1['result'] = 'win'
                match.opponent2['result'] = 'loss'
            elif score1 < score2:
                match.winner = PlayerProfile.objects.get(
                    id=match.opponent2.get('id'))
                match.loser = PlayerProfile.objects.get(
                    id=match.opponent1.get('id'))
                match.opponent1['result'] = 'loss'
                match.opponent2['result'] = 'win'
            else:
                match.winner = None
                match.opponent1['result'] = 'draw'
        match.save()

        # Определение позиций по итогам матча

        if match.winner is not None:

            stage_size = match.stage_id.settings.get('size')
            stage_type = match.stage_id.type
            rounds = len(calculate_round(stage_size, stage_type))
            quantity = ceil(log2(stage_size))

            # Для победителя в верхней сетке
            if match.round_id < (quantity - 1) and match.group_id == 0:
                next_round = match.round_id + 1
                next_number = (match.number + 1) // 2
                new_match_for_winner = Match.objects.get(
                    round_id=next_round, number=next_number, stage_id=stageId)
                winner_data = {
                    "id": match.winner.id,
                    "name": f"{match.winner.first_name} {match.winner.last_name}"
                }
                if match.number % 2 != 0:
                    new_match_for_winner.opponent1 = winner_data
                else:
                    new_match_for_winner.opponent2 = winner_data
                new_match_for_winner.save()

            # Для проигравшего в верхней сетке
            if stage_type == 'double_elimination' and match.group_id == 0:
                if match.round_id == 0:
                    next_round = match.round_id + quantity
                    next_number = (match.number + 1) // 2
                    new_match_for_loser = Match.objects.get(
                        round_id=next_round, number=next_number, stage_id=stageId)
                    loser_data = {
                        "id": match.loser.id,
                        "name": f"{match.loser.first_name} {match.loser.last_name}"
                    }
                    if match.number % 2 != 0:
                        new_match_for_loser.opponent1['id'] = loser_data
                    else:
                        new_match_for_loser.opponent2['id'] = loser_data
                elif match.round_id == 1:
                    next_round = match.round_id + quantity
                    next_number = match.number
                    new_match_for_loser = Match.objects.get(
                        round_id=next_round, number=next_number, stage_id=stageId)
                    new_match_for_loser.opponent1 = {
                        "id": match.loser.id,
                        "name": f"{match.loser.first_name} {match.loser.last_name}"
                    }
                else:
                    next_round = (quantity - 1) + 2 * (match.round_id)
                    next_number = match.number
                    new_match_for_loser = Match.objects.get(
                        round_id=next_round, number=next_number, stage_id=stageId)
                    new_match_for_loser.opponent1['id'] = match.loser.id
                new_match_for_loser.save()

            # Для победителя в нижней сетке
            elif match.round_id < rounds and match.group_id == 1:
                next_round = match.round_id + 1
                winner_data = {
                    "id": match.winner.id,
                    "name": f"{match.winner.first_name} {match.winner.last_name}"
                }
                if (match.round_id - (quantity - 1)) % 2 != 0:
                    next_number = match.number
                    new_match_for_loser = Match.objects.get(
                        round_id=next_round, number=next_number, stage_id=stageId)
                    new_match_for_loser.opponent2['id'] = winner_data
                else:
                    next_number = (match.number + 1) // 2
                    new_match_for_loser = Match.objects.get(
                        round_id=next_round, number=next_number, stage_id=stageId)
                    if match.number % 2 != 0:
                        new_match_for_loser.opponent1['id'] = winner_data
                    else:
                        new_match_for_loser.opponent2['id'] = winner_data
                new_match_for_loser.save()

            return Response({"size": stage_size, 'type': stage_type, 'number': match.number, 'round_id': match.round_id, 'rounds': rounds, 'quantity': quantity})

        return Response(MatchUpdateSerializer(match).data, status=status.HTTP_200_OK)


class DrawParticipantsView(APIView):
    def post(self, request, tournamentId):
        stage = get_object_or_404(Stage, tournament=tournamentId)
        # Получаем отсортированный список игроков
        # players = list(stage.players.order_by('-rating'))
        tournament = stage.tournament
        players = (
            stage.players.annotate(
                previous_tournament_break_points=Sum(
                    'breaks__points',
                    filter=models.Q(
                        breaks__tournament=tournament.previous_tournament)
                ),
                total_points=F('rating') +
                models.functions.Coalesce(Sum(
                    'breaks__points',
                    filter=models.Q(
                        breaks__tournament=tournament.previous_tournament)
                ), 0)
            )
            .order_by('-total_points')  # Сортировка по total_points
        )
        # Находим все матчи первого раунда (round_id = 0, group_id = 0)
        matches = list(Match.objects.filter(
            stage_id=stage, round_id=0, group_id=0).order_by('number'))

        # Проверяем, что количество матчей достаточно для размещения всех игроков
        if len(matches) * 2 < len(players):
            return Response({"error": "Недостаточно матчей для размещения всех игроков"}, status=400)

        # Проверяем, если игроков нечётное количество
        if len(players) % 2 != 0:
            # Назначаем игрока с самым высоким рейтингом одному в первом матче
            player1 = players.pop(0)  # Убираем игрока из списка
            matches[0].opponent1 = {"id": player1.id, "name": f"{player1.first_name} {player1.last_name}"}
            matches[0].save()
            match_index = 1  # Начинаем с второго матча для остальных игроков
        else:
            match_index = 0  # Начинаем с первого матча, если количество игроков чётное

        # Формируем пары для оставшихся игроков
        for i in range(len(players) // 2):
            if match_index >= len(matches):
                break  # На случай, если матчей недостаточно

            player1 = players[i]           # Игрок с высоким рейтингом
            player2 = players[len(players) - i - 1]    # Игрок с низким рейтингом

            # Назначаем игроков на матч
            matches[match_index].opponent1 = {"id": player1.id, "name": f"{player1.first_name} {player1.last_name}"}
            matches[match_index].opponent2 = {"id": player2.id, "name": f"{player2.first_name} {player2.last_name}"}
            matches[match_index].save()

            match_index += 1

        return Response({"message": "Жеребьевка завершена успешно"})
