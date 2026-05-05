import type { Route } from "./+types/records";
import PatientLayout from "~/components/patient/PatientLayout";
import { useData } from "~/lib/DataContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Health Records | GweSha HealthTech" },
  ];
}

export default function Records() {
  const { healthRecords } = useData();

  const getRecordIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'lab result': return { icon: 'water_drop', bg: 'bg-red-50 text-red-600' };
      case 'specialist report': return { icon: 'monitor_heart', bg: 'bg-orange-50 text-orange-600' };
      case 'imaging diagnostics': return { icon: 'broken_image', bg: 'bg-purple-50 text-purple-600' };
      case 'prescription': return { icon: 'medication', bg: 'bg-green-50 text-green-600' };
      default: return { icon: 'health_and_safety', bg: 'bg-[#E5EDFF] text-[#003B95]' };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { month: 'N/A', day: '', year: '' };
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  const pendingCount = healthRecords?.filter((r: any) => r.status?.toLowerCase() !== 'finalized').length || 0;
  const lastSynced = healthRecords && healthRecords.length > 0 
    ? new Date(Math.max(...healthRecords.map((r: any) => new Date(r.updated_at).getTime()))).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : "N/A";

  return (
    <PatientLayout>
      <div className="max-w-[1200px] mx-auto animate-fade-in flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-[1.75rem] font-bold text-[#111827] mb-1">Health Records</h1>
            <p className="text-gray-500 text-sm">Access and manage your complete medical history and diagnostic reports.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[1.1rem]">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined text-[1.1rem]">sort</span>
              Latest First
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#E5EDFF] text-[#003B95] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">folder</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Records</p>
            <p className="text-2xl font-bold text-[#111827]">{healthRecords?.length || 0} Items</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">assignment_late</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-[#111827]">{pendingCount} Items</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003B95] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Last Synced</p>
            <p className="text-2xl font-bold text-[#111827]">{lastSynced === 'N/A' ? 'N/A' : `Today, ${lastSynced}`}</p>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-[0.65rem] font-bold uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Record Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Summary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {healthRecords && healthRecords.length > 0 ? (
                healthRecords.map((record: any) => {
                  const { icon, bg } = getRecordIcon(record.type);
                  const { month, day, year } = formatDate(record.date || record.created_at);
                  const isFinalized = record.status?.toLowerCase() === 'finalized';

                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined">{icon}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{record.title || record.type}</p>
                            <p className="text-xs text-gray-400">{record.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium text-sm">{month} {day},</p>
                        <p className="text-gray-500 text-sm">{year}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500 w-1/3 truncate max-w-[200px]">
                        {record.description}
                      </td>
                      <td className="px-6 py-4">
                        {isFinalized ? (
                          <span className="px-2.5 py-1 rounded bg-[#E5EDFF] text-[#003B95] text-[0.65rem] font-bold uppercase tracking-wider">{record.status}</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-yellow-50 text-yellow-600 text-[0.65rem] font-bold uppercase tracking-wider">{record.status || 'Pending'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <button className="text-[#003B95] font-bold text-xs hover:underline">View Details</button>
                          <button className="text-gray-400 hover:text-[#003B95]"><span className="material-symbols-outlined text-[1.1rem]">download</span></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No health records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 bg-gray-50/30">
            <span>Showing {healthRecords?.length || 0} of {healthRecords?.length || 0} records</span>
            <div className="flex gap-2">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50"><span className="material-symbols-outlined text-[1rem]">chevron_left</span></button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50"><span className="material-symbols-outlined text-[1rem]">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
          {/* Imaging Portal */}
          <div className="bg-[#0f172a] rounded-2xl p-8 relative overflow-hidden text-white flex flex-col justify-center min-h-[180px]">
            <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-2xl font-bold mb-2 relative z-10">Digital Imaging Portal</h3>
            <p className="text-white/70 text-sm mb-6 max-w-[280px] relative z-10">Access high-resolution DICOM files for MRI, CT Scans, and X-Rays directly in your browser.</p>
            <button className="bg-white text-[#0f172a] px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm self-start hover:bg-gray-100 transition-colors relative z-10">
              Launch Viewer
            </button>
            <span className="material-symbols-outlined absolute right-6 bottom-6 text-[8rem] text-white/5 pointer-events-none rotate-12">radiology</span>
          </div>

          {/* Privacy Banner */}
          <div className="bg-[#1A56DB] rounded-2xl p-8 relative overflow-hidden text-white flex flex-col justify-center min-h-[180px]">
            <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-wider uppercase mb-3 relative z-10">
              <span className="material-symbols-outlined text-[1rem]">security</span> Privacy First
            </div>
            <h3 className="text-2xl font-bold leading-tight mb-6 max-w-[300px] relative z-10">Your data is encrypted & HIPAA Compliant.</h3>
            <div className="flex items-center gap-3 relative z-10">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-8 h-8 rounded-full border-2 border-[#1A56DB]" alt="doc"/>
                <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-8 h-8 rounded-full border-2 border-[#1A56DB]" alt="doc"/>
              </div>
              <span className="text-xs text-white/80 font-medium">Verified by your healthcare team</span>
            </div>
            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-[8rem] text-white/10 pointer-events-none">shield</span>
          </div>
        </div>

      </div>
    </PatientLayout>
  );
}
