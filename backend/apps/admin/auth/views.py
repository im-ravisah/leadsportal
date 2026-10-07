from rest_framework.views import APIView

from apps.common.constants import messages, status_codes
from apps.common.responses.api_response import success_response

from .serializers import AdminLoginSerializer, AdminForgotPasswordSerializer
from .services import AdminAuthService


class AdminLoginView(APIView):
    permission_classes = []  # login is open; role is enforced in service

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = AdminAuthService.login(serializer.validated_data)
        return success_response(
            data=data,
            message=messages.LOGIN_SUCCESS,
            status=status_codes.HTTP_200_OK,
        )


class AdminForgotPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = AdminForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        AdminAuthService.request_password_reset(serializer.validated_data)
        return success_response(
            data={},
            message="If this email exists, a reset link has been sent.",
            status=status_codes.HTTP_200_OK,
        )

