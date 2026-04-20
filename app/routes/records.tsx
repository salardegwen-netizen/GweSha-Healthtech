import type { Route } from "./+types/records";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import DashboardNav from "~/components/dashboard/DashboardNav";
import Footer from "~/components/Footer";
import { api } from "~/lib/api";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Health Records - Sanctuary Health" },
    { name: "description", content: "Detailed Health Records" },
  ];
}

interface HealthRecord {
  id: number;
  title: string;
  description: string;
  type: string;
  created_at: string;
  status?: string;
}

export default function Records() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.healthRecords.list();
      const data = response.data.data || [];
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch health records:", err);
      toast.error("Failed to load health records");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'Lab Result': 'lab_research',
      'Review': 'description',
      'Imaging/Test': 'monitor_heart',
      'default': 'description'
    };
    return typeMap[type] || typeMap['default'];
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const lower = status.toLowerCase();
    if (lower === 'normal') return "bg-green-100 text-green-800";
    if (lower === 'reviewed') return "bg-blue-100 text-blue-800";
    if (lower === 'action needed') return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-[#F8F7F4] min-h-screen flex flex-col font-['Inter']">
        <DashboardNav />
        <main className="flex-grow pt-32 pb-20 px-6 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00605A]/10 mb-4">
              <span className="material-symbols-outlined text-[#00605A]">autorenew</span>
            </div>
            <p className="text-gray-600">Loading health records...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F7F4] min-h-screen flex flex-col font-['Inter']">
      <DashboardNav />

      <main className="flex-grow pt-32 pb-20 px-6 w-full">

        {/* Header Section */}
        <section className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-left">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-colors border border-gray-200">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight font-[var(--font-headline)] text-[var(--color-primary)] text-left">
                Health Records
              </h1>
            </div>
            <p className="text-sm text-gray-600 pl-11 max-w-lg text-left">
              Review your complete medical history, lab results, and wellness summaries.
            </p>
          </div>

          <button className="px-5 py-2.5 rounded-full bg-white text-sm font-bold text-[var(--color-primary)] border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[1.125rem]">download</span>
            Download Full Archive
          </button>
        </section>

        {/* Detailed Records List */}
        <div className="flex flex-col gap-5">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#00605A] mb-3">
                <span className="material-symbols-outlined text-5xl opacity-50">folder_open</span>
              </div>
              <p className="text-gray-600 font-medium">No health records available</p>
              <p className="text-sm text-gray-500 mt-1">Your records will appear here as they are added</p>
            </div>
          ) : (
            records.map(record => (
              <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start hover:border-gray-200 transition-colors">

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#EAF8F8] flex items-center justify-center text-[#00605A] shrink-0">
                  <span className="material-symbols-outlined text-2xl">{getIcon(record.type)}</span>
                </div>

                {/* Main Content */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{record.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <span className="material-symbols-outlined text-[1rem]">calendar_today</span>
                        {formatDate(record.created_at)}
                        {record.type && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="material-symbols-outlined text-[1rem]">description</span>
                            {record.type}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.type && (
                        <span className="text-[0.625rem] font-bold tracking-widest text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded-md">{record.type}</span>
                      )}
                      {record.status && (
                        <span className={`text-[0.6875rem] font-bold px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {record.description}
                  </p>

                  <div className="flex gap-3">
                    <button className="text-xs font-bold text-[#00605A] hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      View Details
                    </button>
                    <button className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                      Download PDF
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
