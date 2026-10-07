import type { RouteObject } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { HrDashboard } from "../pages/hr/dashboard";
import { RoleGuard } from "../components/guards/RoleGuard";
import { NotFound } from "../pages/common/NotFound";

export const hrRoutes: RouteObject[] = [
  {
    path: "/hr",
    element: (
      <RoleGuard role={ROLES.HR} loginPath="/auth/hr/login">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto p-6">
            <HrDashboard />
          </div>
        </div>
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <HrDashboard />
      },
      {
        path: "dashboard",
        element: <HrDashboard />
      },
      // 404 catch-all
      {
        path: "*",
        element: <NotFound role={ROLES.HR} basePath="/hr" />
      }
    ]
  }
];
