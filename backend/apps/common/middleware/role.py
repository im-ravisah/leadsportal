from django.utils.deprecation import MiddlewareMixin


class RoleMiddleware(MiddlewareMixin):
    """
    Simple hook to ensure `request.role` is consistently available.
    Permissions still enforce role checks.
    """

    def process_request(self, request):
        user = getattr(request, "user", None)
        request.role = getattr(user, "role", None) if user and user.is_authenticated else None

