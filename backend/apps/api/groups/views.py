from drf_yasg.utils import swagger_auto_schema
from apps.api.players.models import PlayerProfile
from .serializers import GroupSerializer, QualifiersSerializer, CreateGroupSerializer
from .models import Group, Qualifiers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.api.tournaments.models import Tournament
from rest_framework.views import APIView
from rest_framework import status
from .services import generate_matches_for_tournament
from drf_yasg import openapi

class GroupsForDashView(APIView):
    def get(self, request, tournamentId):
        groups = Group.objects.filter(tournament=tournamentId)
        serializer = GroupSerializer(groups, many=True).data
        return Response(serializer)

class GroupsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Группы турнира",
    )
    def get(self, request, tournamentId):
        groups = Group.objects.filter(tournament_id=tournamentId)
        data = []

        for group in groups:
            matches = Qualifiers.objects.filter(group=group)
            matches_data = [
                {
                    "id": match.id,
                    "player_1": {
                        "id": match.player_1.id,
                        "first_name": match.player_1.first_name,
                        "last_name": match.player_1.last_name,
                    },
                    "player_2": {
                        "id": match.player_2.id,
                        "first_name": match.player_2.first_name,
                        "last_name": match.player_2.last_name,
                    },
                    "score_player_1": match.score_player_1,
                    "score_player_2": match.score_player_2,
                    "points_distributed": match.points_distributed,
                    "winner": match.winner.id if match.winner else None,
                }
                for match in matches
            ]
            data.append({
                "group_name": group.name,
                "matches": matches_data,
            })

        return Response(data)

    @swagger_auto_schema(
        operation_description="Создать новую группу турнира",
        request_body=CreateGroupSerializer,
        responses={201: GroupSerializer, 400: 'Bad Request'}
    )
    def post(self, requst, tournamentId):
        tournament = get_object_or_404(Tournament, pk=tournamentId)
        serializer = CreateGroupSerializer(data=requst.data)
        if serializer.is_valid():
            serializer.save(tournament=tournament)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Изменить группу и добавить новых игроков",
        request_body=GroupSerializer,
        responses={200: GroupSerializer, 400: 'Bad Request'}
    )
    def put(self, request, groupId):
        group = get_object_or_404(Group, pk=groupId)

        player_ids = request.data.get('player_ids', [])

        for player_id in player_ids:
            if player_id not in group.players.values_list('id', flat=True):
                group.players.add(player_id)


        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Удалить группу",
        responses={204: "No content", 400: 'Bad Request'}
    )
    def delete(self, request, groupId):
        group = get_object_or_404(Group, pk=groupId)
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupMatchesCreateView(APIView):

    @swagger_auto_schema(
        operation_description="Генерация групповых матчей турнира",
        responses={200: QualifiersSerializer}
    )
    def post(self, request, tournamentId):
        if not tournamentId:
            return Response({"error": "Tournament ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tournament = Tournament.objects.get(id=tournamentId)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

        generate_matches_for_tournament(tournamentId)

        matches = Qualifiers.objects.filter(tournament=tournament)
        serializer = QualifiersSerializer(matches, many=True)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupDeletePlayer(APIView):
    def delete(self, request, group_id, user_id):
        try:
            group = Group.objects.get(id=group_id)
            user = PlayerProfile.objects.get(id=user_id)

            group.players.remove(user)

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Group.DoesNotExist:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
        except PlayerProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class QualifiersAPIView(APIView):

    @swagger_auto_schema(
        operation_description="Получение матчей квалификации по id группы",
        responses={200: QualifiersSerializer(
            many=True), 404: 'Group Not Found'}
    )
    def get(self, request, groupId):
        group = get_object_or_404(Group, id=groupId)

        qualifiers = Qualifiers.objects.filter(group=group)
        serializer = QualifiersSerializer(qualifiers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QualifiersMatchAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Изменение данных матча квалификации",
        request_body=QualifiersSerializer,
        responses={200: QualifiersSerializer,
                   400: 'Bad Request', 404: 'Match Not Found'}
    )
    def put(self, request, matchId):
        print(matchId)
        match = get_object_or_404(Qualifiers, id=matchId)

        serializer = QualifiersSerializer(
            match, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Удаление матча квалификации",
        responses={204: 'No Content', 404: 'Match Not Found'}
    )
    def delete(self, request, matchId):
        match = get_object_or_404(Qualifiers, id=matchId)
        match.delete()
        return Response({"message": "Match deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
