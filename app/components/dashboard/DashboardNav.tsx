import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useData } from "~/lib/DataContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function DashboardNav() {
  const navigate = useNavigate();
  const { notifications } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  // Update unread count dynamically
  // Load user info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || 'User');
          setUserEmail(user.email || '');
        } catch { /* ignore parse errors */ }
      }
    }
  }, []);

  // Update unread count dynamically
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      const unread = notifications.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      appointment: "📅",
      invoice: "💰",
      payment: "💳",
      prescription: "💊",
      lab_result: "🧪",
      message: "💬",
      system: "⚙️",
      alert: "🚨",
      update: "📢",
    };
    return icons[type] || "📬";
  };

  const getNotificationColor = (type: string) => {
    const colors: { [key: string]: string } = {
      appointment: "border-l-blue-500",
      invoice: "border-l-green-500",
      payment: "border-l-emerald-500",
      prescription: "border-l-purple-500",
      lab_result: "border-l-orange-500",
      message: "border-l-indigo-500",
      system: "border-l-gray-500",
      alert: "border-l-red-500",
      update: "border-l-yellow-500",
    };
    return colors[type] || "border-l-gray-400";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/85 backdrop-blur-md shadow-[0px_12px_32px_rgba(28,28,25,0.06)]">
      <div className="flex justify-between items-center px-8 h-20 w-full font-['Public_Sans'] tracking-tight">
        <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">The Sanctuary Portal</Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-[var(--color-primary)] font-bold border-b-2 border-[var(--color-primary)] pb-1 transition-all duration-300 ease-in-out">Dashboard</Link>
          <Link to="/appointment" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-300 ease-in-out">Appointments</Link>
          <Link to="/records" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-300 ease-in-out">Health Records</Link>
          <Link to="/billing" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-300 ease-in-out">Billing</Link>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications Dropdown */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger className="relative text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors group">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 rounded-xl border-gray-200 shadow-lg p-0 mt-2 max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {/* Notifications List */}
              {notifications && Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notification: any, idx: number) => (
                  <div
                    key={idx}
                    className={`border-l-4 ${getNotificationColor(notification.type)} p-4 hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary-container)] hover:opacity-80 transition-opacity">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqslDRT9dOYQCQWRZz5XSproFwX3P4kySEiBWBlXgp0YHVafjJUxLt5Cg2BDI8HC3t0dXf05sYTuwbVkvC72TydErxnneFVCkeFXxlAz5QzoNDff95IQrSuubhI6q5dLxKsw4C0f5P-U3BKMZvgpbU8weSKXMlOJd38iLP446HAsg3xrtCFbR-am50NDw45-kDQjf70fPaXXHM4tAgXfFoVUe7jyV42iZoWFc9RSxM1WUoMfPJYkCcGKkxlyqab_OGX-_XDx6MKkcT"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-200 shadow-md p-1 mt-2">
              <div className="px-4 py-3 text-sm">
                <p className="font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="text-sm font-semibold text-gray-700 cursor-pointer rounded-lg"
              >
                <span className="material-symbols-outlined text-lg mr-2">person</span>
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="text-sm font-semibold text-gray-700 cursor-pointer rounded-lg"
              >
                <span className="material-symbols-outlined text-lg mr-2">settings</span>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-sm font-semibold text-red-600 cursor-pointer rounded-lg hover:bg-red-50"
              >
                <span className="material-symbols-outlined text-lg mr-2">logout</span>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
