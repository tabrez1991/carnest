from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BookingRide
from .serializers import BookingSerializer
from rest_framework.decorators import action

class BookingRideViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing ride bookings.
    """
    queryset = BookingRide.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        """
        Limits the queryset to bookings made by the authenticated user or the driver of the ride.
        """
        user = self.request.user
        return BookingRide.objects.filter(passenger=user) 


    @action(detail=False, methods=['delete'], permission_classes=[IsAuthenticated])
    def delete_all_bookings(self, request):
        """
        Custom action to delete all bookings.
        """
        try:
            # Delete all bookings
            count, _ = BookingRide.objects.all().delete()

            return Response(
                {"message": f"{count} bookings deleted."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel_ride(self, request, pk=None):
        """
        Custom action to cancel a specific booking by changing its status to 'Cancelled'.
        """
        booking = self.get_object()

        # Check if the booking is already cancelled
        if booking.status == 'Cancelled':
            return Response(
                {"detail": "Booking is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'Cancelled'
        booking.save()

        return Response(
            {"detail": "Booking has been cancelled successfully."},
            status=status.HTTP_200_OK
        )   
