from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['id', 'created_date', 'owner_name']

    def get_owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}" if obj.owner else None
    
    def validate_number_of_seats(self, value):
        """
        Ensure the number of seats does not exceed 4.
        """
        if value > 4:
            raise ValidationError("The number of seats cannot exceed 4.")
        return value

    def create(self, validated_data):
            user = self.context['request'].user
            validated_data['owner'] = user
            return super().create(validated_data)
