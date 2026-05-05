import type { Route } from "./+types/admin";
import { useLocation } from "react-router";
import AdminSidebar from "~/components/admin/AdminSidebar";
import AdminHeader from "~/components/admin/AdminHeader";
import PatientTable from "~/components/admin/PatientTable";
import ScheduleView from "~/components/admin/ScheduleView";
import BillingConsole from "~/components/admin/BillingConsole";
import StaffRoster from "~/components/admin/StaffRoster";
import PlatformSettings from "~/components/admin/PlatformSettings";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Toaster } from "~/components/ui/sonner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin Console - GweSha HealthTech" },
    { name: "description", content: "Clinic administration dashboard" },
  ];
}

const APPOINTMENTS = [
  { time: "09:00 AM", patient: "Marcus Holloway", type: "Follow-up", status: "Completed", statusColor: "text-[#1DB67B] bg-[#E8F8F2]" },
  { time: "10:30 AM", patient: "Eleanor Sterling", type: "Wellness Check", status: "Checked In", statusColor: "text-[#4B7CFF] bg-[#EDF3FF]" },
  { time: "01:15 PM", patient: "Sylvia Chen", type: "Consultation", status: "Confirmed", statusColor: "text-gray-500 bg-gray-100" },
  { time: "03:00 PM", patient: "David Ross", type: "Lab Results", status: "Pending", statusColor: "text-[#ECAF20] bg-[#FEF6E4]" }
];

export default function AdminDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab");

  const renderContent = () => {
    switch (currentTab) {
      case "patients":
        return (
          <div className="mt-8 relative">
            <Badge className="absolute -top-3 left-6 z-10 bg-[#003B95] text-white hover:bg-[#003B95] border-none px-4 shadow-md font-bold uppercase tracking-wider text-[0.6875rem]">Master Directory</Badge>
            <PatientTable />
          </div>
        );
      case "schedule":
        return <ScheduleView />;
      case "billing":
        return <BillingConsole />;
      case "staff":
        return <StaffRoster />;
      case "settings":
        return <PlatformSettings />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              {/* Daily Stats */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card className="bg-white px-6 pb-6 pt-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-end min-h-[380px]">
                  <CardContent className="p-0">
                    <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-3">Total Patients Today</div>
                    <div className="text-4xl font-extrabold text-gray-900 mb-4">24</div>
                    <div className="text-[0.75rem] text-[#1DB67B] font-bold flex items-center gap-1.5 ">
                      <span className="material-symbols-outlined text-[1.125rem]">trending_up</span> +12% from yesterday
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white px-6 pb-6 pt-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-end min-h-[380px]">
                  <CardContent className="p-0">
                    <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-3">Pending Invoices</div>
                    <div className="text-4xl font-extrabold text-gray-900 mb-4">7</div>
                    <div className="text-[0.75rem] text-[#F39C12] font-bold flex items-center gap-1.5 ">
                      <span className="material-symbols-outlined text-[1.125rem] stroke-2">schedule</span> Action required
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#003B95] px-6 pb-6 pt-12 rounded-[2rem] shadow-sm border-transparent flex flex-col justify-end text-white relative overflow-hidden min-h-[380px]">
                  <CardContent className="relative z-10 p-0">
                    <div className="text-[0.625rem] font-bold text-[#8CE3DE] uppercase tracking-widest mb-3">Next Appointment</div>
                    <div className="text-2xl font-bold mb-1.5 leading-tight">Eleanor Sterling</div>
                    <div className="text-sm text-[#B3EAE7]">10:30 AM • Room 2</div>
                  </CardContent>
                </Card>
              </div>

              {/* Schedule Widget */}
              <Card className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[380px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-sm">Today's Schedule</h3>
                  <button className="text-[0.6875rem] text-[#008d84] font-bold hover:underline">View Calendar</button>
                </div>
                <CardContent className="space-y-6 p-0">
                  {APPOINTMENTS.map((appt, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="text-[0.6875rem] font-bold text-gray-400 w-16 pt-0.5 shrink-0">{appt.time}</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-900 mb-0.5">{appt.patient}</div>
                        <div className="text-[0.625rem] text-gray-500 mb-2">{appt.type}</div>
                        <Badge variant="secondary" className={`inline-flex px-3 py-0.5 rounded-full text-[0.5625rem] font-extrabold tracking-wider uppercase hover:bg-opacity-80 border-none ${appt.statusColor}`}>
                          {appt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Patients Table component */}
            <PatientTable />
          </>
        );
    }
  };

  return (
    <div className="bg-[#F8F7F4] min-h-screen font-['Inter'] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader role="admin" />

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">

            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-[1.375rem] font-extrabold tracking-tight font-[var(--font-headline)] text-[#003B95] mb-1">
                  Good Morning, Dr. Cole
                </h1>
                <p className="text-[0.8125rem] text-gray-500">Here's what is happening at GweSha HealthTech today.</p>
              </div>
              <Badge variant="outline" className="text-[0.75rem] font-bold text-gray-600 bg-white px-5 py-2.5 border border-gray-200 rounded-full shadow-sm flex items-center h-fit hover:bg-white flex-shrink-0">
                Thursday, October 24, 2026
              </Badge>
            </div>

            {renderContent()}

          </div>
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
