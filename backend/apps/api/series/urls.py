from django.urls import path, include
from .views import SeriesDitailAPIView, SeriesAPIView, UserSeriesAPIView

urlpatterns = [
    path('<int:pk>/', SeriesDitailAPIView.as_view(), name='series'),
    path('', SeriesAPIView.as_view(), name='series'),
    path('dash/', UserSeriesAPIView.as_view(), name='series')
]