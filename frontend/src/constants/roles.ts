// Unified role names shared between backend and frontend.
// Strings MUST stay in sync with Django's apps.common.constants.roles.
export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  HR: "hr",
  ASSIGNEE: "assignee"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

