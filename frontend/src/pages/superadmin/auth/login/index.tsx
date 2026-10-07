import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../../../../services/auth";
import { setAuthToken } from "../../../../utils/auth";
import { ROLES } from "../../../../constants/roles";
import { ROUTES } from "../../../../constants/routes";
import { Button } from "../../../../components/ui/button";

export function SuperadminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password, role: ROLES.SUPERADMIN },
      {
        onSuccess: (res: any) => {
          const token = res?.data?.tokens?.access ?? res?.data?.tokens?.access;
          if (token) {
            setAuthToken(ROLES.SUPERADMIN, token);
            navigate(ROUTES.DASHBOARD[ROLES.SUPERADMIN]);
          }
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-black/60 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-2 text-2xl font-semibold text-white">Superadmin Portal</h1>
        <p className="mb-6 text-sm text-slate-400">
          Sign in to manage organizations, plans, and platform settings.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>LeadsPortal v1.0</span>
            <a href="/auth/superadmin/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Button className="w-full mt-2" type="submit" disabled={login.isPending}>
            {login.isPending ? "Signing in..." : "Sign in as Superadmin"}
          </Button>
        </form>
      </div>
    </div>
  );
}

