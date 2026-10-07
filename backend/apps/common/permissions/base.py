from rest_framework.permissions import BasePermission as DRFBasePermission


class BasePermission(DRFBasePermission):
    """
    Base permission from which all role permissions should inherit.
    """

    required_role: str | None = None

    def has_permission(self, request, view) -> bool:  # noqa: ARG002
        if not request.user or not request.user.is_authenticated:
            return False
        if self.required_role is None:
            return True
        return getattr(request.user, "role", None) == self.required_role

