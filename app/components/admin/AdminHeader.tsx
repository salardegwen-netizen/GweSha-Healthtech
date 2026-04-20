import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Role, clearRole, ROLE_META } from "~/lib/role";
import { api } from "~/lib/api";
import { usePolling } from "~/lib/usePolling";
import NotificationCenter from "./NotificationCenter";

type Props = { role: Role };

const ROLE_PROFILES: Record<Role, { name: string; title: string; img: string }> = {
  admin:   { name: "Dr. Sarah Cole",  title: "Chief Administrator", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  patient: { name: "Eleanor Sterling",title: "Patient",             img: "https://randomuser.me/api/portraits/women/44.jpg" },
};

export default function AdminHeader({ role }: Props) {
  const navigate = useNavigate();
  const profile = ROLE_PROFILES[role];
  const roleMeta = ROLE_META[role];
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count from API
  const fetchUnreadCount = async () => {
    try {
      const response = await api.notifications.unreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Use polling hook for real-time updates (15 seconds)
  usePolling(() => {
    fetchUnreadCount();
  }, 15000);

  // Fetch on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const handleSignOut = () => {
    toast("Signing out securely...", { icon: "🔒" });
    clearRole();
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 px-6 flex items-center justify-between sticky top-0 z-10 w-full shadow-sm">
      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        {/* Role badge */}
        <span className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider ${roleMeta.color}`}>
          <span className="material-symbols-outlined text-[0.875rem]">
            {role === "admin" ? "admin_panel_settings" : "account_balance_wallet"}
          </span>
          {roleMeta.label}
        </span>

        <button
          onClick={() => setNotificationsOpen(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors relative"
          title="View notifications"
        >
          <span className="material-symbols-outlined text-[1.125rem]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full px-3 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <img src={profile.img} alt={profile.name} className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{profile.name}</p>
                <p className="text-[0.6875rem] text-gray-500 font-medium">{profile.title}</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-sm hidden md:block">expand_more</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-100 shadow-sm p-2 mt-1">
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs font-bold text-rose-600 cursor-pointer rounded-lg hover:bg-rose-50"
            >
              <span className="material-symbols-outlined text-[1.125rem] mr-2">logout</span>
              Secure Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NotificationCenter open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>
  );
}
