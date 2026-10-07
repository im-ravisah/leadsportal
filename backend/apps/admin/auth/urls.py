from django.urls import path

from .views import AdminLoginView, AdminForgotPasswordView


urlpatterns = [
    path("auth/login/", AdminLoginView.as_view(), name="admin-login"),
    path("auth/forgot-password/", AdminForgotPasswordView.as_view(), name="admin-forgot-password"),
]

