import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import UserAccount


@receiver(pre_save, sender=UserAccount)
def auto_delete_old_avatar_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return  # Skip new user creation

    try:
        old_avatar = UserAccount.objects.get(pk=instance.pk).avatar
    except UserAccount.DoesNotExist:
        return

    new_avatar = instance.avatar
    if old_avatar and old_avatar != new_avatar:
        if os.path.isfile(old_avatar.path):
            os.remove(old_avatar.path)
