import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "./api";

type DataContextType = {
  patients: any[];
  appointments: any[];
  invoices: any[];
  staff: any[];
  notifications: any[];
  unreadNotificationCount: number;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPollingRef = useRef(false);

  const refreshData = async () => {
    if (isPollingRef.current) return;

    try {
      isPollingRef.current = true;

      // Fetch data with staggered requests to avoid connection exhaustion
      try {
        const patientsRes = await api.patients.list().catch(() => ({ data: { data: [] } }));
        setPatients(patientsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }

      try {
        const appointmentsRes = await api.appointments.list().catch(() => ({ data: { data: [] } }));
        setAppointments(appointmentsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }

      try {
        const invoicesRes = await api.invoices.list().catch(() => ({ data: { data: [] } }));
        setInvoices(invoicesRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }

      try {
        const staffRes = await api.staff.list().catch(() => ({ data: { data: [] } }));
        setStaff(staffRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      }

      try {
        const notificationsRes = await api.notifications.list().catch(() => ({ data: [] }));
        setNotifications(notificationsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }

      try {
        const unreadRes = await api.notifications.unreadCount().catch(() => ({ data: { unread_count: 0 } }));
        setUnreadNotificationCount(unreadRes.data?.unread_count || 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to refresh data:", err);
      setError("Failed to refresh data");
    } finally {
      isPollingRef.current = false;
      setLoading(false);
    }
  };

  // Poll on mount and then every 20 seconds (only if authenticated)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // Only fetch if user is authenticated
    if (token) {
      refreshData();
      const interval = setInterval(refreshData, 20000);
      return () => clearInterval(interval);
    } else {
      // User not authenticated, set loading to false
      setLoading(false);
    }
  }, []);

  const value: DataContextType = {
    patients,
    appointments,
    invoices,
    staff,
    notifications,
    unreadNotificationCount,
    loading,
    error,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
