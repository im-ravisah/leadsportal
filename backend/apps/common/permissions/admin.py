from apps.common.constants import roles
from .base import BasePermission


class IsAdmin(BasePermission):
    required_role = roles.ADMIN

