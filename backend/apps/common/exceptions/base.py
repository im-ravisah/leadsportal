from rest_framework.exceptions import APIException


class BusinessException(APIException):
    status_code = 400
    default_detail = "Something went wrong"
    default_code = "business_error"


class ValidationException(BusinessException):
    status_code = 400
    default_detail = "Validation failed"
    default_code = "validation_error"

