"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="Django REST API",
        default_version="v1",
        description="Motion",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="motion.backend.batch31@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[AllowAny, ]
)

urlpatterns = [
    path('backend/admin/', admin.site.urls),
    path('backend/api/auth/', include('djoser.urls')),
    path('backend/api/auth/', include('djoser.urls.jwt')),
    path('backend/api/', include('tickets.urls')),

    path('backend/api/', include('UserProfile.urls')),
    path('backend/api/follow/', include('follow.urls')),

    path('backend/api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]

# This tells Django to serve files under /backend/media-files/ directly from your local disk.
# Append static files route only AFTER urlpatterns is defined
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
