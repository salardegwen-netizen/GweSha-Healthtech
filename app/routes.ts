import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login",       "routes/login.tsx"),
  route("register",    "routes/register.tsx"),
  route("appointment", "routes/appointment.tsx"),
  route("dashboard",   "routes/dashboard.tsx"),
  route("records",     "routes/records.tsx"),
  route("billing",     "routes/billing.tsx"),
  route("profile",     "routes/profile.tsx"),
  route("settings",    "routes/settings.tsx"),

  // Admin section — layout with nested child routes
  route("admin", "routes/admin/layout.tsx", [
    index("routes/admin/overview.tsx"),
    route("patients", "routes/admin/patients.tsx"),
    route("schedule",  "routes/admin/schedule.tsx"),
    route("billing",   "routes/admin/billing.tsx"),
    route("staff",     "routes/admin/staff.tsx"),
    route("settings",  "routes/admin/settings.tsx"),
  ]),

  // Catch-all 404 route - must be last
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;

