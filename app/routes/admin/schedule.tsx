import CalendarView from "~/components/admin/CalendarView";
import { useState, useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { useData } from "~/lib/DataContext";
import { api } from "~/lib/api";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

export default function AdminSchedule() {

  const { appointments, refreshData } = useData();
  const [isMounted, setIsMounted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    refreshData(); // Refresh on mount
  }, []);

  const handleClearAll = async () => {
    try {
      setIsClearing(true);
      await api.appointments.clearAll();
      await refreshData();
      toast.success("All appointments cleared");
      setShowClearConfirm(false);
    } catch (error) {
      console.error("Failed to clear appointments:", error);
    } finally {
      setIsClearing(false);
    }
  };

  // Robust date parser
  const parseApptDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);
    // If it has a space (Y-m-d H:i:s), convert to ISO format (Y-m-dT... )
    if (dateStr.includes(' ')) {
      return new Date(dateStr.replace(' ', 'T'));
    }
    // If it's just Y-m-d, parse manually to avoid UTC shift
    if (dateStr.includes('-') && !dateStr.includes('T')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    return new Date(dateStr);
  };

  // Calculate stats
  let todayAppointmentsCount = 0;
  let pendingCount = 0;
  let urgentCount = 0;
  let nextAppointments: any[] = [];
  
  if (isMounted && appointments) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sortedAppts = [...appointments].sort((a, b) => {
      const dateA = parseApptDate(a.date_time || a.date);
      const dateB = parseApptDate(b.date_time || b.date);
      return dateA.getTime() - dateB.getTime();
    });

    sortedAppts.forEach((apt: any) => {
      const apptDate = parseApptDate(apt.date_time || apt.date);
      
      // Today's count
      if (
        apptDate.getDate() === today.getDate() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear()
      ) {
        todayAppointmentsCount++;
      }

      // Next 24 hours (from now)
      if (apptDate >= now && apptDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
        if (nextAppointments.length < 3) {
          nextAppointments.push(apt);
        }
      }

      // Pending/Urgent counts (assuming status or procedure flags)
      const status = apt.status?.toLowerCase() || "";
      const proc = apt.procedure?.toLowerCase() || "";
      
      if (status === "pending" || status === "waiting") {
        pendingCount++;
      }
      if (status === "urgent" || proc.includes("urgent") || proc.includes("emergency")) {
        urgentCount++;
      }
    });
  }

  const currentMonthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Appointment Schedule</h1>
          <p className="text-sm text-gray-500" suppressHydrationWarning>
            Managing clinical shifts and patient consultations for {isMounted ? currentMonthYear : "..."}
          </p>
        </div>

        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <DialogTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 font-bold text-sm transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[1.125rem]">delete_sweep</span>
            Clear All Appointments
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Are you absolutely sure?</DialogTitle>
              <DialogDescription className="text-gray-500 mt-2">
                This will permanently delete ALL appointments from the system. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 gap-3">
              <Button variant="outline" onClick={() => setShowClearConfirm(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button onClick={handleClearAll} disabled={isClearing} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                {isClearing ? "Clearing..." : "Yes, Clear Everything"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main Calendar View */}
        <div className="w-full">
          <CalendarView />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 flex flex-col">
          {/* Today's Focus Widget */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Today's Focus</h3>
              <Badge variant="outline" className="text-[0.6rem] font-bold text-emerald-600 bg-emerald-50 border-emerald-100 px-2 py-0.5 rounded-md tracking-wider">
                LIVE
              </Badge>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4" suppressHydrationWarning>
                <div className="w-12 h-12 rounded-full bg-[#E5EDFF] flex items-center justify-center text-xl font-bold text-[#0052CC]" suppressHydrationWarning>
                  {isMounted ? todayAppointmentsCount : '-'}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Appointments</div>
                  <div className="text-[0.65rem] text-gray-500 font-medium">Scheduled for today</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-xl font-bold text-purple-600" suppressHydrationWarning>
                  {isMounted ? pendingCount : '-'}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Pending Approval</div>
                  <div className="text-[0.65rem] text-gray-500 font-medium">Request from online portal</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-xl font-bold text-orange-500" suppressHydrationWarning>
                  {isMounted ? urgentCount : '-'}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Urgent Reviews</div>
                  <div className="text-[0.65rem] text-gray-500 font-medium">Requiring admin attention</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next 24 Hours Widget */}
          <div className="bg-[#F8F9FA] rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Next 24 Hours</h3>

            <div className="space-y-5">
              {!isMounted || nextAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-[0.7rem] font-medium italic">
                  No upcoming appointments found in the next 24 hours.
                </div>
              ) : (
                nextAppointments.map((apt, idx) => {
                  const date = parseApptDate(apt.date_time || apt.date);
                  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
                  const isUrgent = apt.status?.toLowerCase() === "urgent" || apt.procedure?.toLowerCase().includes("urgent");
                  
                  return (
                    <div key={apt.id} className="flex gap-4 relative">
                      <div className="w-10 text-right shrink-0 pt-0.5">
                        <div className="text-xs font-bold text-gray-500">{time}</div>
                      </div>
                      <div className={`absolute left-[3.25rem] top-2 bottom-[-1.25rem] w-0.5 ${isUrgent ? 'bg-rose-200' : 'bg-[#B3D4FF]'} rounded-full z-0`}></div>
                      <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100 relative z-10">
                        <div className="font-bold text-gray-900 text-sm">
                          {apt.patient?.first_name ? `${apt.patient.first_name} ${apt.patient.last_name}` : (apt.patient_name || "Patient")}
                        </div>
                        <div className="text-[0.7rem] text-gray-500 mb-2">{apt.procedure}</div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded ${isUrgent ? 'text-rose-600 bg-rose-50' : 'text-blue-600 bg-blue-50'}`}>
                            {isUrgent ? "Triage" : "Room " + (idx + 1) + "A"}
                          </span>
                          <span className="text-[0.65rem] text-gray-500 font-medium">
                            {apt.doctor?.name || apt.doctor_name || "Staff Member"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button className="w-full mt-6 py-2.5 text-xs font-bold text-[#0052CC] border-t border-gray-200 hover:text-blue-800 transition-colors">
              VIEW FULL AGENDA
            </button>
          </div>

          {/* Facility Map Widget */}
          <div className="rounded-2xl overflow-hidden relative shadow-md bg-slate-800 min-h-[140px] border border-slate-700">
            {/* Map lines background pattern (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 H 200 V 80 H 100 V 130 H 250 V 30 H 300 V 130 H 310" stroke="white" strokeWidth="1" fill="none" />
              <path d="M50 10 V 130 M 150 80 V 130 M 200 30 V 80" stroke="white" strokeWidth="1" fill="none" />
              <path d="M80 50 H 150 M 200 50 H 250" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="120" cy="40" r="2" fill="white" />
              <circle cx="220" cy="100" r="2" fill="white" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-bold text-sm">Facility Map</h4>
              <p className="text-white/70 text-[0.65rem]">South Campus - View Layout</p>
            </div>

            <button className="absolute bottom-4 right-4 w-8 h-8 bg-[#0052CC] hover:bg-blue-700 rounded-full text-white flex items-center justify-center shadow-lg transition-colors">
              <span className="material-symbols-outlined text-[1.25rem]">add</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

