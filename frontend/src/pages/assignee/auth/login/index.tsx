import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../../../../services/auth";
import { setAuthToken } from "../../../../utils/auth";
import { ROLES } from "../../../../constants/roles";
import { ROUTES } from "../../../../constants/routes";
import { Button } from "../../../../components/ui/button";

export function AssigneeLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password, role: ROLES.ASSIGNEE },
      {
        onSuccess: (res: any) => {
          const token = res?.data?.tokens?.access ?? res?.data?.tokens?.access;
          if (token) {
            setAuthToken(ROLES.ASSIGNEE, token);
            navigate(ROUTES.DASHBOARD[ROLES.ASSIGNEE]);
          }
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-semibold">Assignee Login</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Sign in to manage your tasks, leads, and daily activities.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end text-xs">
            <a href="/auth/assignee/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Button className="w-full mt-2" type="submit" disabled={login.isPending}>
            {login.isPending ? "Signing in..." : "Sign in as Assignee"}
          </Button>
        </form>
      </div>
    </div>
  );
}

