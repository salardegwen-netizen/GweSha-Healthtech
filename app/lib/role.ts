export type Role = "admin" | "patient";

const KEY = "sanctuaryRole";

export function getRole(): Role {
  if (typeof window === "undefined") return "patient";
  return (localStorage.getItem(KEY) as Role) ?? "patient";
}

export function setRole(role: Role) {
  localStorage.setItem(KEY, role);
}

export function clearRole() {
  localStorage.removeItem(KEY);
}

export const ROLE_META: Record<Role, { label: string; color: string; description: string }> = {
  admin:   { label: "Admin",   color: "bg-emerald-100 text-emerald-800", description: "Full system access" },
  patient: { label: "Patient", color: "bg-blue-100 text-blue-700",       description: "Patient portal" },
};
