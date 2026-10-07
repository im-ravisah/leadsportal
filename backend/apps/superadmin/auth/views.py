from rest_framework.views import APIView

from apps.common.constants import messages, status_codes
from apps.common.responses.api_response import success_response

from .serializers import SuperAdminLoginSerializer, SuperAdminForgotPasswordSerializer
from .services import SuperAdminAuthService


class SuperAdminLoginView(APIView):
    permission_classes = []  # login is open; role is enforced in service

    def post(self, request):
        serializer = SuperAdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = SuperAdminAuthService.login(serializer.validated_data)
        return success_response(
            data=data,
            message=messages.LOGIN_SUCCESS,
            status=status_codes.HTTP_200_OK,
        )


class SuperAdminForgotPasswordView(APIView):
    permission_classes = []  # open endpoint; no info leakage

    def post(self, request):
        serializer = SuperAdminForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        SuperAdminAuthService.request_password_reset(serializer.validated_data)
        return success_response(
            data={},
            message="If this email exists, a reset link has been sent.",
            status=status_codes.HTTP_200_OK,
        )

