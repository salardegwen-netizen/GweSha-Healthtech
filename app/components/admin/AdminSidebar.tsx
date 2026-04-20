import { Link, useLocation } from "react-router";
import type { Role } from "~/lib/role";

type NavItem = { label: string; icon: string; path: string; roles: Role[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",        icon: "space_dashboard",        path: "/admin",          roles: ["admin"] },
  { label: "Patients",        icon: "groups",                 path: "/admin/patients", roles: ["admin"] },
  { label: "Schedule",        icon: "calendar_month",         path: "/admin/schedule", roles: ["admin"] },
  { label: "Billing Console", icon: "account_balance_wallet", path: "/admin/billing",  roles: ["admin"] },
  { label: "Staff",           icon: "badge",                  path: "/admin/staff",    roles: ["admin"] },
  { label: "Settings",        icon: "settings",               path: "/admin/settings", roles: ["admin"] },
];

const ROLE_LABELS: Record<Role, string> = {
  admin:   "Admin Console",
  patient: "Patient Portal",
};

type Props = { role: Role };

export default function AdminSidebar({ role }: Props) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin" || location.pathname === "/admin/";
    return location.pathname === path;
  };

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-[#064E3B] min-h-screen text-white flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-5 mb-3">
        <h1 className="text-lg font-bold font-[var(--font-headline)] tracking-tight">Sanctuary Health</h1>
        <p className="text-[0.625rem] font-bold text-[#8CE3DE] tracking-[0.1em] uppercase mt-0.5">
          {ROLE_LABELS[role]}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
        <div className="text-[0.6875rem] font-bold text-[#80BEA6] uppercase tracking-[0.05em] mb-4 px-3">Main Menu</div>
        {visibleItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-[0.9rem] font-bold transition-all ${
                active
                  ? "bg-[#0b513d] text-white shadow-sm"
                  : "text-[#d1e9e0] hover:bg-[#0b513d]/50 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[1.375rem]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role indicator at bottom */}
      <div className="p-5 border-t border-[#0b513d]">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          role === "admin" ? "bg-emerald-900/30" : "bg-teal-900/30"
        }`}>
          <span className="material-symbols-outlined text-[1.125rem] text-[#8CE3DE]">
            {role === "admin" ? "admin_panel_settings" : "account_balance_wallet"}
          </span>
          <div>
            <div className="text-[0.6875rem] font-extrabold text-white">
              {role === "admin" ? "Administrator" : "Finance Staff"}
            </div>
            <div className="text-[0.5625rem] text-[#80BEA6] font-medium">
              {role === "admin" ? "Full Access" : "Billing Access Only"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
