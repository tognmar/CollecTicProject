from django.urls import path

from .views import ToggleFollowView, ListFollowersView, ListFollowingView

urlpatterns = [
    path('toggle-follow/<int:user_id>/', ToggleFollowView.as_view()),
    path('followers/<int:user_id>/', ListFollowersView.as_view()),
    path('following/<int:user_id>/', ListFollowingView.as_view()),
]
