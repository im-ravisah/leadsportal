from django.apps import AppConfig


class AssigneeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.assignee"
    label = "leadsportal_assignee"
    verbose_name = "LeadsPortal Assignee"
