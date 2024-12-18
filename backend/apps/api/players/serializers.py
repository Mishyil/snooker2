from rest_framework import serializers

from apps.api.tournaments.models import TournamentPlayerRating
from .models import PlayerProfile
from apps.api.rating.models import Break
from django.db import models


class PlayerProfileSerializer(serializers.ModelSerializer):
    previous_tournament_break_points = serializers.SerializerMethodField()
    total_points = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = ['id', 'first_name', 'last_name', 'rating', 'series',
                  'previous_tournament_break_points', 'total_points']

    def get_previous_tournament_break_points(self, obj):
        tournament = self.context.get('current_tournament')
        if tournament and tournament.previous_tournament:
            previous_tournament = tournament.previous_tournament
            total_points = Break.objects.filter(
                player=obj,
                tournament=previous_tournament
            ).aggregate(models.Sum('points'))['points__sum']
            return total_points or 0
        return 0

    def get_total_points(self, obj):
        previous_points = self.get_previous_tournament_break_points(obj)
        return obj.rating + previous_points


class PlayerIDsSerializer(serializers.Serializer):
    player_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
        help_text="Список ID игроков для добавления к этапу"
    )


class TournamentPlayerRatingSerializer(serializers.ModelSerializer):
    # Включаем информацию об игроке, как в PlayerProfileSerializer
    id = serializers.IntegerField(source='player.id')
    first_name = serializers.CharField(source='player.first_name')
    last_name = serializers.CharField(source='player.last_name')
    series = serializers.IntegerField(source='player.series.id')  # ID серии
    player_rating = serializers.IntegerField(
        source='player.rating')  # Общий рейтинг игрока

    class Meta:
        model = TournamentPlayerRating
        fields = ['id', 'first_name', 'last_name',
                  'player_rating', 'series', 'rating']
