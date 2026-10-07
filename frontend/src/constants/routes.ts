import { ROLES, type Role } from "./roles";

export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  
  // Dashboard routes by role
  DASHBOARD: {
    [ROLES.SUPERADMIN]: "/superadmin/dashboard",
    [ROLES.ADMIN]: "/admin/dashboard",
    [ROLES.HR]: "/hr/dashboard",
    [ROLES.ASSIGNEE]: "/assignee/dashboard"
  },
  
  // Common feature routes
  LEADS: {
    ALL: "/leads/all",
    WARM: "/leads/warm",
    COLD: "/leads/cold",
    HOT: "/leads/hot",
    DEAD: "/leads/dead",
    JUNK: "/leads/junk"
  },
  
  USERS: "/users",
  HR: "/hr"
} as const;
