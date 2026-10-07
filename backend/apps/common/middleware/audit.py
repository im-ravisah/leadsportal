import logging
from django.utils.deprecation import MiddlewareMixin


audit_logger = logging.getLogger("leadsportal.audit")


class AuditMiddleware(MiddlewareMixin):
    """
    Very lightweight audit hook – concrete business audits live in services.
    """

    def process_response(self, request, response):
        user = getattr(request, "user", None)
        audit_logger.info(
            "AuditTrail",
            extra={
                "user_id": getattr(user, "id", None),
                "role": getattr(user, "role", None),
                "path": request.path,
                "method": request.method,
                "status_code": getattr(response, "status_code", None),
            },
        )
        return response

