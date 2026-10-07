## LeadsPortal – CRM Enterprise Monorepo

This repository contains the **LeadsPortal** CRM Enterprise monorepo, combining:

- **frontend**: React + TypeScript (Vite, TanStack Query/Table, Tailwind, ShadCN, Zod)
- **backend**: Django + DRF with clean architecture and strict role isolation
- **docker**: Infrastructure for local/dev containers
- **docs**: High-level architecture and API documentation

### High-Level Folder Structure

- `frontend/` – SPA client (structure intentionally abstracted at this stage)
- `backend/` – Django + DRF API
- `docker/` – App-specific Dockerfiles
- `docs/` – Architecture and API docs

The backend enforces:

- Role-based separation: **SuperAdmin**, **Admin**, **HR**, **Assignee**
- Clean layers: **Views → Serializers → Services → Response helpers**
- Enterprise concerns: JWT, API keys, permissions, rate limiting, pagination, caching, and audit trails.

