from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Follow
from .serializers import FollowSerializer
from UserProfile.models import UserAccount
from UserProfile.serializers import ProfileSerializer


class ToggleFollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        # Get the user to follow/unfollow
        followed_user = get_object_or_404(UserAccount, id=user_id)

        # Check if trying to follow self
        if request.user.id == followed_user.id:
            return Response(
                {"detail": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if already following
        follow = Follow.objects.filter(
            follower=request.user,
            followed=followed_user
        ).first()

        if follow:
            # User is already following, so unfollow
            follow.delete()
            return Response(
                {"detail": "Successfully unfollowed the user."},
                status=status.HTTP_200_OK
            )
        else:
            # Create new follow relationship
            follow = Follow.objects.create(
                follower=request.user,
                followed=followed_user
            )
            serializer = FollowSerializer(follow)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListFollowersView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(UserAccount, id=user_id)
        # Users who follow the user with user_id
        return UserAccount.objects.filter(following__followed=user)


class ListFollowingView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(UserAccount, id=user_id)
        # Users whom the user with user_id is following
        return UserAccount.objects.filter(followers__follower=user)
