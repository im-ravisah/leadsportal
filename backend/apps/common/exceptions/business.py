from .base import BusinessException


class AuthenticationException(BusinessException):
    default_detail = "Authentication failed"
    default_code = "authentication_failed"


class PermissionException(BusinessException):
    status_code = 403
    default_detail = "Permission denied"
    default_code = "permission_denied"

