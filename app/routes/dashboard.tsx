import type { Route } from "./+types/dashboard";
import PatientLayout from "~/components/patient/PatientLayout";
import { useData } from "~/lib/DataContext";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard | GweSha HealthTech" },
  ];
}

export default function Dashboard() {
  const { appointments } = useData();
  const nextAppointment = appointments && appointments.length > 0 
    ? appointments[appointments.length - 1] // Or some logic to get the future appointment
    : null;

  const getFormatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const getFormatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PatientLayout>
      <div className="max-w-[1200px] mx-auto animate-fade-in">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[2rem] font-extrabold tracking-tight text-[#111827] mb-1">Welcome back, Gwen.</h1>
            <p className="text-gray-500 text-[0.95rem]">Everything is looking good with your recovery plan.</p>
          </div>
          <div className="bg-[#E5EDFF] text-[#003B95] px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#003B95] animate-pulse"></span>
            Live Syncing
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Next Appointment Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[340px]">
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="bg-[#E5EDFF] text-[#003B95] text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Next Appointment</span>
                  {nextAppointment ? (
                    <>
                      <h2 className="text-[1.75rem] font-bold text-[#111827] leading-tight mb-2">{nextAppointment.procedure}</h2>
                      <p className="text-gray-500 text-sm font-medium mb-6">With {nextAppointment.doctor?.name || 'Assigned Doctor'} • {nextAppointment.status}</p>

                      <div className="flex gap-8 mb-8">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#003B95]">
                            <span className="material-symbols-outlined">calendar_today</span>
                          </div>
                          <div>
                            <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-sm font-bold text-[#111827]">{getFormatDate(nextAppointment.date_time)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E5EDFF] flex items-center justify-center text-[#003B95]">
                            <span className="material-symbols-outlined">schedule</span>
                          </div>
                          <div>
                            <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">Time</p>
                            <p className="text-sm font-bold text-[#111827]">{getFormatTime(nextAppointment.date_time)} ({nextAppointment.length} min)</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-[1.75rem] font-bold text-[#111827] leading-tight mb-2">No Upcoming<br />Appointments</h2>
                      <p className="text-gray-500 text-sm font-medium mb-6">You have no scheduled appointments at the moment.</p>
                      <div className="flex gap-8 mb-8 h-10"></div>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button className="bg-[#003B95] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#002D7A] transition-colors">

                  </button>
                  <button className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">

                  </button>
                </div>
              </div>

              <div className="w-full md:w-[280px] bg-gray-100 relative h-64 md:h-full">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop" alt="Clinic Room" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white font-medium text-sm">
                  <span className="material-symbols-outlined text-[1.25rem]">location_on</span>
                  <span>South Clinic,<br />Room 402</span>
                </div>
              </div>
            </div>

            {/* Recent Records Table */}
            <div>
              <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="text-xl font-bold text-[#111827]">Recent Records</h3>
                <button className="text-[#003B95] text-sm font-bold hover:underline">View All</button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Document</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#E5EDFF] text-[#003B95] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[1.25rem]">science</span>
                        </div>
                        <span className="font-semibold text-gray-900">Annual Blood Panel</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Oct 05, 2023</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded bg-green-50 text-green-700 text-[0.65rem] font-bold uppercase">Lab Result</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-[#003B95]"><span className="material-symbols-outlined">download</span></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[1.25rem]">medical_information</span>
                        </div>
                        <span className="font-semibold text-gray-900">Shoulder MRI Scan</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Sep 28, 2023</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-700 text-[0.65rem] font-bold uppercase">Imaging</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-[#003B95]"><span className="material-symbols-outlined">download</span></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#E5EDFF] text-[#003B95] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[1.25rem]">medication</span>
                        </div>
                        <span className="font-semibold text-gray-900">Prescription Renewal</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Sep 15, 2023</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[0.65rem] font-bold uppercase">Pharmacy</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-[#003B95]"><span className="material-symbols-outlined">download</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">

            {/* Stats Cards */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                  <span className="material-symbols-outlined text-[1.25rem]">favorite</span>
                  Resting Heart Rate
                </div>
                <div className="text-rose-500 text-xs font-bold flex items-center">
                  <span className="material-symbols-outlined text-[1rem]">trending_down</span> 2%
                </div>
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-[2.5rem] font-bold text-[#111827] leading-none">64</span>
                <span className="text-gray-400 font-bold text-sm mb-1">BPM</span>
              </div>
              <div className="flex items-end gap-1.5 h-12">
                {[40, 50, 80, 45, 75, 40].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i === 2 || i === 4 ? 'bg-[#003B95]' : 'bg-[#E5EDFF]'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-[#003B95] font-bold text-sm">
                  <span className="material-symbols-outlined text-[1.25rem]">dark_mode</span>
                  Sleep Quality
                </div>
                <div className="text-[#003B95] text-xs font-bold">Great</div>
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-[2.5rem] font-bold text-[#111827] leading-none">8.5</span>
                <span className="text-gray-400 font-bold text-sm mb-1">Hours</span>
              </div>
              <div className="w-full bg-[#E5EDFF] h-2 rounded-full mb-3">
                <div className="bg-[#003B95] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[0.65rem] text-gray-500 font-medium">15% more than last week average</p>
            </div>

            {/* Billing Summary */}
            <div>
              <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="text-xl font-bold text-[#111827]">Billing Summary</h3>
                <button className="text-gray-400 hover:text-gray-700"><span className="material-symbols-outlined">credit_card</span></button>
              </div>
              <div className="bg-[#003B95] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <p className="text-white/80 text-xs font-bold mb-1 uppercase tracking-wider">Current Balance Due</p>
                <h2 className="text-[2.5rem] font-bold mb-8">₱142.50</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Recent Copay</span>
                    <span className="font-bold">₱2,500</span>
                  </div>
                  <div className="w-full h-px bg-white/20"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Last Statement</span>
                    <span className="font-bold">Oct 01</span>
                  </div>
                </div>

                <button className="w-full bg-white text-[#003B95] font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Pay Outstanding Balance
                </button>
              </div>
            </div>

            {/* Small Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-[#003B95] hover:text-[#003B95] transition-colors shadow-sm font-bold text-sm text-gray-700">
                <span className="material-symbols-outlined text-[1.25rem]">receipt_long</span>
                Statements
              </button>
              <button className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-[#003B95] hover:text-[#003B95] transition-colors shadow-sm font-bold text-sm text-gray-700">
                <span className="material-symbols-outlined text-[1.25rem]">shield</span>
                Insurance
              </button>
            </div>

          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
