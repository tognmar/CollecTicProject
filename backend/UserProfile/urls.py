# UserProfile/urls.py
from django.urls import path
from .views import UserListView, UserDetailView, ProfileView, \
    UserScoreboardView  # Import from the same directory, not from 'users'

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('users/scoreboard/', UserScoreboardView.as_view(), name='user-scoreboard'),
]
