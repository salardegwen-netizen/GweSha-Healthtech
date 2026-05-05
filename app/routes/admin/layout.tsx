import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "~/components/admin/AdminSidebar";
import AdminHeader from "~/components/admin/AdminHeader";
import { Toaster } from "~/components/ui/sonner";
import { type Role, getRole } from "~/lib/role";

export default function AdminLayout() {
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

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-['Inter'] flex">
      <AdminSidebar role={role} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader role={role} />

        <main className="flex-1 p-8">
          <div className="w-full max-w-[1400px] mx-auto">
            {/* Pass role via Outlet context so child pages can read it */}
            <Outlet context={{ role }} />
          </div>
        </main>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
