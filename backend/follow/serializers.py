# from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Follow
from UserProfile.serializers import ProfileSerializer


class FollowSerializer(serializers.ModelSerializer):
    follower = ProfileSerializer(read_only=True)
    followed = ProfileSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = '__all__'
        read_only_fields = ['follower', 'followed', 'created_at']
