from rest_framework import serializers
from booking.models import BookingRide
from django.db.models import Sum

class BookingSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()
    going_to = serializers.SerializerMethodField()
    going_from = serializers.SerializerMethodField()
    Passenger_name = serializers.SerializerMethodField()
    ride_date = serializers.SerializerMethodField()
    selected_seats = serializers.SerializerMethodField()

    class Meta:
        model = BookingRide
        fields = [
            'id', 'ride', 'passenger', 'status', 'additional_notes',
            'created_at', 'last_modified_date', 'total_price', 'driver_name', 'going_to',
            'going_from', 'Passenger_name', 'ride_date', 'booked_seat', 'selected_seats'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'total_price',]

    def get_driver_name(self, obj):
        return obj.ride.driver.first_name + ' ' + obj.ride.driver.last_name

    def get_ride_date(self, obj):
        return obj.ride.date_time if obj.ride else None

    def get_going_to(self, obj):
        return obj.ride.going_to if obj.ride else None

    def get_going_from(self, obj):
        return obj.ride.going_from if obj.ride else None

    def get_Passenger_name(self, obj):
        return obj.passenger.first_name + ' ' + obj.passenger.last_name

    def validate(self, data):
        """
        Custom validation to ensure seat_1 is always true and no duplicate seat bookings.
        """
        ride = data.get('ride')
        booked_seat = data.get('booked_seat')
        booked_seats = ride.bookings.all()
        total_seats = ride.vehicle.number_of_seats - 1
        if ride is None or total_seats <= booked_seats.count():
            msg = "All seats are booked"
            raise serializers.ValidationError(msg)

        if booked_seat == 1 or booked_seat == "1":
            msg = "Seat 1 is reserved for driver"
            raise serializers.ValidationError(msg)

        if booked_seat and booked_seats.filter(booked_seat=booked_seat).exists():
            msg = "This seat is already booked"
            raise serializers.ValidationError(msg)

        return data


    def get_selected_seats(self, obj):
        """
        Map the seat fields to their respective human-readable labels.
        """
        selected_seats = {
            'seat_1': "Driver",
            'seat_2': None if obj.ride.bookings.all().filter(booked_seat=2).first() is None else "Front Right",
            'seat_3': None if obj.ride.bookings.all().filter(booked_seat=3).first() is None else "Back Left",
            'seat_4': None if obj.ride.bookings.all().filter(booked_seat=4).first() is None else "Back Right",
        }
        return selected_seats

    def create(self, validated_data):
        """
        Override create method to set the status to 'Confirmed' upon creation.
        """
        # Ensure the status is set to 'Confirmed'
        validated_data['status'] = 'Confirmed'

        # Create the booking
        booking_ride = BookingRide.objects.create(**validated_data)

        return booking_ride