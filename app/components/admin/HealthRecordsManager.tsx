import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import RecordForm from "./RecordForm";
import { toast } from "sonner";

interface HealthRecord {
  id: number;
  title: string;
  date: string;
  type: string;
  status: string;
  description?: string;
}

interface HealthRecordsManagerProps {
  patientId: number;
  onRefresh?: () => void;
}

export default function HealthRecordsManager({ patientId, onRefresh }: HealthRecordsManagerProps) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [patientId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.patients.healthRecords(patientId);
      const data = response.data.data || [];
      setRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch health records:", err);
      // If endpoint not available, try fallback
      try {
        const allRecords = await api.healthRecords.list();
        const patientRecords = (allRecords.data.data || []).filter((r: any) => r.patient_id === patientId);
        setRecords(patientRecords);
      } catch {
        setRecords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const lower = status.toLowerCase();
    if (lower === 'normal') return "bg-green-100 text-green-800";
    if (lower === 'reviewed') return "bg-blue-100 text-blue-800";
    if (lower === 'action needed') return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const getIcon = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'Lab Result': 'lab_research',
      'Review': 'description',
      'Imaging/Test': 'monitor_heart',
    };
    return typeMap[type] || 'description';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDelete = async (recordId: number) => {
    try {
      await api.healthRecords.delete(recordId);
      toast.success("Health record deleted successfully");
      setDeletingId(null);
      fetchRecords();
      onRefresh?.();
    } catch (err: any) {
      console.error("Failed to delete record:", err);
      toast.error("Failed to delete record");
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingRecord(null);
  };

  const handleFormSuccess = () => {
    fetchRecords();
    onRefresh?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Health Records</h3>
        <button
          onClick={() => {
            setEditingRecord(null);
            setFormOpen(true);
          }}
          className="px-4 py-2 bg-[#003B95] text-white rounded-lg text-sm font-semibold hover:bg-[#002D73] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Record
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#003B95]/10 mb-2">
            <span className="material-symbols-outlined text-[#003B95] animate-spin">autorenew</span>
          </div>
          <p className="text-gray-600 text-sm">Loading health records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <span className="material-symbols-outlined text-3xl text-gray-400 flex justify-center mb-2">folder_open</span>
          <p className="text-gray-600 font-medium">No health records</p>
          <p className="text-gray-500 text-sm">Click "Add Record" to create one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8EFFF] flex items-center justify-center text-[#003B95] flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">{getIcon(record.type)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{record.title}</h4>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>

                  <div className="flex gap-3 text-xs text-gray-600 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {formatDate(record.date)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">label</span>
                      {record.type}
                    </div>
                  </div>

                  {record.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{record.description}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRecord(record);
                        setFormOpen(true);
                      }}
                      className="text-xs font-semibold text-[#003B95] hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(record.id)}
                      className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {deletingId === record.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3">
                  <p className="text-sm text-red-800 font-medium">Are you sure you want to delete this record?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1 text-xs font-semibold text-red-800 border border-red-300 rounded hover:bg-red-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <RecordForm
        open={formOpen}
        onOpenChange={handleFormClose}
        patientId={patientId}
        record={editingRecord}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
