from rest_framework import serializers
from .models import Tournament


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'description', 'place', 'visible', 'players', 'previous_tournament']
        

class TournamentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        exclude = ['owner', 'series']