# Generated by Django 5.1.7 on 2025-04-14 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserProfile', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
