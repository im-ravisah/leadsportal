from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication


class AuthMiddleware(MiddlewareMixin):
    """
    Middleware to ensure JWT is validated early and user is attached.
    Business logic stays in services; this only authenticates.
    """

    def process_request(self, request):
        authenticator = JWTAuthentication()
        try:
            user_auth_tuple = authenticator.authenticate(request)
        except Exception:  # noqa: BLE001
            user_auth_tuple = None
        if user_auth_tuple is not None:
            request.user, request.auth = user_auth_tuple

