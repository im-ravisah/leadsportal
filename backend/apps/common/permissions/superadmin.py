from apps.common.constants import roles
from .base import BasePermission


class IsSuperAdmin(BasePermission):
    required_role = roles.SUPERADMIN

