from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.common.constants import roles as role_constants
from apps.common.models.role import Role


class Command(BaseCommand):
    help = "Create or update the initial Superadmin user for LeadsPortal"

    def handle(self, *args, **options):
        User = get_user_model()

        # Get or create superadmin role
        superadmin_role, _ = Role.objects.get_or_create(
            code=role_constants.SUPERADMIN,
            defaults={
                "name": "Super Admin",
                "description": "Platform owner with full system access"
            }
        )

        payload = {
            "first_name": "Rupinderpal",
            "last_name": "Singh",
            "email": "rpsingh@yopmail.com",
            "username": "rpsingh@yopmail.com",
            "phone_number": "9234567824",
            "role": superadmin_role,
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
        }

        user, created = User.objects.update_or_create(
            email=payload["email"],
            defaults=payload,
        )
        # Set a default password if newly created
        if created or not user.has_usable_password():
            user.set_password("SuperAdmin@123")
            user.save(update_fields=["password"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Superadmin user ensured: {user.email} (password: SuperAdmin@123)"
            )
        )

