import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLoginPage } from "./login";
import { AdminForgotPasswordPage } from "./forgot-password";

export function AdminAuthRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

