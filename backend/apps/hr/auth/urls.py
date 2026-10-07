from django.urls import path

from .views import HRLoginView, HRForgotPasswordView


urlpatterns = [
    path("auth/login/", HRLoginView.as_view(), name="hr-login"),
    path("auth/forgot-password/", HRForgotPasswordView.as_view(), name="hr-forgot-password"),
]

