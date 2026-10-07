import type { RouteObject } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { DashboardLayout } from "../pages/common/DashboardLayout";
import { Dashboard } from "../pages/common/Dashboard";
import { RoleGuard } from "../components/guards/RoleGuard";
import { AllLeads } from "../pages/common/leads/AllLeads";
import { PrimeProspects } from "../pages/common/leads/PrimeProspects";
import { Partner } from "../pages/common/leads/Partner";
import { Awarded } from "../pages/common/leads/Awarded";
import { Delayed } from "../pages/common/leads/Delayed";
import { WarmLeads } from "../pages/common/leads/WarmLeads";
import { ColdLeads } from "../pages/common/leads/ColdLeads";
import { HotLeads } from "../pages/common/leads/HotLeads";
import { Hr } from "../pages/common/Hr";
import { AllUsers } from "../pages/common/AllUsers";
import { NotFound } from "../pages/common/NotFound";
import { Profile } from "../pages/common/Profile";

export const assigneeRoutes: RouteObject[] = [
  {
    path: "/assignee",
    element: (
      <RoleGuard role={ROLES.ASSIGNEE} loginPath="/auth/assignee/login">
        <DashboardLayout role={ROLES.ASSIGNEE} basePath="/assignee" />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard role={ROLES.ASSIGNEE} />
      },
      {
        path: "dashboard",
        element: <Dashboard role={ROLES.ASSIGNEE} />
      },
      // Leads routes
      {
        path: "leads/all",
        element: <AllLeads />
      },
      {
        path: "leads/prime-prospects",
        element: <PrimeProspects />
      },
      {
        path: "leads/partner",
        element: <Partner />
      },
      {
        path: "leads/awarded",
        element: <Awarded />
      },
      {
        path: "leads/delayed",
        element: <Delayed />
      },
      {
        path: "leads/warm",
        element: <WarmLeads />
      },
      {
        path: "leads/cold",
        element: <ColdLeads />
      },
      {
        path: "leads/hot",
        element: <HotLeads />
      },
      // HR route
      {
        path: "hr",
        element: <Hr />
      },
      {
        path: "profile",
        element: <Profile role={ROLES.ASSIGNEE} />
      },
      // Users route
      {
        path: "users",
        element: <AllUsers />
      },
      // 404 catch-all
      {
        path: "*",
        element: <NotFound role={ROLES.ASSIGNEE} basePath="/assignee" />
      }
    ]
  }
];
