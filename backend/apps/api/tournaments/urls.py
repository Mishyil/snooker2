from django.urls import path
from .views import TournamentDitailAPIView, PlayersOfTournamentView, TournamentsAPIView, DeletePlayersOfTournamentView, TournamentsDashAPIView, PlayersRatingOfTournamentView

urlpatterns = [
    path('<int:tournamentId>/', TournamentDitailAPIView.as_view()),
    path('<int:tournamentId>/players/', PlayersOfTournamentView.as_view()),
    path('<int:tournamentId>/players/rating/', PlayersRatingOfTournamentView.as_view()),
    path('<int:tournamentId>/players/<int:playerId>/', DeletePlayersOfTournamentView.as_view()),
    path('series/<int:series_id>/', TournamentsAPIView.as_view()),
    path('series/<int:series_id>/dash/', TournamentsDashAPIView.as_view()),
]
