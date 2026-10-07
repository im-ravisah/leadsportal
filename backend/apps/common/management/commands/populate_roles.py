from django.core.management.base import BaseCommand

from apps.common.models.role import Role
from apps.common.constants import roles as role_constants


class Command(BaseCommand):
    help = "Populate roles table with initial roles"

    def handle(self, *args, **options):
        role_data = [
            {
                "code": role_constants.SUPERADMIN,
                "name": "Super Admin",
                "description": "Platform owner with full system access"
            },
            {
                "code": role_constants.ADMIN,
                "name": "Admin",
                "description": "Organization administrator"
            },
            {
                "code": role_constants.HR,
                "name": "HR",
                "description": "Human Resources role"
            },
            {
                "code": role_constants.ASSIGNEE,
                "name": "Assignee",
                "description": "Sales/Execution role"
            }
        ]

        for data in role_data:
            role, created = Role.objects.update_or_create(
                code=data["code"],
                defaults={
                    "name": data["name"],
                    "description": data["description"]
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created role: {role.name} ({role.code})")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"Role already exists: {role.name} ({role.code})")
                )

        self.stdout.write(
            self.style.SUCCESS("Roles population completed!")
        )
