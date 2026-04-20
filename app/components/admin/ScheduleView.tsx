import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/lib/api";
import { useData } from "~/lib/DataContext";

type ScheduleItem = {
  id?: string;
  time: string;
  patient: string;
  procedure: string;
  length: string;
  doctor: string;
  status: string;
  statusColor: string;
  day: "Today" | "Tomorrow" | "Week";
  date?: string;
};

const STATUS_OPTIONS = [
  { label: "Scheduled",   color: "bg-gray-100 text-gray-800" },
  { label: "Confirmed",   color: "bg-green-100 text-green-800" },
  { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { label: "Waiting",     color: "bg-amber-100 text-amber-800" },
  { label: "Completed",   color: "bg-[#1DB67B]/10 text-[#1DB67B]" },
  { label: "Cancelled",   color: "bg-red-100 text-red-700" },
];

function getStatusColor(status: string): string {
  const opt = STATUS_OPTIONS.find(o => o.label === status);
  return opt?.color || "bg-gray-100 text-gray-800";
}

function getDayLabel(dateStr: string): "Today" | "Tomorrow" | "Week" {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return "Week";
}

export default function ScheduleView() {
  const [activeFilter, setActiveFilter] = useState<"Today" | "Tomorrow" | "Week">("Today");
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [editItem, setEditItem] = useState<ScheduleItem | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ time: "", patient: "", procedure: "", doctor: "" });
  const { appointments: rawAppointments, loading } = useData();

  // Transform appointment data to schedule items
  useEffect(() => {
    const appointments = (rawAppointments || []).map((apt: any) => ({
      id: apt.id?.toString(),
      time: apt.date_time ? new Date(apt.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "00:00",
      patient: apt.patient?.first_name ? `${apt.patient.first_name} ${apt.patient.last_name}` : apt.patient_name || "Unknown Patient",
      procedure: apt.procedure || apt.type || "Appointment",
      length: "30m",
      doctor: apt.doctor?.name || apt.doctor_name || "Not Assigned",
      status: apt.status || "Scheduled",
      statusColor: getStatusColor(apt.status || "Scheduled"),
      day: getDayLabel(apt.date_time || apt.date),
      date: apt.date_time || apt.date,
    }));
    setScheduleList(appointments);
  }, [rawAppointments]);

  const filteredList = scheduleList.filter(item => item.day === activeFilter);

  const handleAddBlock = async () => {
    if (!form.time || !form.patient || !form.procedure || !form.doctor) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setProcessing(true);
      const { data } = await api.appointments.create({
        date: new Date().toISOString().split('T')[0],
        time: form.time,
        patient_name: form.patient,
        procedure: form.procedure,
        doctor_name: form.doctor,
        status: "Scheduled",
      });

      const newBlock: ScheduleItem = {
        id: data.data.id?.toString(),
        time: form.time,
        patient: form.patient,
        procedure: form.procedure,
        length: "30m",
        doctor: form.doctor,
        status: "Scheduled",
        statusColor: "bg-gray-100 text-gray-800",
        day: activeFilter,
      };
      setScheduleList([...scheduleList, newBlock]);
      setIsAddOpen(false);
      setForm({ time: "", patient: "", procedure: "", doctor: "" });
      toast.success(`Schedule block added for ${form.patient} under ${activeFilter}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add appointment');
    } finally {
      setProcessing(false);
    }
  };

  const openEdit = (item: ScheduleItem, idx: number) => {
    setEditItem({ ...item });
    setEditIndex(idx);
  };

  const handleSaveEdit = async () => {
    if (!editItem || editIndex === null) return;
    try {
      setProcessing(true);
      if (editItem.id) {
        await api.appointments.update(editItem.id, {
          time: editItem.time,
          status: editItem.status,
        });
      }
      const globalIdx = scheduleList.findIndex(
        (s, i) => filteredList[editIndex] === s
      );
      const updated = [...scheduleList];
      updated[globalIdx] = editItem;
      setScheduleList(updated);
      setEditItem(null);
      setEditIndex(null);
      toast.success(`Appointment for ${editItem.patient} updated.`);
    } catch (err) {
      toast.error('Failed to update appointment');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!editItem || !editItem.id) return;
    if (!confirm(`Delete appointment for ${editItem.patient}?`)) return;

    try {
      setProcessing(true);
      await api.appointments.delete(editItem.id);
      const updated = scheduleList.filter(s => s.id !== editItem.id);
      setScheduleList(updated);
      setEditItem(null);
      setEditIndex(null);
      toast.success(`Appointment deleted successfully.`);
    } catch (err) {
      toast.error('Failed to delete appointment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 relative mb-12">
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading schedule...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8 relative mb-12">
      <Badge className="absolute -top-3 left-6 z-10 bg-[#00605A] text-white hover:bg-[#00605A] border-none px-4 shadow-md font-bold uppercase tracking-wider text-[0.6875rem]">Clinical Schedule</Badge>
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-4 items-center">
            <h3 className="font-bold text-gray-900 text-sm font-[var(--font-headline)]">Daily Appointments</h3>
            <div className="flex bg-white rounded-lg p-0.5 border border-gray-200">
              {(["Today", "Tomorrow", "Week"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeFilter === f ? "text-white bg-[#00605A] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-[0.6875rem] text-gray-400 font-medium">{filteredList.length} appointments</span>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger className="h-auto py-1 px-3 text-xs font-bold text-[#00605A] flex items-center gap-1 hover:bg-gray-100/50 rounded-lg transition-colors disabled:opacity-60" disabled={processing}>
              <span className="material-symbols-outlined text-[1.125rem]">add</span> New Block
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
              <DialogHeader>
                <DialogTitle className="font-[var(--font-headline)] text-xl text-[#00605A] font-extrabold">Schedule Appointment</DialogTitle>
                <DialogDescription className="text-sm">Adding to <strong>{activeFilter}</strong>'s schedule.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-time" className="text-xs font-bold uppercase tracking-wider text-gray-500">Block Time</Label>
                  <Input id="add-time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="e.g. 04:30 PM" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-patient" className="text-xs font-bold uppercase tracking-wider text-gray-500">Patient Name</Label>
                  <Input id="add-patient" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} placeholder="e.g. John Doe" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-procedure" className="text-xs font-bold uppercase tracking-wider text-gray-500">Procedure / Reason</Label>
                  <Input id="add-procedure" value={form.procedure} onChange={e => setForm({...form, procedure: e.target.value})} placeholder="e.g. Annual Checkup" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-doctor" className="text-xs font-bold uppercase tracking-wider text-gray-500">Attending Doctor</Label>
                  <Input id="add-doctor" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} placeholder="e.g. Dr. Cole" className="rounded-lg" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>Cancel</Button>
                <Button onClick={handleAddBlock} className="bg-[#00605A] hover:bg-[#004f4a] rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>{processing ? 'Saving...' : 'Save Schedule'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <CardContent className="p-0">
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="material-symbols-outlined text-5xl mb-3">calendar_month</span>
              <p className="text-sm font-bold">No appointments for {activeFilter}</p>
              <p className="text-xs mt-1">Click "New Block" to schedule one.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredList.map((item, idx) => (
                <div key={item.id || idx} className="flex border-l-4 border-transparent hover:border-[#00605A] hover:bg-gray-50/50 transition-all p-5">
                  <div className="w-24 shrink-0 pr-4 border-r border-gray-100 flex flex-col justify-center text-right">
                    <div className="text-sm font-bold text-gray-900">{item.time}</div>
                    <div className="text-[0.6875rem] text-gray-400 font-medium">{item.length}</div>
                  </div>
                  <div className="flex-1 pl-6 flex flex-col justify-center">
                    <div className="font-bold text-gray-900 text-sm mb-1">{item.patient}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[0.875rem]">stethoscope</span> {item.procedure}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[0.875rem]">person</span> {item.doctor}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`border-none ${item.statusColor} font-bold tracking-wider uppercase text-[0.625rem]`}>
                      {item.status}
                    </Badge>
                    <Button
                      onClick={() => openEdit(item, idx)}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full text-gray-400 hover:text-[#00605A]"
                      disabled={processing}
                    >
                      <span className="material-symbols-outlined text-[1.25rem]">edit</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Appointment Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-[var(--font-headline)] text-xl text-[#00605A] font-extrabold">Edit Appointment</DialogTitle>
            <DialogDescription className="text-sm">Update the appointment details below.</DialogDescription>
          </DialogHeader>
          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Block Time</Label>
                <Input value={editItem.time} onChange={e => setEditItem({...editItem, time: e.target.value})} className="rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Patient Name</Label>
                <Input value={editItem.patient} onChange={e => setEditItem({...editItem, patient: e.target.value})} className="rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Procedure</Label>
                <Input value={editItem.procedure} onChange={e => setEditItem({...editItem, procedure: e.target.value})} className="rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Attending Doctor</Label>
                <Input value={editItem.doctor} onChange={e => setEditItem({...editItem, doctor: e.target.value})} className="rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</Label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setEditItem({...editItem, status: opt.label, statusColor: opt.color})}
                      className={`px-3 py-1 rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider border-2 transition-all ${editItem.status === opt.label ? "border-[#00605A]" : "border-transparent"} ${opt.color}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteAppointment} className="rounded-lg h-auto py-2 font-bold text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100" disabled={processing}>Delete</Button>
            <Button variant="outline" onClick={() => setEditItem(null)} className="rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-[#00605A] hover:bg-[#004f4a] rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
