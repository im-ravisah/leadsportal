from django.urls import path

from .views import AssigneeLoginView, AssigneeForgotPasswordView


urlpatterns = [
    path("auth/login/", AssigneeLoginView.as_view(), name="assignee-login"),
    path("auth/forgot-password/", AssigneeForgotPasswordView.as_view(), name="assignee-forgot-password"),
]

