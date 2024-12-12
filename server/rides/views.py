from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Ride
from .serializers import RideSerializer
from .utils import haversine
from datetime import timedelta, datetime

class RidesViewSet(viewsets.ModelViewSet):
    serializer_class = RideSerializer

    def get_queryset(self):
        queryset = Ride.objects.all()
        params = self.request.query_params

        # Query parameters
        available_seats = params.get('available_seats')
        going_to_lat = params.get('going_to_lat')
        going_to_lng = params.get('going_to_lng')
        going_from_lat = params.get('going_from_lat')
        going_from_lng = params.get('going_from_lng')
        date_time = params.get('date_time')
        range_in_km = params.get('range_in_km', 0.0)

        try:
            range_in_km = float(range_in_km)
        except ValueError:
            range_in_km = 0.0
        # Filter by available seats
        if available_seats:
            try:
                available_seats = int(available_seats)
                queryset = queryset.filter(vehicle__number_of_seats__gt=available_seats)
            except ValueError:
                return queryset.none()

        if date_time:
            try:
                start_datetime = datetime.strptime(date_time, "%Y-%m-%d")
                start_datetime = start_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
                end_datetime = start_datetime + timedelta(days=3)
        
                queryset = queryset.filter(date_time__range=[start_datetime, end_datetime])
            except ValueError:
                return queryset.none()
        # Filter rides near the going_from location
        if going_from_lat and going_from_lng and range_in_km > 0:
            lat = float(going_from_lat)
            lng = float(going_from_lng)

            # Calculate nearby rides
            nearby_from_rides = [
                ride.id
                for ride in queryset
                if ride.going_from_lat is not None and ride.going_from_lng is not None
                and haversine(lat, lng, ride.going_from_lat, ride.going_from_lng) <= range_in_km
            ]
            queryset = queryset.filter(id__in=nearby_from_rides)

        # Filter rides near the going_to location
        if going_to_lat and going_to_lng and range_in_km > 0:
            lat = float(going_to_lat)
            lng = float(going_to_lng)

            # Calculate nearby rides
            nearby_to_rides = [
                ride.id
                for ride in queryset
                if ride.going_to_lat is not None and ride.going_to_lng is not None
                and haversine(lat, lng, ride.going_to_lat, ride.going_to_lng) <= range_in_km
            ]
            queryset = queryset.filter(id__in=nearby_to_rides)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        params = self.request.query_params

        if not queryset.exists():
            filters_applied = params.keys()
            available_seats = params.get('available_seats')

            message = "No rides found."
            if "available_seats" in filters_applied:
                message = f"No rides found with the specified number of available seats: {available_seats}."
            elif "going_from_lat" in filters_applied and "going_from_lng" in filters_applied:
                message = f"No rides available near the specified departure location."
            elif "going_to_lat" in filters_applied and "going_to_lng" in filters_applied:
                message = f"No rides available near the specified destination location."
            elif "date_time" in filters_applied:
                message = f"No rides available at the specified date and time."

            return Response(
                {
                    "count": 0,
                    "rides": [],
                    "message": message
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RideSerializer(queryset, many=True)
        return Response({
            "count": queryset.count(),
            "rides": serializer.data
        }, status=status.HTTP_200_OK)
