import { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  Calendar,
  Star,
  Plus,
  CheckCircle,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useData } from '~/lib/DataContext';

export default function Overview() {
  const { patients, appointments, invoices, staff: staffData, loading } = useData();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // 1. Total Patients
  const totalPatientsCount = patients.length;

  // 2. Pending Invoices
  // Sum up all patient balances as "Pending Invoices" value
  const totalPendingBalance = patients.reduce((acc, p) => acc + parseFloat(p.balance || 0), 0);
  const pendingCount = patients.filter(p => parseFloat(p.balance || 0) > 0).length;

  // 3. Treatments Today
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const todayAppointments = appointments.filter(appt => {
    if (!appt.date_time) return false;
    // Handle both Y-m-d H:i:s and ISO format
    const apptDate = new Date(appt.date_time.replace(' ', 'T'));
    return apptDate >= todayStart && apptDate <= todayEnd;
  }).sort((a, b) => {
    return new Date(a.date_time.replace(' ', 'T')).getTime() - new Date(b.date_time.replace(' ', 'T')).getTime();
  });
  
  const treatmentsTodayCount = todayAppointments.length;

  // Dynamic Staff (real data from API)
  const displayStaff = staffData.slice(0, 3).map(s => ({
    id: s.id,
    name: s.name,
    role: s.role || 'Staff Member',
    avatar: `https://avatar.iran.liara.run/public/doctor?username=${s.id}`,
    status: s.status === 'active' ? 'On Duty' : 'On Break'
  }));

  // Dynamic Schedule (real data from today's appointments)
  const displaySchedule = todayAppointments.map(appt => {
    const apptDate = new Date(appt.date_time.replace(' ', 'T'));
    const time = apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const patientName = appt.patient?.name || (appt.patient?.first_name ? `${appt.patient.first_name} ${appt.patient.last_name}` : 'Unknown Patient');
    return {
      time,
      patient: patientName,
      service: appt.procedure || 'General Checkup',
      initials: patientName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      status: appt.status || 'Pending'
    };
  });

  // Next Appointment for Hero Card (Next upcoming appointment starting FROM NOW)
  const nextAppt = todayAppointments.find(appt => new Date(appt.date_time.replace(' ', 'T')) >= now);
  const nextApptPatientName = nextAppt?.patient?.name || (nextAppt?.patient?.first_name ? `${nextAppt.patient.first_name} ${nextAppt.patient.last_name}` : 'No upcoming appt');

  return (
    <div className="space-y-8 p-8 bg-slate-50 min-h-full font-sans">
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Patients" 
          value={totalPatientsCount.toLocaleString()} 
          trend="+12%" 
          color="blue" 
        />
        <StatCard 
          icon={Wallet} 
          label="Pending Invoices" 
          value={`₱${totalPendingBalance.toLocaleString()}`} 
          badge={`${pendingCount} Pending`} 
          color="orange" 
        />
        <StatCard 
          icon={Calendar} 
          label="Treatments Today" 
          value={treatmentsTodayCount.toString()} 
          color="purple" 
        />
        <StatCard 
          icon={Star} 
          label="Patient Satisfaction" 
          value="98.2%" 
          subtext="4.9 Avg" 
          color="blue" 
        />
      </div>

      {/* 2. Main content two-column grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column (Span 2) */}
        <div className="col-span-2 space-y-8">
          {/* Hero "Next Up" Card */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden flex justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-700 text-[10px] px-2 py-1 rounded font-bold uppercase">NEXT UP</span>
                <span className="text-sm opacity-80">• Starts soon</span>
              </div>
              <h2 className="text-3xl font-bold mb-1">{nextApptPatientName}</h2>
              <p className="text-blue-200 text-sm mb-6">{nextAppt?.procedure || 'No appointments scheduled'}</p>
              <div className="flex gap-3">
                <button className="bg-white text-blue-900 px-6 py-2 rounded-lg font-bold text-sm">Check-in Patient</button>
                <button className="border border-blue-400 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors">View Records</button>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-800 opacity-20 transform skew-x-12 translate-x-10" />
            <div className="relative z-10 w-40 h-40 bg-gray-200/10 rounded-lg flex items-center justify-center text-xs text-white/50">Monitor view</div>
          </div>

          {/* Today's Schedule Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Today's Schedule</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"><ChevronLeft size={18} /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] uppercase text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {displaySchedule.length > 0 ? displaySchedule.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-600">{row.time}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">{row.initials}</div>
                      <span className="font-bold text-gray-700">{row.patient}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{row.service}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-400"><MoreHorizontal size={18} /></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No treatments scheduled for today.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-4 text-center border-t border-gray-50">
              <button className="text-blue-600 text-xs font-bold hover:underline">View Full Schedule</button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 uppercase text-xs tracking-widest">Quick Stats</h3>
            <div className="space-y-6">
              <QuickStatRow label="Revenue Growth" value="+24%" subtext="Past 30 days" />
              <QuickStatRow label="No-Show Rate" value="3.4%" subtext="Total appointments" />
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-blue-600 text-[10px] font-bold uppercase mb-2">AI Insights</p>
                <p className="text-blue-800 text-xs leading-relaxed font-medium">Staffing levels are optimal for tomorrow's 15% increase in appointments.</p>
              </div>
            </div>
          </div>

          {/* Staff On-Duty */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 uppercase text-xs tracking-widest">Staff On-Duty</h3>
            <div className="space-y-5">
              {displayStaff.map(member => (
                <div key={member.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} className="w-10 h-10 rounded-full" />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.status === 'On Duty' ? 'bg-green-500' : 'bg-orange-400'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">{member.name}</p>
                      <p className="text-gray-400 text-xs">{member.role}</p>
                    </div>
                  </div>
                  <MoreHorizontal size={16} className="text-gray-300" />
                </div>
              ))}
              <button className="w-full text-center border-t border-gray-100 pt-4 text-blue-600 text-xs font-bold hover:underline">View All Staff</button>
            </div>
          </div>

          {/* Urgent Alert */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertTriangle size={18} />
              <span className="font-bold text-sm">Urgent Lab Review</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">3 critical lab results require immediate physician review for Patient #9822.</p>
            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-colors">Review Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  badge?: string;
  subtext?: string;
  color: 'blue' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend, badge, subtext, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colors[color]} bg-opacity-60`}>
          <Icon size={20} />
        </div>
        {trend && <span className="text-green-500 text-xs font-bold px-2 py-0.5 rounded-full bg-green-50">{trend}</span>}
        {badge && <span className="text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50">{badge}</span>}
      </div>
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
      {subtext && <p className="text-gray-400 text-xs mt-1">{subtext}</p>}
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    'Checked In': 'bg-green-50 text-green-600 border-green-100',
    'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Scheduled': 'bg-blue-50 text-blue-600 border-blue-100',
    'In Progress': 'bg-purple-50 text-purple-600 border-purple-100',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  const currentStyle = styles[status] || 'bg-gray-50 text-gray-600 border-gray-100';

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${currentStyle}`}>
      {status}
    </span>
  );
};

interface QuickStatRowProps {
  label: string;
  value: string;
  subtext: string;
}

const QuickStatRow: React.FC<QuickStatRowProps> = ({ label, value, subtext }) => (
  <div className="flex justify-between items-center gap-4">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-10 bg-blue-900 rounded-full" />
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-400 tracking-tight">{subtext}</p>
      </div>
    </div>
    <span className="text-xl font-bold text-gray-800">{value}</span>
  </div>
);