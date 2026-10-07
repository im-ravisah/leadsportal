from typing import Any, Optional

from rest_framework.response import Response

from apps.common.constants import status_codes


def success_response(
    data: Optional[dict] = None,
    message: str = "Success",
    status: int = status_codes.HTTP_200_OK,
) -> Response:
    return Response(
        {
            "success": True,
            "message": message,
            "data": data or {},
            "errors": None,
        },
        status=status,
    )


def error_response(
    message: str,
    errors: Optional[dict] = None,
    status: int = status_codes.HTTP_400_BAD_REQUEST,
) -> Response:
    return Response(
        {
            "success": False,
            "message": message,
            "data": {},
            "errors": errors or {},
        },
        status=status,
    )

