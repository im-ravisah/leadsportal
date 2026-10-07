from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.common.models.role import Role
from apps.common.constants import roles as role_constants

User = get_user_model()


class Command(BaseCommand):
    help = "Seed initial users for development (SuperAdmin, Admin, HR, Assignee)"

    def handle(self, *args, **options):
        seed_users = [
            {
                "email": "superadmin@leadsportal.com",
                "username": "superadmin@leadsportal.com",
                "password": "AdminPassword123!",
                "first_name": "Super",
                "last_name": "Admin",
                "role_code": role_constants.SUPERADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "email": "admin@leadsportal.com",
                "username": "admin@leadsportal.com",
                "password": "AdminPassword123!",
                "first_name": "System",
                "last_name": "Admin",
                "role_code": role_constants.ADMIN,
                "is_staff": True,
                "is_superuser": False,
            },
            {
                "email": "hr@leadsportal.com",
                "username": "hr@leadsportal.com",
                "password": "AdminPassword123!",
                "first_name": "HR",
                "last_name": "Manager",
                "role_code": role_constants.HR,
                "is_staff": False,
                "is_superuser": False,
            },
            {
                "email": "assignee@leadsportal.com",
                "username": "assignee@leadsportal.com",
                "password": "AdminPassword123!",
                "first_name": "Lead",
                "last_name": "Assignee",
                "role_code": role_constants.ASSIGNEE,
                "is_staff": False,
                "is_superuser": False,
            },
        ]

        for udata in seed_users:
            role = Role.objects.get(code=udata["role_code"])
            user, created = User.objects.get_or_create(
                username=udata["username"],
                defaults={
                    "email": udata["email"],
                    "first_name": udata["first_name"],
                    "last_name": udata["last_name"],
                    "role": role,
                    "is_staff": udata["is_staff"],
                    "is_superuser": udata["is_superuser"],
                    "is_active": True,
                },
            )
            user.set_password(udata["password"])
            user.role = role
            user.is_active = True
            user.save()

            status_str = "Created" if created else "Updated"
            self.stdout.write(
                self.style.SUCCESS(
                    f"{status_str} {role.name}: {udata['email']} / {udata['password']}"
                )
            )

        self.stdout.write(self.style.SUCCESS("All seed users successfully configured!"))
