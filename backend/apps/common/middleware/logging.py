import logging
from time import monotonic

from django.utils.deprecation import MiddlewareMixin


logger = logging.getLogger("leadsportal.request")


class LoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request._start_time = monotonic()

    def process_response(self, request, response):
        duration = None
        if hasattr(request, "_start_time"):
            duration = monotonic() - request._start_time
        logger.info(
            "Request",
            extra={
                "path": request.path,
                "method": request.method,
                "status_code": getattr(response, "status_code", None),
                "duration": duration,
            },
        )
        return response

