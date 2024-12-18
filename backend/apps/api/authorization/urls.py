from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),  # Для получения токена
    path('token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),  # Для обновления токена
]
