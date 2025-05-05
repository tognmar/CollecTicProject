from PIL import Image
from rest_framework import serializers

from UserProfile.serializers import ProfileSerializer
from .models import Ticket


class TicketReadSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'user_profile']


class TicketWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        exclude = ['user_profile']

    def validate_text(self, value):
        if value and len(value) > 250:
            raise serializers.ValidationError("Description cannot exceed 250 characters.")
        return value

    def validate_ticket_image(self, file):
        if file.content_type == 'application/pdf':
            max_size = 5.0 * 1024 * 1024
            if file.size > max_size:
                size_in_mb = max_size / (1024 * 1024)
                raise serializers.ValidationError(f"PDF file must be smaller than {size_in_mb:.1f}MB.")
            return file

        # Add this early MIME-type check
        if file.content_type not in ['image/jpeg', 'image/png']:
            raise serializers.ValidationError("ticket_image must be a JPEG or PNG image.")

        return self._validate_image(file, field_name='ticket_image')

    def validate_event_image(self, file):
        # Only image validation (JPEG/PNG), and allow blank
        if not file:
            return file
        if file.content_type not in ['image/jpeg', 'image/png']:
            raise serializers.ValidationError("Only JPEG and PNG images are allowed.")
        return self._validate_image(file, field_name='event_image')

    def _validate_image(self, file, field_name):
        try:
            img = Image.open(file)
            img.verify()
            img = Image.open(file)
            img.load()

            if img.format not in ('JPEG', 'JPG', 'PNG'):
                raise serializers.ValidationError(f"{field_name} must be a JPEG or PNG image.")

            min_width, min_height = 50, 50
            max_width, max_height = 5000, 5000
            if not (min_width <= img.width <= max_width and min_height <= img.height <= max_height):
                raise serializers.ValidationError(
                    f"{field_name} dimensions must be between {min_width}x{min_height} and {max_width}x{max_height} pixels."
                )

            max_size = 5 * 1024 * 1024
            if file.size > max_size:
                size_in_mb = max_size / (1024 * 1024)
                raise serializers.ValidationError(f"{field_name} must be smaller than {size_in_mb:.1f}MB.")

        except Exception as e:
            raise serializers.ValidationError(f"Invalid {field_name}: {str(e)}")

        return file
