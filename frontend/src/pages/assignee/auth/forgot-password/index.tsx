import { useState } from "react";

import { apiClient } from "../../../../lib/axios";

export function AssigneeForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.post("/assignee/auth/forgot-password/", { email });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-xl font-semibold">Reset password</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send instructions to reset your password.
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
          <button
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            type="submit"
          >
            Send reset link
          </button>
          {sent && (
            <p className="text-xs text-green-600">
              If this email exists, a reset link has been sent to your inbox.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

