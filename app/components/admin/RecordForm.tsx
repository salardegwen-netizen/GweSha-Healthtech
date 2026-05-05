import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/lib/api";
import { toast } from "sonner";

const RECORD_TYPES = ["Lab Result", "Review", "Imaging/Test"];
const RECORD_STATUSES = ["Normal", "Reviewed", "Action Needed"];

interface RecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  record?: any;
  onSuccess?: () => void;
}

export default function RecordForm({ open, onOpenChange, patientId, record, onSuccess }: RecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Lab Result",
    date: new Date().toISOString().split('T')[0],
    status: "Normal",
    description: "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title || "",
        type: record.type || "Lab Result",
        date: record.date || new Date().toISOString().split('T')[0],
        status: record.status || "Normal",
        description: record.description || "",
      });
    } else {
      setFormData({
        title: "",
        type: "Lab Result",
        date: new Date().toISOString().split('T')[0],
        status: "Normal",
        description: "",
      });
    }
  }, [record, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patient_id: patientId,
        title: formData.title,
        type: formData.type,
        date: formData.date,
        status: formData.status,
        description: formData.description,
      };

      if (record) {
        // Update existing record
        await api.healthRecords.update(record.id, payload);
        toast.success("Health record updated successfully");
      } else {
        // Create new record
        await api.healthRecords.create(payload);
        toast.success("Health record created successfully");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      console.error("Failed to save record:", err);
      const message = err.response?.data?.errors || err.response?.data?.message || "Failed to save record";
      toast.error(typeof message === 'string' ? message : JSON.stringify(message).substring(0, 200));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {record ? "Edit Health Record" : "Add Health Record"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
              Record Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Blood Test, X-Ray Results"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003B95] outline-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="text-sm font-semibold text-gray-700 mb-2 block">
                Record Type *
              </Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003B95] outline-none"
                disabled={loading}
              >
                {RECORD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="date" className="text-sm font-semibold text-gray-700 mb-2 block">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003B95] outline-none"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 block">
              Status *
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003B95] outline-none"
              disabled={loading}
            >
              {RECORD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Add any additional notes or details about this record..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003B95] outline-none resize-none"
              disabled={loading}
            />
          </div>

          <DialogFooter className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-[#003B95] text-white font-semibold hover:bg-[#002D73] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
              {record ? "Update Record" : "Create Record"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
