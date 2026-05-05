import { useState, useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useData } from "~/lib/DataContext";

type DayAppointment = {
  id: string;
  time: string;
  patient: string;
  procedure: string;
  doctor: string;
  status: string;
  statusColor: string;
};

export default function CalendarView() {
  const { appointments } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<(DayAppointment[] | null)[]>([]);
  const [selectedDay, setSelectedDay] = useState<{ date: Date; appointments: DayAppointment[] } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate calendar days and group appointments by date
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const appointmentsByDate: { [key: string]: DayAppointment[] } = {};
    (appointments || []).forEach((apt: any) => {
      let apptDate: Date;
      if (apt.date_time) {
        const dateStr = apt.date_time.replace(' ', 'T');
        apptDate = new Date(dateStr);
      } else if (apt.date) {
        // If it's just a date like YYYY-MM-DD, parse manually to avoid timezone shift
        const parts = apt.date.split('-');
        if (parts.length === 3) {
          apptDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
          apptDate = new Date(apt.date);
        }
      } else {
        return; // No date
      }

      if (isNaN(apptDate.getTime())) return; // Skip invalid dates

      const dateKey = `${apptDate.getFullYear()}-${String(apptDate.getMonth() + 1).padStart(2, '0')}-${String(apptDate.getDate()).padStart(2, '0')}`;

      if (!appointmentsByDate[dateKey]) {
        appointmentsByDate[dateKey] = [];
      }



      appointmentsByDate[dateKey].push({
        id: apt.id?.toString() || Math.random().toString(),
        time: apt.date_time 
          ? new Date(apt.date_time.replace(' ', 'T')).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          : (apt.time ? apt.time.substring(0, 5) : "TBD"),
        patient: apt.patient ? `${apt.patient.first_name || ''} ${apt.patient.last_name || ''}`.trim() || "Unknown Patient" : (apt.patient_name || "Unknown Patient"),
        procedure: apt.procedure || apt.type || "Appointment",
        doctor: apt.doctor ? apt.doctor.name : (apt.doctor_name || "Unknown Doctor"),
        status: apt.status || "Scheduled",
        statusColor: getProcedureColor(apt.procedure || apt.status || ""),
      });
    });

    const days: (DayAppointment[] | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(appointmentsByDate[dateKey] || []);
    }
    setCalendarDays(days);
  }, [currentDate, appointments]);

  function getProcedureColor(proc: string): string {
    const lower = proc?.toLowerCase() || "";
    if (lower.includes("surgery") || lower.includes("urgent")) return "bg-rose-100 text-rose-700 border-l-2 border-rose-500";
    if (lower.includes("therapy") || lower.includes("follow-up")) return "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500";
    if (lower.includes("checkup") || lower.includes("lab")) return "bg-blue-50 text-blue-700 border-l-2 border-blue-500";
    return "bg-gray-100 text-gray-700 border-l-2 border-gray-400";
  }

  function handlePrevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  function handleDayClick(dayIndex: number, appts: DayAppointment[] | null) {
    if (!appts || appts.length === 0) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const dayOfMonth = dayIndex - firstDay.getDay() + 1;
    setSelectedDay({
      date: new Date(year, month, dayOfMonth),
      appointments: appts,
    });
  }

  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900" suppressHydrationWarning>{isMounted ? monthYear : ""}</h2>
          <div className="flex text-gray-400">
            <button onClick={handlePrevMonth} className="hover:text-gray-900 transition-colors p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[1.25rem]">chevron_left</span>
            </button>
            <button onClick={handleNextMonth} className="hover:text-gray-900 transition-colors p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[1.25rem]">chevron_right</span>
            </button>
          </div>
        </div>
        <button
          onClick={handleToday}
          className="text-sm font-bold text-[#0052CC] flex items-center gap-1.5 hover:text-blue-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[1rem]">calendar_today</span>
          Go to Today
        </button>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 mb-2">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className="text-[0.65rem] font-bold text-gray-400 text-left px-2 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 border-l border-t border-gray-100">
        {calendarDays.map((appts, index) => {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const firstDay = new Date(year, month, 1);
          const dayOfMonth = index - firstDay.getDay() + 1;
          const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= new Date(year, month + 1, 0).getDate();
          const isToday =
            isMounted &&
            isCurrentMonth &&
            dayOfMonth === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={index}
              onClick={() => handleDayClick(index, appts)}
              className={`min-h-[120px] p-2 border-r border-b border-gray-100 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-50 transition-colors cursor-pointer group`}
              suppressHydrationWarning
            >
              <div className="flex justify-between items-start mb-2" suppressHydrationWarning>
                <div
                  className={`text-sm font-bold ${
                    isCurrentMonth ? (isToday ? "text-white bg-[#0052CC] w-6 h-6 flex items-center justify-center rounded-full" : "text-gray-900") : "text-gray-300"
                  }`}
                  suppressHydrationWarning
                >
                  {isCurrentMonth ? dayOfMonth : ""}
                </div>
                {isToday && <div className="text-[0.55rem] font-bold text-white bg-[#0052CC] px-1.5 py-0.5 rounded uppercase tracking-wider" suppressHydrationWarning>Today</div>}
              </div>

              <div className="space-y-1">
                {appts && appts.length > 0 ? (
                  <>
                    {appts.slice(0, 3).map((apt, idx) => (
                      <div
                        key={idx}
                        className={`text-[0.625rem] font-bold px-2 py-1 rounded-md border-l-2 truncate leading-tight flex flex-col ${apt.statusColor}`}
                        title={`${apt.time} - ${apt.patient} (Dr. ${apt.doctor})`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="truncate">{apt.patient}</span>
                          <span className="text-[0.55rem] opacity-75">{apt.time}</span>
                        </div>
                        <div className="text-[0.55rem] opacity-75 truncate">Dr. {apt.doctor.split(' ').pop()}</div>
                      </div>
                    ))}
                    {appts.length > 3 && (
                      <div className="text-[0.6rem] font-bold text-[#0052CC] pl-1">
                        +{appts.length - 3} more
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8">
            <DialogHeader className="mb-8 relative">
              <DialogTitle className="text-2xl font-bold text-[#003B95] pr-8">
                {selectedDay?.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-medium text-sm mt-1">
                {selectedDay?.appointments.length || 0} appointments scheduled
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-2 custom-scrollbar">
              {selectedDay?.appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium italic text-sm">
                  No appointments scheduled for this day.
                </div>
              ) : (
                selectedDay?.appointments.map((apt) => (
                  <div key={apt.id} className="p-6 border border-gray-100 rounded-[1.5rem] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group border-l-4 border-l-[#0052CC]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="font-extrabold text-gray-900 text-xl group-hover:text-[#0052CC] transition-colors">{apt.patient}</div>
                        <div className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{apt.procedure}</div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-bold text-[0.65rem] tracking-widest px-3 py-1 rounded-lg">
                        {apt.status?.toUpperCase() || "CONFIRMED"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-gray-50/80 px-4 py-3 rounded-2xl border border-gray-100 transition-colors group-hover:bg-white">
                        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0052CC]">
                          <span className="material-symbols-outlined text-[1.25rem]">schedule</span>
                        </div>
                        <div>
                          <div className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-tight">Time</div>
                          <div className="text-sm font-extrabold text-gray-900">{apt.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50/80 px-4 py-3 rounded-2xl border border-gray-100 transition-colors group-hover:bg-white">
                        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0052CC]">
                          <span className="material-symbols-outlined text-[1.25rem]">clinical_notes</span>
                        </div>
                        <div>
                          <div className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-tight">Doctor</div>
                          <div className="text-sm font-extrabold text-gray-900">{apt.doctor}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
