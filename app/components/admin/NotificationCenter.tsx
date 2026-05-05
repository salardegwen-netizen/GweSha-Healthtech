import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { api } from "~/lib/api";
import { useData } from "~/lib/DataContext";

type Notification = {
  id: string;
  type: "appointment" | "invoice" | "payment" | "prescription" | "lab_result" | "message" | "system" | "alert" | "update";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  color: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NotificationCenter({ open, onOpenChange }: Props) {
  const { notifications: dataContextNotifications } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(false);

  // Use DataContext notifications and transform them
  useEffect(() => {
    if (dataContextNotifications && dataContextNotifications.length > 0) {
      const formattedNotifications = dataContextNotifications.map((n: any) => ({
        id: n.id?.toString() || Math.random().toString(),
        type: n.notification_type || 'system',
        title: n.title || 'Notification',
        message: n.message || '',
        timestamp: n.created_at ? new Date(n.created_at).toLocaleString() : new Date().toLocaleString(),
        read: n.is_read || false,
        icon: getIconForType(n.notification_type),
        color: getColorForType(n.notification_type),
      }));
      setNotifications(formattedNotifications);
      setLoading(false);
    } else if (open && !loading) {
      // If dialog just opened, show loading briefly
      setLoading(true);
      // Stop loading after 1 second if no data
      setTimeout(() => setLoading(false), 1000);
    }
  }, [dataContextNotifications, open]);

  // Helper function to get icon based on notification type
  const getIconForType = (type: string) => {
    const iconMap: Record<string, string> = {
      appointment: 'schedule',
      invoice: 'receipt',
      payment: 'payments',
      prescription: 'medication',
      lab_result: 'science',
      message: 'chat',
      system: 'notifications',
      alert: 'warning',
      update: 'update',
    };
    return iconMap[type] || 'notifications';
  };

  // Helper function to get color based on notification type
  const getColorForType = (type: string) => {
    const colorMap: Record<string, string> = {
      appointment: 'bg-blue-100 text-blue-600',
      invoice: 'bg-green-100 text-green-600',
      payment: 'bg-emerald-100 text-emerald-600',
      prescription: 'bg-purple-100 text-purple-600',
      lab_result: 'bg-orange-100 text-orange-600',
      message: 'bg-indigo-100 text-indigo-600',
      system: 'bg-gray-100 text-gray-600',
      alert: 'bg-red-100 text-red-600',
      update: 'bg-yellow-100 text-yellow-600',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-600';
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === "unread" ? notifications.filter(n => !n.read) : notifications;

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleClearAll = async () => {
    try {
      await api.notifications.clearAll();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden max-h-[600px] flex flex-col">
        <DialogHeader className="border-b border-gray-100 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-[var(--font-headline)] text-xl font-extrabold text-gray-900">
                Notifications
              </DialogTitle>
              {unreadCount > 0 && (
                <Badge className="mt-2 bg-red-100 text-red-700 border-none font-bold">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-2 px-6 pt-4 border-b border-gray-100">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
              filter === "all"
                ? "bg-[#003B95] text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
              filter === "unread"
                ? "bg-[#003B95] text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <span className="material-symbols-outlined text-4xl block mb-2 opacity-50 animate-spin">
                sync
              </span>
              <p className="text-sm font-medium">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">notifications_none</span>
              <p className="text-sm font-medium">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  notification.read
                    ? "bg-gray-50 border-gray-100 hover:border-gray-200"
                    : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                    <span className="material-symbols-outlined text-[1.25rem]">{notification.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-[0.625rem] text-gray-400 mt-2">{notification.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-gray-100 p-4 flex gap-2">
            <Button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              variant="outline"
              className="flex-1 rounded-lg text-xs font-bold h-auto py-2"
            >
              Mark All as Read
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="flex-1 rounded-lg text-xs font-bold h-auto py-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

