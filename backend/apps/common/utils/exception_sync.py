from rest_framework.views import exception_handler

from apps.common.responses.api_response import error_response
from apps.common.constants import messages, status_codes


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Normalize DRF validation and API errors into standard envelope
        return error_response(
            message=str(exc.detail if hasattr(exc, "detail") else messages.SERVER_ERROR),
            errors=response.data,
            status=response.status_code,
        )

    # Fallback for unhandled exceptions
    return error_response(
        message=messages.SERVER_ERROR,
        errors={"detail": str(exc)},
        status=status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
    )

