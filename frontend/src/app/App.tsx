import { Navigate, useRoutes } from "react-router-dom";

import { SuperadminAuthRoutes } from "../pages/superadmin/auth";
import { AdminAuthRoutes } from "../pages/admin/auth";
import { HrAuthRoutes } from "../pages/hr/auth";
import { AssigneeAuthRoutes } from "../pages/assignee/auth";
import { superadminRoutes } from "../routes/superadminRoutes";
import { adminRoutes } from "../routes/adminRoutes";
import { assigneeRoutes } from "../routes/assigneeRoutes";
import { hrRoutes } from "../routes/hrRoutes";
import { ROLES } from "../constants/roles";
import { getAuthToken } from "../utils/auth";

function RootRedirect() {
  if (getAuthToken(ROLES.SUPERADMIN)) {
    return <Navigate to="/superadmin/dashboard" replace />;
  }
  if (getAuthToken(ROLES.ADMIN)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (getAuthToken(ROLES.HR)) {
    return <Navigate to="/hr/dashboard" replace />;
  }
  if (getAuthToken(ROLES.ASSIGNEE)) {
    return <Navigate to="/assignee/dashboard" replace />;
  }
  return <Navigate to="/auth/admin/login" replace />;
}

function App() {
  const routes = useRoutes([
    // Root Redirect
    { path: "/", element: <RootRedirect /> },
    // Auth Routes
    { path: "/auth/superadmin/*", element: <SuperadminAuthRoutes /> },
    { path: "/auth/admin/*", element: <AdminAuthRoutes /> },
    { path: "/auth/hr/*", element: <HrAuthRoutes /> },
    { path: "/auth/assignee/*", element: <AssigneeAuthRoutes /> },
    // Dashboard Routes
    ...superadminRoutes,
    ...adminRoutes,
    ...assigneeRoutes,
    ...hrRoutes,
    // Catch-all Redirect
    { path: "*", element: <RootRedirect /> }
  ]);

  return routes;
}

export default App;

