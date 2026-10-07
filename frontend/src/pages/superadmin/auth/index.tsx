import { Navigate, Route, Routes } from "react-router-dom";

import { SuperadminLoginPage } from "./login";
import { SuperadminForgotPasswordPage } from "./forgot-password";

export function SuperadminAuthRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<SuperadminLoginPage />} />
      <Route path="forgot-password" element={<SuperadminForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

