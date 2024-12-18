from django.urls import path
from .views import PlayerProfileAPIView, PlayerProfilesView


urlpatterns = [
    path('series/<int:seriesId>/', PlayerProfilesView.as_view(),
         name='player-list'),
    path('<int:playerId>/', PlayerProfileAPIView.as_view(), name='player-detail'),
]
