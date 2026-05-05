import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { clearRole } from "~/lib/role";
import type { Role } from "~/lib/role";

type NavItem = { label: string; icon: string; path: string; roles: Role[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",        icon: "grid_view",              path: "/admin",          roles: ["admin"] },
  { label: "Patients",        icon: "person_outline",         path: "/admin/patients", roles: ["admin"] },
  { label: "Schedule",        icon: "calendar_today",         path: "/admin/schedule", roles: ["admin"] },
  { label: "Billing Console", icon: "account_balance_wallet", path: "/admin/billing",  roles: ["admin"] },
  { label: "Staff",           icon: "group",                  path: "/admin/staff",    roles: ["admin"] },
];

type Props = { role: Role };

export default function AdminSidebar({ role }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin" || location.pathname === "/admin/";
    return location.pathname.startsWith(path) && (path !== "/admin" || location.pathname === "/admin");
  };

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    toast("Signing out securely...", { icon: "🔒" });
    clearRole();
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <aside className="w-64 bg-white min-h-screen text-gray-600 flex flex-col fixed left-0 top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100">
      <div className="p-6 mb-2 flex items-center gap-3">
        {/* Logo Icon Placeholder */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%230052CC"/><text x="16" y="21" font-family="sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">GS</text></svg>';
          }} />
        </div>
        <div>
          <h1 className="text-[1rem] font-bold tracking-tight text-[#0052CC]">GweSha HealthTech</h1>
          <p className="text-[0.6rem] font-bold text-[#8A94A6] tracking-[0.1em] uppercase mt-0.5">
            Admin Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
        {visibleItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-[0.875rem] font-medium transition-all ${
                active
                  ? "bg-[#0052CC]/10 text-[#0052CC] font-semibold"
                  : "text-[#5A6B85] hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 mb-2">
        <Link
          to="/admin/settings"
          className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-[0.875rem] font-medium transition-all text-[#5A6B85] hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="material-symbols-outlined text-[1.25rem]">settings</span>
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[0.875rem] font-medium transition-all text-[#5A6B85] hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="material-symbols-outlined text-[1.25rem]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

