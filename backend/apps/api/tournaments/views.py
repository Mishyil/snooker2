from django.shortcuts import render
from rest_framework.views import APIView
from apps.api.series.models import TournamentSeries
from apps.api.players.serializers import PlayerIDsSerializer, PlayerProfileSerializer, TournamentPlayerRatingSerializer
from apps.api.players.models import PlayerProfile
from .serializers import TournamentSerializer, TournamentUpdateSerializer
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from .models import Tournament, TournamentPlayerRating
from django.shortcuts import get_object_or_404
from rest_framework import status


class TournamentsDashAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Турниры по определенной серии",
        responses={200: TournamentSerializer}
    )
    def get(self, request, series_id):
        tournaments = Tournament.objects.filter(series=series_id)
        serializer = TournamentSerializer(tournaments, many=True).data
        return Response(serializer)


class TournamentsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Турниры по определенной серии",
        responses={200: TournamentSerializer}
    )
    def get(self, request, series_id):
        tournaments = Tournament.objects.filter(series=series_id, visible=True)
        serializer = TournamentSerializer(tournaments, many=True).data
        return Response(serializer)

    @swagger_auto_schema(
        operation_description="Создать новый турнир",
        request_body=TournamentSerializer,
        responses={201: TournamentSerializer, 400: 'Bad Request'}
    )
    def post(self, requst, series_id):
        series = get_object_or_404(TournamentSeries, pk=series_id)
        serializer = TournamentSerializer(data=requst.data)
        if serializer.is_valid():
            serializer.save(owner=requst.user, series=series)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TournamentDitailAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Турнир по Id",
        responses={200: TournamentSerializer}
    )
    def get(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, pk=tournamentId)
        serializer = TournamentSerializer(tournament).data
        return Response(serializer)

    @swagger_auto_schema(
        operation_description="Изменить турнир",
        request_body=TournamentUpdateSerializer,
        responses={201: TournamentUpdateSerializer, 400: 'Bad Request'}
    )
    def put(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, pk=tournamentId)
        serializer = TournamentUpdateSerializer(
            tournament, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Удалить турнир",
        request_body=TournamentSerializer,
        responses={204: TournamentSerializer, 400: 'Bad Request'}
    )
    def delete(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, pk=tournamentId)
        tournament.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlayersRatingOfTournamentView(APIView):
    @swagger_auto_schema(
        operation_description="Получение списка игроков с их рейтингом в рамках турнира по Id турнира",
        responses={200: TournamentPlayerRatingSerializer(many=True)}
    )
    def get(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, id=tournamentId)


        player_ratings = TournamentPlayerRating.objects.filter(
            tournament=tournament
        ).select_related('player')

        serializer = TournamentPlayerRatingSerializer(
            player_ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlayersOfTournamentView(APIView):
    @swagger_auto_schema(
        operation_description="Получение списка игроков по Id турнира",
        responses={200: PlayerProfileSerializer}
    )
    def get(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, id=tournamentId)
        players = tournament.players.all()
        serializer = PlayerProfileSerializer(players, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Добавить игроков к турниру",
        request_body=PlayerIDsSerializer,
        responses={200: PlayerIDsSerializer, 400: 'Bad Request'}
    )
    def put(self, request, tournamentId):
        tournament = get_object_or_404(Tournament, id=tournamentId)

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

        tournament.players.add(*players)
        for player in players:
            TournamentPlayerRating.objects.get_or_create(
                player=player,
                tournament=tournament,
                defaults={'rating': 0}
            )

        players_serialized = PlayerProfileSerializer(
            tournament.players.all(), many=True).data

        return Response({
            "stage_id": tournament.id,
            "added_players": players_serialized,
        }, status=status.HTTP_200_OK)


class DeletePlayersOfTournamentView(APIView):
    def delete(self, request, tournamentId, playerId):

        tournament = get_object_or_404(Tournament, pk=tournamentId)

        player = get_object_or_404(PlayerProfile, pk=playerId)

        if player in tournament.players.all():

            tournament.players.remove(player)
            return Response(status=status.HTTP_204_NO_CONTENT)


        return Response({"detail": "Игрок не является участником данного турнира."},
                        status=status.HTTP_400_BAD_REQUEST)
