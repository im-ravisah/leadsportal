from rest_framework_api_key.models import APIKey


def create_service_api_key(name: str, **extra):
    api_key, key = APIKey.objects.create_key(name=name, **extra)
    return api_key, key


def revoke_api_key(api_key: APIKey) -> None:
    api_key.revoked = True
    api_key.save(update_fields=["revoked"])

