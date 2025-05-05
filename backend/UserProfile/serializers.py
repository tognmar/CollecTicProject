from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import UserAccount
from follow.models import Follow


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = get_user_model()
        fields = ('id', 'email', 'name', 'password')


class ProfileSerializer(serializers.ModelSerializer):
    logged_in_user_is_following = serializers.SerializerMethodField()
    logged_in_user_is_followed = serializers.SerializerMethodField()
    ticket_count = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserAccount
        fields = ('id', 'email', 'name', 'avatar', 'location',
                  'logged_in_user_is_following', 'logged_in_user_is_followed',
                  'ticket_count', 'follower_count', 'following_count', 'last_updated', 'created_at')
        read_only_fields = ['email']

    def get_logged_in_user_is_following(self, obj):
        request = self.context.get('request', None)
        if request is None or request.user.is_anonymous:
            return False
        # Is the logged-in user following this profile?
        return Follow.objects.filter(follower=request.user, followed=obj).exists()

    def get_logged_in_user_is_followed(self, obj):
        request = self.context.get('request', None)
        if request is None or request.user.is_anonymous:
            return False
        # Is this profile following the logged-in user?
        return Follow.objects.filter(follower=obj, followed=request.user).exists()

    def get_ticket_count(self, obj):
        # Count of tickets created by this user
        return obj.tickets.count()

    def get_follower_count(self, obj):
        # Count of users who follow this profile
        return obj.followers.count()

    def get_following_count(self, obj):
        # Count of users this profile follows
        return obj.following.count()
