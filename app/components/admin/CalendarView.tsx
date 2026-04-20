import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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

  // Generate calendar days and group appointments by date
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create a map of appointments by date
    const appointmentsByDate: { [key: string]: DayAppointment[] } = {};
    (appointments || []).forEach((apt: any) => {
      const apptDate = new Date(apt.date_time || apt.date);
      const dateKey = `${apptDate.getFullYear()}-${apptDate.getMonth()}-${apptDate.getDate()}`;

      if (!appointmentsByDate[dateKey]) {
        appointmentsByDate[dateKey] = [];
      }

      appointmentsByDate[dateKey].push({
        id: apt.id?.toString(),
        time: apt.date_time
          ? new Date(apt.date_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : "TBD",
        patient: apt.patient?.first_name
          ? `${apt.patient.first_name} ${apt.patient.last_name}`
          : apt.patient_name || "Patient",
        procedure: apt.procedure || "Appointment",
        doctor: apt.doctor?.name || apt.doctor_name || "Not Assigned",
        status: apt.status || "Scheduled",
        statusColor: getStatusColor(apt.status),
      });
    });

    // Build calendar array
    const days: (DayAppointment[] | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${month}-${day}`;
      days.push(appointmentsByDate[dateKey] || []);
    }

    setCalendarDays(days);
  }, [currentDate, appointments]);

  function getStatusColor(status: string): string {
    const lower = status?.toLowerCase() || "";
    if (lower === "completed") return "bg-[#1DB67B]/10 text-[#1DB67B]";
    if (lower === "confirmed" || lower === "checked in") return "bg-[#4B7CFF]/10 text-[#4B7CFF]";
    if (lower === "pending") return "bg-[#ECAF20]/10 text-[#ECAF20]";
    return "bg-gray-100 text-gray-800";
  }

  function getDayOfWeek(index: number): string {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[index];
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
    const startingDayOfWeek = firstDay.getDay();
    const dayOfMonth = dayIndex - startingDayOfWeek + 1;

    setSelectedDay({
      date: new Date(year, month, dayOfMonth),
      appointments: appts,
    });
  }

  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDayIndex = Math.floor(calendarDays.findIndex((day) => day !== null) / 7) * 7;

  return (
    <div className="space-y-5">
      <Card className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{monthYear}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
                className="rounded-lg text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[1.125rem]">arrow_back</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="rounded-lg text-xs font-bold"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="rounded-lg text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
              </Button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-px mb-1 bg-gray-200 rounded-lg p-1">
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-gray-50 rounded p-2 text-center">
                <div className="text-xs font-bold text-gray-600">{getDayOfWeek(idx)}</div>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg p-1">
            {calendarDays.map((appts, index) => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              const firstDay = new Date(year, month, 1);
              const startingDayOfWeek = firstDay.getDay();
              const dayOfMonth = index - startingDayOfWeek + 1;
              const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= new Date(year, month + 1, 0).getDate();
              const isToday =
                isCurrentMonth &&
                dayOfMonth === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(index, appts)}
                  className={`min-h-24 bg-white rounded p-2 cursor-pointer transition-all hover:border-[#00605A] border-2 ${
                    isCurrentMonth ? "border-gray-200" : "border-gray-100 bg-gray-50"
                  } ${isToday ? "border-[#00605A] bg-[#EAF8F8]" : ""} ${appts && appts.length > 0 ? "hover:shadow-md" : ""}`}
                >
                  <div
                    className={`text-xs font-bold mb-1 ${
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } ${isToday ? "text-[#00605A]" : ""}`}
                  >
                    {isCurrentMonth ? dayOfMonth : ""}
                  </div>

                  {/* Appointments */}
                  <div className="space-y-1">
                    {appts && appts.length > 0 ? (
                      <>
                        {appts.slice(0, 2).map((apt, idx) => (
                          <div
                            key={idx}
                            className={`text-[0.65rem] font-semibold p-1 rounded truncate ${apt.statusColor}`}
                          >
                            {apt.time} • {apt.patient.split(" ")[0]}
                          </div>
                        ))}
                        {appts.length > 2 && (
                          <div className="text-[0.65rem] font-bold text-gray-500 px-1">
                            +{appts.length - 2} more
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Details Modal */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00605A]">
              {selectedDay?.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </DialogTitle>
            <DialogDescription>{selectedDay?.appointments.length || 0} appointments scheduled</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDay?.appointments.map((apt) => (
              <div key={apt.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">{apt.patient}</div>
                    <div className="text-xs text-gray-500 mt-1">{apt.procedure}</div>
                  </div>
                  <Badge variant="secondary" className={`text-[0.625rem] font-bold ${apt.statusColor}`}>
                    {apt.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[1rem]">schedule</span>
                    {apt.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[1rem]">person</span>
                    {apt.doctor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
