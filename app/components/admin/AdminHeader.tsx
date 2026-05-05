import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { type Role, ROLE_META } from "~/lib/role";
import { useData } from "~/lib/DataContext";
import NotificationCenter from "./NotificationCenter";

type Props = { role: Role };

const ROLE_PROFILES: Record<Role, { name: string; title: string; img: string }> = {
  admin:   { name: "Dr. Sarah Jenkins",  title: "Chief Administrator", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  patient: { name: "Eleanor Sterling",title: "Patient",             img: "https://randomuser.me/api/portraits/women/44.jpg" },
};

export default function AdminHeader({ role }: Props) {
  const navigate = useNavigate();
  const { unreadNotificationCount } = useData();
  const profile = ROLE_PROFILES[role];
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 h-[72px] px-8 flex items-center justify-between sticky top-0 z-10 w-full">
      <div className="flex-1 flex items-center max-w-2xl">
        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.25rem]">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, records, or staff..." 
            className="w-full bg-[#F4F6F8] border-none rounded-lg py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 outline-none placeholder:text-gray-400"
          />
        </form>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-gray-500">
          <button
            onClick={() => setNotificationsOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors relative"
          >
            <span className="material-symbols-outlined text-[1.25rem]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
          
          <button 
            onClick={() => navigate("/admin/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[1.25rem]">settings</span>
          </button>
          
          <button 
            onClick={() => navigate("/admin/settings?tab=help")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[1.25rem]">help_outline</span>
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-[0.875rem] font-bold text-gray-900 leading-tight group-hover:text-[#0052CC] transition-colors">{profile.name}</p>
            <p className="text-[0.75rem] text-gray-500 font-medium">{profile.title}</p>
          </div>
          <img src={profile.img} alt={profile.name} className="w-9 h-9 rounded-full border border-gray-200 object-cover" />
        </div>
      </div>

      <NotificationCenter open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>
  );
}
