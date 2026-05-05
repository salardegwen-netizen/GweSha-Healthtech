import { Link, useLocation, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { clearRole } from "~/lib/role";
import { toast } from "sonner";export default function PatientLayout({ children, title = "" }: { children: React.ReactNode, title?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "space_dashboard" },
    { name: "Appointments", path: "/appointment", icon: "calendar_month" },
    { name: "Health Records", path: "/records", icon: "description" },
    { name: "Billing", path: "/billing", icon: "payments" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <h1 className="text-[#003B95] text-xl font-bold tracking-tight">GweSha HealthTech</h1>
          <p className="text-gray-500 text-xs mt-0.5">Patient Access</p>
        </div>

        <nav className="flex-1 mt-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = path === item.path;
              return (
                <li key={item.name} className="relative">
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#003B95] rounded-r"></div>
                  )}
                  <Link
                    to={item.path}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      active ? "text-[#003B95] bg-[#F2F6FF]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="material-symbols-outlined mr-3 text-[1.25rem]">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6">
          <Link to="/appointment" className="w-full bg-[#003B95] text-white rounded-lg py-2.5 flex items-center justify-center text-sm font-semibold hover:bg-[#002D7A] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[1.25rem] mr-2">add</span>
            Book Appointment
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[1.25rem]">search</span>
            <input 
              type="text" 
              placeholder="Search records, doctors, services..." 
              className="w-full bg-[#F3F4F6] text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#003B95] focus:bg-white transition-colors"
            />
          </div>

            <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-full px-3 transition-colors border border-transparent hover:border-gray-100">
                  <div className="text-right mr-3 hidden md:block">
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                      {typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}').name || 'User') : 'User'}
                    </p>
                    <p className="text-[0.6875rem] text-gray-500 font-medium">
                      Patient ID: #{typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}').patient_id || 'N/A') : 'N/A'}
                    </p>
                  </div>
                  <img src="https://i.pravatar.cc/150?u=gwen" alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-100 shadow-sm p-2 mt-1">
                <DropdownMenuItem
                  onClick={() => {
                    toast("Signing out securely...", { icon: "🔒" });
                    clearRole();
                    setTimeout(() => navigate("/login"), 1000);
                  }}
                  className="text-xs font-bold text-rose-600 cursor-pointer rounded-lg hover:bg-rose-50 p-2"
                >
                  <span className="material-symbols-outlined text-[1.125rem] mr-2">logout</span>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
