from django.apps import AppConfig


class SuperAdminConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.superadmin"
    label = "leadsportal_superadmin"
    verbose_name = "LeadsPortal SuperAdmin"
