from datetime import timedelta

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def generate_tokens_for_user(user):
    """
    JWT helpers – no view logic, just token generation.
    """
    refresh = RefreshToken.for_user(user)
    # Get role code from ForeignKey relationship
    role_code = user.role.code if user.role else None
    refresh["role"] = role_code
    access = refresh.access_token
    access["role"] = role_code

    # SimpleJWT handles token lifetime automatically via settings
    # No need to manually set expiration

    return {
        "access": str(access),
        "refresh": str(refresh),
    }

