from .models import TournamentSeries
from rest_framework import serializers


class TournamentSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentSeries
        exclude = ['owner', 'players']
