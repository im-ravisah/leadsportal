import { Navigate, Route, Routes } from "react-router-dom";

import { AssigneeLoginPage } from "./login";
import { AssigneeForgotPasswordPage } from "./forgot-password";

export function AssigneeAuthRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<AssigneeLoginPage />} />
      <Route path="forgot-password" element={<AssigneeForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

