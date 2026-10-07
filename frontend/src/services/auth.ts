import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../lib/axios";
import { ROLES, type Role } from "../constants/roles";

const ROLE_VALUES = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.HR,
  ROLES.ASSIGNEE
] as [Role, ...Role[]];

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(ROLE_VALUES)
});

type LoginInput = z.infer<typeof loginSchema>;

export function useLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: LoginInput) => {
      const body = loginSchema.parse(payload) as LoginInput;

      const pathByRole: Record<Role, string> = {
        [ROLES.SUPERADMIN]: "/superadmin/auth/login/",
        [ROLES.ADMIN]: "/admin/auth/login/",
        [ROLES.HR]: "/hr/auth/login/",
        [ROLES.ASSIGNEE]: "/assignee/auth/login/"
      };

      const { data } = await apiClient.post(pathByRole[body.role], {
        email: body.email,
        password: body.password
      });
      return data;
    }
  });
}

