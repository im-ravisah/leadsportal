from django.contrib.auth.models import AbstractUser
from django.db import models

from .base import BaseModel


class User(AbstractUser, BaseModel):
    role = models.ForeignKey(
        "common.Role",
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )

    phone_number = models.CharField(max_length=20, blank=True)

    class Meta:
        db_table = "users"

