from django.urls import path, include


urlpatterns = [
	path('tournaments/', include('apps.api.tournaments.urls'), name='tournaments'),
	path('series/', include('apps.api.series.urls'), name='series'),
	path('groups/', include('apps.api.groups.urls'), name='groups'),
	path('players/', include('apps.api.players.urls'), name='groups'),
	path('playoff/', include('apps.api.playoff.urls'), name='groups'),
	path('auth/', include('apps.api.authorization.urls'), name='groups'),
	path('rating/', include('apps.api.rating.urls'), name='groups'),

]