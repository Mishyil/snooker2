from .models import Group, Qualifiers
from rest_framework import serializers
from apps.api.players.models import PlayerProfile
from apps.api.players.serializers import PlayerProfileSerializer



class CreateGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ['id', 'name']
class GroupSerializer(serializers.ModelSerializer):
    player_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True)
    players = PlayerProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'players', 'player_ids']

    def update(self, instance, validated_data):
        # Обработка списка player_ids
        player_ids = validated_data.pop('player_ids', [])
        if player_ids:
            players = PlayerProfile.objects.filter(id__in=player_ids)
            instance.players.add(*players)

        return super().update(instance, validated_data)


class QualifiersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualifiers
        fields = '__all__'


# class GroupPlayerAddSerializer(serializers.ModelSerializer):
