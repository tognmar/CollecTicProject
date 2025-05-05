from django.utils import timezone
from django.db import models

from UserProfile.models import UserAccount


class Ticket(models.Model):
    user_profile = models.ForeignKey(to=UserAccount, on_delete=models.CASCADE, related_name='tickets')
    title_artist = models.CharField(max_length=255, default="Unnamed Event")
    event_image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    ticket_image = models.ImageField(upload_to='ticket_images/')
    location = models.CharField(max_length=255, default="Unknown Location")
    venue = models.CharField(max_length=255, default="Unknown Venue")
    date = models.DateField(default=timezone.now)
    text = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=20, default="Unnamed Category")
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.title_artist} @ {self.location} ({self.date})"
