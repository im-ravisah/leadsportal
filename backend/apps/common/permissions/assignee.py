from apps.common.constants import roles
from .base import BasePermission


class IsAssignee(BasePermission):
    required_role = roles.ASSIGNEE

