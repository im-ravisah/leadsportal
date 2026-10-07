import { Navigate, Outlet, useLocation } from "react-router-dom";
import { type Role } from "../../constants/roles";
import { getAuthToken } from "../../utils/auth";

interface RoleGuardProps {
  role: Role;
  loginPath: string;
  children?: React.ReactNode;
}

export function RoleGuard({ role, loginPath, children }: RoleGuardProps) {
  const location = useLocation();
  const token = getAuthToken(role);

  if (!token) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}

