import { useNavigate, useOutletContext } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import PatientTable from "~/components/admin/PatientTable";
import type { Role } from "~/lib/role";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { api } from "~/lib/api";
import { useData } from "~/lib/DataContext";

type Appointment = {
  id?: string;
  time: string;
  patient: string;
  type: string;
  status: string;
  statusColor: string;
};

export default function AdminOverview() {
  const navigate = useNavigate();
  const { role } = useOutletContext<{ role: Role }>();
  const { patients, appointments, invoices } = useData();
  const [appointments4, setAppointments4] = useState<Appointment[]>([]);
  const [nextAppt, setNextAppt] = useState<any>(null);
  const [quickStats, setQuickStats] = useState({ checkedIn: 0, inProgress: 0, completed: 0 });
  const [chartData, setChartData] = useState([{ name: "Total Patients", value: 0, fill: "#00605A" }, { name: "Pending Invoices", value: 0, fill: "#ECAF20" }]);

  useEffect(() => {
    // Get first 4 appointments
    const first4 = (appointments || []).slice(0, 4).map((apt: any) => ({
      id: apt.id?.toString(),
      time: apt.date_time ? new Date(apt.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD",
      patient: apt.patient?.first_name ? `${apt.patient.first_name} ${apt.patient.last_name}` : apt.patient_name || "Patient",
      type: apt.procedure || "Appointment",
      status: apt.status || "Scheduled",
      statusColor: getStatusColor(apt.status),
    }));
    setAppointments4(first4);

    // Get next appointment
    if (appointments && appointments.length > 0) {
      const nextApptData = appointments[0];
      setNextAppt({
        patient: nextApptData.patient?.first_name ? `${nextApptData.patient.first_name} ${nextApptData.patient.last_name}` : nextApptData.patient_name,
        time: nextApptData.date_time ? new Date(nextApptData.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD",
        room: `Room ${(nextApptData.id % 10) + 1}`,
      });
    }

    // Calculate quick stats from appointments
    const checkedIn = (appointments || []).filter((a: any) => a.status?.toLowerCase() === 'checked in').length;
    const inProgress = (appointments || []).filter((a: any) => a.status?.toLowerCase() === 'in progress').length;
    const completed = (appointments || []).filter((a: any) => a.status?.toLowerCase() === 'completed').length;
    setQuickStats({ checkedIn, inProgress, completed });

    // Update chart data with real numbers
    const pendingInvoices = (invoices || []).filter((inv: any) => inv.status?.toLowerCase() === 'pending' || inv.status?.toLowerCase() === 'due').length;
    setChartData([
      { name: "Total Patients", value: patients?.length || 0, fill: "#00605A" },
      { name: "Pending Invoices", value: pendingInvoices, fill: "#ECAF20" },
    ]);
  }, [appointments, patients, invoices]);

  function getStatusColor(status: string): string {
    const lower = status?.toLowerCase() || '';
    if (lower === 'completed') return "text-[#1DB67B] bg-[#E8F8F2]";
    if (lower === 'confirmed' || lower === 'checked in') return "text-[#4B7CFF] bg-[#EDF3FF]";
    if (lower === 'pending') return "text-[#ECAF20] bg-[#FEF6E4]";
    return "text-gray-500 bg-gray-100";
  }

  // Admin sees the full overview
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <Card className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-sm font-[var(--font-headline)]">Key Metrics Overview</h3>
              <p className="text-xs text-gray-500 mt-1">Total Patients vs Pending Invoices</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "11px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.07)"
                  }}
                  formatter={(value) => [`${value}`, 'Count']}
                />
                <Bar dataKey="value" fill="#00605A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Patients</div>
                <div className="text-xl font-extrabold text-gray-900">{patients?.length || 0}</div>
                <div className="text-[0.7rem] text-[#1DB67B] font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[0.875rem]">trending_up</span> Live count
                </div>
              </div>
              <div>
                <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Invoices</div>
                <div className="text-xl font-extrabold text-gray-900">{chartData[1].value}</div>
                <div className="text-[0.7rem] text-[#F39C12] font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[0.875rem]">schedule</span> Action
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="bg-[#00605A] px-6 pb-6 pt-12 rounded-[2rem] shadow-sm border-transparent flex flex-col justify-end text-white relative overflow-hidden cursor-pointer hover:bg-[#004f4a] transition-colors" onClick={() => navigate("/admin/schedule")}>
            <CardContent className="relative z-10 p-0">
              <div className="text-[0.625rem] font-bold text-[#8CE3DE] uppercase tracking-widest mb-3">Next Appointment</div>
              <div className="text-2xl font-bold mb-1.5 leading-tight">{nextAppt?.patient || "No appointments"}</div>
              {nextAppt && <div className="text-sm text-[#B3EAE7]">{nextAppt.time} • {nextAppt.room}</div>}
              <div className="text-[0.625rem] text-[#8CE3DE] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[0.875rem]">arrow_forward</span> View Schedule
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Stats</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-xs text-gray-600">Checked In</div>
                <div className="text-lg font-bold text-gray-900">{quickStats.checkedIn}</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-xs text-gray-600">In Progress</div>
                <div className="text-lg font-bold text-gray-900">{quickStats.inProgress}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600">Completed</div>
                <div className="text-lg font-bold text-gray-900">{quickStats.completed}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-sm">Today's Schedule</h3>
          <button onClick={() => navigate("/admin/schedule")} className="text-[0.6875rem] text-[#008d84] font-bold hover:underline">View Calendar</button>
        </div>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-0">
          {appointments4.length === 0 ? (
            <div className="col-span-4 text-center py-4 text-gray-500 text-sm">No appointments scheduled</div>
          ) : (
            appointments4.map((appt, i) => (
              <div key={appt.id || i} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-[0.6875rem] font-bold text-gray-400 mb-2">{appt.time}</div>
                <div className="text-xs font-bold text-gray-900 mb-0.5">{appt.patient}</div>
                <div className="text-[0.625rem] text-gray-500 mb-2">{appt.type}</div>
                <Badge variant="secondary" className={`inline-flex px-3 py-0.5 rounded-full text-[0.5625rem] font-extrabold tracking-wider uppercase hover:bg-opacity-80 border-none ${appt.statusColor}`}>
                  {appt.status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <PatientTable />
    </>
  );
}
