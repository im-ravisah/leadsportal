### API Conventions

- **Base paths**
  - SuperAdmin: `/api/superadmin/…`
  - Admin: `/api/admin/…`
  - HR: `/api/hr/…`
  - Assignee: `/api/assignee/…`

- **Response envelope**
  - `{ "success": bool, "message": str, "data": {}, "errors": {} | null }`

- **Layers**
  - Views: thin controllers.
  - Serializers: validation only.
  - Services: business logic.
  - Responses: `apps.common.responses.api_response`.

