from django.urls import path, include
from .views import DistributeRating

urlpatterns  = [
	path('<str:match_type>/<int:match_id>/', DistributeRating.as_view(), name='distribute_points'),
]