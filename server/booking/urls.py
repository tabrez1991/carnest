from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import BookingRideViewSet

router = DefaultRouter()

# Register the BookingRideViewSet
router.register(r'', BookingRideViewSet, basename='booking-ride')


urlpatterns = router.urls
