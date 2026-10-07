from django.urls import include, path
from django.http import JsonResponse


def healthcheck(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("health/", healthcheck, name="healthcheck"),
    path("api/superadmin/", include("apps.superadmin.auth.urls")),
    path("api/admin/", include("apps.admin.auth.urls")),
    path("api/hr/", include("apps.hr.auth.urls")),
    path("api/assignee/", include("apps.assignee.auth.urls")),
]

