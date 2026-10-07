from django.contrib.auth import authenticate, get_user_model

from apps.common.auth.jwt import generate_tokens_for_user
from apps.common.constants import messages, roles
from apps.common.exceptions.business import AuthenticationException
from apps.common.utils.tokens import generate_password_reset_token, send_password_reset_email

User = get_user_model()


class AssigneeAuthService:
    @staticmethod
    def login(data: dict) -> dict:
        email = data["email"]
        password = data["password"]
        user = authenticate(username=email, password=password)
        if not user or not user.role or user.role.code != roles.ASSIGNEE:
            raise AuthenticationException(detail=messages.LOGIN_FAILED)
        tokens = generate_tokens_for_user(user)
        return {"user_id": user.id, "role": user.role.code, "tokens": tokens}

    @staticmethod
    def request_password_reset(data: dict) -> None:
        email = data["email"]
        try:
            user: User = User.objects.get(email=email, role__code=roles.ASSIGNEE)
        except User.DoesNotExist:
            return
        _ = generate_password_reset_token(user)
        send_password_reset_email(user, roles.ASSIGNEE)
