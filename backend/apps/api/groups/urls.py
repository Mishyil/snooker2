from django.urls import path, include
from .views import GroupAPIView, GroupsAPIView, GroupMatchesCreateView, GroupDeletePlayer, QualifiersAPIView, QualifiersMatchAPIView, GroupsForDashView


urlpatterns = [
    path('<int:tournamentId>/', GroupsAPIView.as_view()),
    path('<int:tournamentId>/dashview/', GroupsForDashView.as_view()),
    path('<int:groupId>/change/', GroupAPIView.as_view()),
    path('matches/<int:groupId>/', QualifiersAPIView.as_view()),
    path('matches/<int:matchId>/change/', QualifiersMatchAPIView.as_view()),
    path('create/<int:tournamentId>/', GroupMatchesCreateView.as_view()),
    path('<int:group_id>/delete_player/<int:user_id>/',
         GroupDeletePlayer.as_view()),
]
