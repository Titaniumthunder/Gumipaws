/**
 * Role-based access rules. Pure, edge-safe (imported by middleware) — no DB or
 * Node APIs here.
 */

export type Role = "ADMIN" | "MANAGER" | "WORKER";

export const ROLES: Role[] = ["ADMIN", "MANAGER", "WORKER"];

/** Where each role lands after login. */
export const ROLE_HOME: Record<Role, string> = {
  WORKER: "/admin/today",
  MANAGER: "/admin",
  ADMIN: "/admin",
};

/**
 * Which roles may access a given /admin path. `null` means "no role gate"
 * (e.g. the login page itself). Order matters — most specific first.
 */
export function requiredRoles(pathname: string): Role[] | null {
  if (pathname === "/admin/login") return null;
  if (pathname.startsWith("/admin/today")) return ["WORKER", "MANAGER", "ADMIN"];
  if (pathname.startsWith("/admin/staff")) return ["ADMIN"];
  if (pathname.startsWith("/admin/bookings")) return ["MANAGER", "ADMIN"];
  // /admin root and anything else under /admin → Manager/Admin.
  if (pathname === "/admin" || pathname.startsWith("/admin")) {
    return ["MANAGER", "ADMIN"];
  }
  return null;
}

export function canAccess(role: Role | undefined, pathname: string): boolean {
  const roles = requiredRoles(pathname);
  if (!roles) return true;
  return Boolean(role && roles.includes(role));
}
