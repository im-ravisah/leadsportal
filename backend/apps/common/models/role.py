from django.db import models

from .base import BaseModel
from apps.common.constants import roles as role_constants


class Role(BaseModel):
    code = models.CharField(max_length=32, choices=role_constants.ROLE_CHOICES, unique=True)
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "roles"

    def __str__(self) -> str:
        return self.name

