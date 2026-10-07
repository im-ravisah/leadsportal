from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings

from apps.common.constants import roles as role_constants


token_generator = PasswordResetTokenGenerator()
User = get_user_model()


def generate_password_reset_token(user: User) -> str:
    return token_generator.make_token(user)


def send_password_reset_email(user: User, role: str) -> None:
    """
    Send a role-specific password reset email.
    In a real system this would include a reset URL with token.
    """
    if role == role_constants.SUPERADMIN:
        template = "superadmin/auth_email.html"
    elif role == role_constants.ADMIN:
        template = "admin/auth_email.html"
    elif role == role_constants.HR:
        template = "hr/auth_email.html"
    else:
        template = "assignee/auth_email.html"

    context = {
        "user": user,
        # TODO: include real reset URL when reset endpoint is implemented
        "reset_link": "#",
    }
    body = render_to_string(template, context)

    send_mail(
        subject="Password reset request",
        message="",
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        recipient_list=[user.email],
        html_message=body,
        fail_silently=True,
    )

