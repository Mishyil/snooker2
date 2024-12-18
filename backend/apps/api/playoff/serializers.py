from rest_framework import serializers

from apps.api.players.models import PlayerProfile
from apps.api.rating.models import Break
from .models import Match, Participant, Stage, Tournament


class TournamentGridSerializer(serializers.Serializer):
    tournament_type = serializers.ChoiceField(choices=[(
        "single_elimination", "Single Elimination"), ("double_elimination", "Double Elimination")])
    size = serializers.ChoiceField(choices=[4, 8, 16, 32, 64, 128])


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    tournament_id = serializers.IntegerField(
        source='series.tournament.id', read_only=True)

    class Meta:
        model = PlayerProfile
        fields = ['id', 'name', 'tournament_id']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class OpponentSerializer(serializers.Serializer):
    id = serializers.IntegerField(allow_null=True, required=False)
    score = serializers.IntegerField(allow_null=True, required=False)
    name = serializers.CharField(allow_null=True, required=False)


class BreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Break
        fields = ['id', 'player', 'match', 'qualifier',
                  'points', 'created_at']
        read_only_fields = ['id', 'created_at', 'tournament']


class MatchUpdateSerializer(serializers.ModelSerializer):
    opponent1 = OpponentSerializer()
    opponent2 = OpponentSerializer()
    breaks = BreakSerializer(many=True, required=False)

    class Meta:
        model = Match
        fields = ['opponent1', 'opponent2', 'breaks']

    def update(self, instance, validated_data):
        opponent1_data = validated_data.pop('opponent1', None)
        opponent2_data = validated_data.pop('opponent2', None)

        instance.status = 1
        if opponent1_data:
            instance.opponent1 = opponent1_data
        if opponent2_data:
            instance.opponent2 = opponent2_data

        opponent1_points = 0
        opponent2_points = 0
        tournament = instance.stage_id.tournament
        breaks_data = validated_data.pop('breaks', [])
        for break_data in breaks_data:
            player_id = break_data.get('player')
            if isinstance(player_id, PlayerProfile):
                player_id = player_id.id

            break_instance, _ = Break.objects.update_or_create(
                match=instance,
                player_id=player_id,
                defaults={
                    'points': break_data['points'],
                    'tournament': tournament  # Добавляем турнир
                }
            )

            if player_id == instance.opponent1['id']:
                opponent1_points += break_instance.points
            elif player_id == instance.opponent2['id']:
                opponent2_points += break_instance.points

        instance.opponent1['break_points'] = opponent1_points
        instance.opponent2['break_points'] = opponent2_points

        instance.save()
        return instance


class MatchStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'status']
