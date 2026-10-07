import { ROLES, type Role } from "../constants/roles";

const TOKEN_KEY_PREFIX = "lp";

function key(role: Role) {
  return `${TOKEN_KEY_PREFIX}:${role}:token`;
}

export function setAuthToken(role: Role, token: string) {
  localStorage.setItem(key(role), token);
}

export function getAuthToken(role: Role): string | null {
  return localStorage.getItem(key(role));
}

export function clearAuthToken(role: Role) {
  localStorage.removeItem(key(role));
}

export function clearAllAuth() {
  (Object.values(ROLES) as Role[]).forEach(r => clearAuthToken(r));
}

