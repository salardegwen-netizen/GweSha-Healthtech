import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import AdminSidebar from "~/components/admin/AdminSidebar";
import AdminHeader from "~/components/admin/AdminHeader";
import { Toaster } from "~/components/ui/sonner";
import { Badge } from "~/components/ui/badge";
import { type Role, getRole, ROLE_META } from "~/lib/role";

const PAGE_TITLES: Record<string, string> = {
  "/admin":          "Overview",
  "/admin/patients": "Patient Directory",
  "/admin/schedule": "Clinical Schedule",
  "/admin/billing":  "Billing Console",
  "/admin/staff":    "Staff Roster",
  "/admin/settings": "Platform Settings",
};

const ROLE_GREETINGS: Record<Role, string> = {
  admin:   "Good Morning, Dr. Cole",
  patient: "Good Morning",
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRoleState] = useState<Role>("admin");

  useEffect(() => {
    const r = getRole();
    // Patients shouldn't be here — redirect to their portal
    if (r === "patient") {
      navigate("/dashboard", { replace: true });
      return;
    }
    setRoleState(r);
  }, []);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Admin Console";
  const roleMeta = ROLE_META[role];

  return (
    <div className="bg-[#F8F7F4] min-h-screen font-['Inter'] flex">
      <AdminSidebar role={role} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader role={role} />

        <main className="flex-1 p-6">
          <div className="w-full">

            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-[1.375rem] font-extrabold tracking-tight font-[var(--font-headline)] text-[#00605A] mb-1">
                  {ROLE_GREETINGS[role]}
                </h1>
                <p className="text-[0.8125rem] text-gray-500 flex items-center gap-2">
                  {pageTitle} — Sanctuary Health Console
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.5625rem] font-extrabold uppercase tracking-wider ${roleMeta.color}`}>
                    {roleMeta.label}
                  </span>
                </p>
              </div>
              <Badge variant="outline" className="text-[0.75rem] font-bold text-gray-600 bg-white px-5 py-2.5 border border-gray-200 rounded-full shadow-sm flex items-center h-fit hover:bg-white flex-shrink-0">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Badge>
            </div>

            {/* Pass role via Outlet context so child pages can read it */}
            <Outlet context={{ role }} />

          </div>
        </main>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
