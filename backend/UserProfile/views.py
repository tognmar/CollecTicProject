# UserProfile/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import UserAccount
from .serializers import ProfileSerializer

from rest_framework import permissions


class UserListView(generics.ListAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]


class UserDetailView(generics.RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):  # In order to access your own profile
        return self.request.user


class UserScoreboardView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Annotate users with ticket count and order by that count in descending order
        from django.db.models import Count
        return UserAccount.objects.annotate(
            ticket_count_annotation=Count('tickets')
        ).order_by('-ticket_count_annotation')
