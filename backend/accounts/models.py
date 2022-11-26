import uuid
from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Account(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False,
    )
    user = models.OneToOneField(
        User, 
        on_delete = models.CASCADE
    )
    first_name = models.CharField(
        max_length=50, 
        null=False, 
        blank=False
    )
    last_name = models.CharField(
        max_length=50, 
        null=False, 
        blank=False
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
