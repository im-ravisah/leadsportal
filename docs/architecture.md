### Architecture

- **Monorepo** containing:
  - `frontend/` – React + TypeScript SPA (Vite, TanStack Query/Table, Tailwind, ShadCN, Zod) – structure intentionally abstracted.
  - `backend/` – Django + DRF with clean layers and strict role isolation.
  - `docker/` – container definitions for backend and frontend.
  - `docs/` – high-level documentation.

- **Backend layers**
  - Views (controllers) – thin, responsible for orchestrating serializer → service → response.
  - Serializers – validation only, no business or DB logic.
  - Services – business logic, testable and reusable.
  - Common responses/exceptions – standardized API envelope and error handling.

