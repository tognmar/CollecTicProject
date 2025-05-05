from django.db import models

from UserProfile.models import UserAccount


class Follow(models.Model):
    follower = models.ForeignKey(to=UserAccount, on_delete=models.CASCADE,
                                 related_name='following')  # user following another user
    followed = models.ForeignKey(to=UserAccount, on_delete=models.CASCADE,
                                 related_name='followers')  # user who is being followed
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')

    def __str__(self):
        return f"{self.follower} follows {self.followed}"
