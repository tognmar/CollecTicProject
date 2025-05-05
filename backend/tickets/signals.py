import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Ticket


@receiver(pre_save, sender=Ticket)
def auto_delete_old_event_images_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return  # Skip new user creation

    try:
        old_event_image = Ticket.objects.get(pk=instance.pk).event_image
    except Ticket.DoesNotExist:
        return

    new_event_image = instance.event_image
    if old_event_image and old_event_image != new_event_image:
        if os.path.isfile(old_event_image.path):
            os.remove(old_event_image.path)
