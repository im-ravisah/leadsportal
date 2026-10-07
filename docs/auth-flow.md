### Auth Flow

1. Client sends credentials to role-specific endpoint:
   - `/api/superadmin/auth/login/`
   - `/api/admin/auth/login/`
   - `/api/hr/auth/login/`
   - `/api/assignee/auth/login/`
2. View validates request using a DRF serializer (validation only).
3. Service authenticates user and enforces role, then issues JWT (access + refresh) with role claim.
4. Response helper wraps result in standard API envelope.
5. Subsequent requests include `Authorization: Bearer <access_token>` and are processed by:
   - Middleware (logging, auth, role, audit)
   - DRF permissions (role-based)
   - View → Serializer → Service → Response.

