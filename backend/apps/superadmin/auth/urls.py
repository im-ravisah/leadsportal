from django.urls import path

from .views import SuperAdminLoginView, SuperAdminForgotPasswordView


urlpatterns = [
    path("auth/login/", SuperAdminLoginView.as_view(), name="superadmin-login"),
    path("auth/forgot-password/", SuperAdminForgotPasswordView.as_view(), name="superadmin-forgot-password"),
]

