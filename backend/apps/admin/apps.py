from django.apps import AppConfig


class AdminConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.admin"
    label = "leadsportal_admin"
    verbose_name = "LeadsPortal Admin"
