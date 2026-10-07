from apps.common.constants import roles
from .base import BasePermission


class IsHR(BasePermission):
    required_role = roles.HR

