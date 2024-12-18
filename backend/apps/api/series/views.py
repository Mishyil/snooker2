from rest_framework.views import APIView
from .models import TournamentSeries
from rest_framework.response import Response
from .serializers import TournamentSeriesSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated


class UserSeriesAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получить список всех серий турниров",
        responses={200: TournamentSeriesSerializer(many=True)}
    )
    def get(self, request):
        user = request.user
        series = TournamentSeries.objects.filter(owner=user.id)
        serializer = TournamentSeriesSerializer(series, many=True).data
        return Response(serializer)


class SeriesAPIView(APIView):

    @swagger_auto_schema(
        operation_description="Получить список всех серий турниров",
        responses={200: TournamentSeriesSerializer(many=True)}
    )
    def get(self, request):
        series = TournamentSeries.objects.filter(visible=True)
        serializer = TournamentSeriesSerializer(series, many=True).data
        return Response(serializer)

    @swagger_auto_schema(
        operation_description="Создать новую серию турниров",
        request_body=TournamentSeriesSerializer,
        responses={201: TournamentSeriesSerializer, 400: 'Bad Request'}
    )
    def post(self, requst):
        serializer = TournamentSeriesSerializer(data=requst.data)
        if serializer.is_valid():
            serializer.save(owner=requst.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SeriesDitailAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Получить определенную серию по Id",
        responses={200: TournamentSeriesSerializer}
    )
    def get(self, request, pk):
        series = get_object_or_404(TournamentSeries, pk=pk)
        serializer = TournamentSeriesSerializer(series).data
        return Response(serializer)

    @swagger_auto_schema(
        operation_description="Изменить серию",
        request_body=TournamentSeriesSerializer,
        responses={201: TournamentSeriesSerializer, 400: 'Bad Request'}
    )
    def put(self, request, pk):
        series = get_object_or_404(TournamentSeries, pk=pk)
        serializer = TournamentSeriesSerializer(
            series, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Удалить серию",
        request_body=TournamentSeriesSerializer,
        responses={204: TournamentSeriesSerializer, 400: 'Bad Request'}
    )
    def delete(self, request, pk):
        series = get_object_or_404(TournamentSeries, pk=pk)
        series.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
