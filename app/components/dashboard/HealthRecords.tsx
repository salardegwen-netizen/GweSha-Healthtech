import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "~/lib/api";

interface HealthRecord {
  id: string;
  title: string;
  created_at: string;
  type: string;
}

export default function HealthRecords() {
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
      setRecords(data.slice(0, 2)); // Show first 2 records
    } catch (err) {
      console.error('Failed to fetch records:', err);
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="col-span-1 md:col-span-12 lg:col-span-5 bg-[var(--color-surface-container-high)] rounded-2xl p-6 relative animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-12 lg:col-span-5 bg-[var(--color-surface-container-high)] rounded-2xl p-6 relative">
      <Link to="/records" className="absolute inset-0 z-0"></Link>
      <div className="flex justify-between items-center mb-5 relative z-10 pointer-events-none">
        <h3 className="font-[var(--font-headline)] text-lg font-bold text-[var(--color-on-surface)]">Recent Records</h3>
        <span className="material-symbols-outlined text-[1.25rem] text-[var(--color-primary)] pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity">arrow_forward</span>
      </div>
      <div className="space-y-4 relative z-10 pointer-events-none">
        {records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="flex items-center gap-3 group bg-[var(--color-surface-container-lowest)] p-3 rounded-xl border border-transparent transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[1.125rem]">{getIcon(record.type)}</span>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-sm text-[var(--color-on-surface)]">{record.title}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Available since {formatDate(record.created_at)}</p>
              </div>
              <span className="material-symbols-outlined text-[1.125rem] text-[var(--color-outline-variant)] pointer-events-auto cursor-pointer hover:text-[var(--color-primary)]">download</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--color-on-surface-variant)]">No health records available</p>
        )}
      </div>
    </div>
  );
}
