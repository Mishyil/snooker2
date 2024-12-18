from django.urls import path
from .views import TournamentBracketView, BraketParticipantView, MatchView, MatchStatusView, DrawParticipantsView, BraketParticipantDelete

urlpatterns = [
    path('<int:tournamentId>/', TournamentBracketView.as_view()),
    path('stages/<int:tournamentId>/participants/', BraketParticipantView.as_view()),
    path('stages/<int:tournamentId>/participants/<int:playerId>/', BraketParticipantDelete.as_view()),
    path('stages/<int:tournamentId>/draw/', DrawParticipantsView.as_view()),
    path('matches/<int:matchId>/change/', MatchView.as_view()),
    path('matches/<int:matchId>/status/<int:stageId>/', MatchStatusView.as_view()),
]
