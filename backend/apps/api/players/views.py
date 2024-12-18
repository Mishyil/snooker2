from rest_framework.views import APIView

from apps.api.series.models import TournamentSeries
from .serializers import PlayerProfileSerializer
from .models import PlayerProfile
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.shortcuts import get_object_or_404


class PlayerProfilesView(APIView):
    @swagger_auto_schema(
        operation_description="Получение списка игроков по Id серии",
        responses={200: PlayerProfileSerializer}
    )
    def get(self, request, seriesId):
        series = get_object_or_404(TournamentSeries, id=seriesId)
        players = PlayerProfile.objects.filter(series=seriesId).order_by('-rating')
        serializer = PlayerProfileSerializer(players, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Создать нового игрока",
        request_body=PlayerProfileSerializer,
        responses={201: PlayerProfileSerializer, 400: 'Bad Request'}
    )
    def post(self, request, seriesId):
        series = get_object_or_404(TournamentSeries, id=seriesId)

        data = request.data.copy()
        data['series'] = series.id
        serializer = PlayerProfileSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlayerProfileAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Получение профиля игрока по Id",
        responses={200: PlayerProfileSerializer}
    )
    def get(self, request,playerId):
        player = get_object_or_404(PlayerProfile, id=playerId)
        serializer = PlayerProfileSerializer(player)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Изменить данные профиля игрока",
        request_body=PlayerProfileSerializer,
        responses={201: PlayerProfileSerializer, 400: 'Bad Request'}
    )
    def put(self, request, playerId):
        player = get_object_or_404(PlayerProfile, id=playerId)
        serializer = PlayerProfileSerializer(
            player, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Удалить профиль игрока",
        responses={204: "No content", 400: 'Bad Request'}
    )
    def delete(self, request, playerId):
        player = get_object_or_404(PlayerProfile, id=playerId)
        player.delete()
        return Response({"message": "Player profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



        
