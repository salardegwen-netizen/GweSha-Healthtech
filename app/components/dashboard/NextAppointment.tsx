import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "~/lib/api";

interface Appointment {
  id: string;
  date_time: string;
  doctor?: { name: string };
  procedure: string;
  status: string;
}

export default function NextAppointment() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNextAppointment();
  }, []);

  const fetchNextAppointment = async () => {
    try {
      setLoading(true);
      const response = await api.appointments.list();
      const appointments = response.data.data || [];

      // Find next appointment (first one that's not completed)
      const next = appointments.find((apt: any) => apt.status !== 'completed');
      setAppointment(next || appointments[0]);
    } catch (err) {
      console.error('Failed to fetch appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="col-span-1 lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="col-span-1 lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
        <p className="text-[var(--color-on-surface-variant)]">No upcoming appointments</p>
      </div>
    );
  }

  const formatDate = (dateTimeStr: string) => {
    try {
      // Parse ISO 8601 format: 2026-04-20T10:30:00.000000Z
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (dateTimeStr: string) => {
    try {
      // Parse ISO 8601 format: 2026-04-20T10:30:00.000000Z
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        return "";
      }
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="col-span-1 lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <img
          alt="Health concept"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk6emqQld-MvVqgEx5nh2v37La7HyLnMu1PIasSnRJ2A5VrWnzZzE6Dt3XQQkJ7TjvP8ijVNrsiO-k4kRFmnuM0MRMXswbE9tW9uMS5wo14sY_Y1hccHwZ_WfJLyTlqmtHj56Pg3C_Mhw9Cqt9iwF174uZUfPRFerdhqfk6CnpWSJON1KKQDZVRxw6726qyYPv03L6uTlujqRGbMK-hRPzIERHHqgbBB6Bojg1lyX83HvU3RE-OUlT4lw_NQvD-nFyCGRohUtGyxID"
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-4">
          <span className="material-symbols-outlined text-[1rem] text-[var(--color-tertiary)]">event</span>
          <span className="text-[0.6875rem] font-bold tracking-wider uppercase text-[var(--color-tertiary)]">Upcoming Session</span>
        </div>
        <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[var(--color-on-surface)] mb-1">{appointment.procedure}</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-medium">with {appointment.doctor?.name || 'Doctor'}</p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-6 mt-6">
        <div>
          <p className="text-[0.625rem] uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-0.5">Date</p>
          <p className="text-lg font-bold">{formatDate(appointment.date_time)}</p>
        </div>
        <div>
          <p className="text-[0.625rem] uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-0.5">Time</p>
          <p className="text-lg font-bold text-[var(--color-primary)]">{formatTime(appointment.date_time)}</p>
        </div>
        <div className="flex-grow flex xl:justify-end">
          <button
            onClick={() => navigate("/appointment")}
            className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-outline-variant)] hover:text-white transition-colors">
            Manage Booking
          </button>
        </div>
      </div>
    </div>
  );
}
