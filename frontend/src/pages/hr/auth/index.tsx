import { Navigate, Route, Routes } from "react-router-dom";

import { HrLoginPage } from "./login";
import { HrForgotPasswordPage } from "./forgot-password";

export function HrAuthRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<HrLoginPage />} />
      <Route path="forgot-password" element={<HrForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

