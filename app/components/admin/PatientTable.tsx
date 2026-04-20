import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/lib/api";
import { useData } from "~/lib/DataContext";
import HealthRecordsManager from "./HealthRecordsManager";

type Patient = {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  lastVisit?: string;
  last_visit?: string;
  nextAppt?: string;
  next_appointment?: string;
  balance: number | string;
  status: string;
  statusColor: string;
  img: string;
  phone?: string;
};

export default function PatientTable() {
  const navigate = useNavigate();
  const { patients: rawPatients, loading } = useData();
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [filteredList, setFilteredList] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", balance: "" });
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "records" | "appointments" | "billing">("overview");
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", balance: "" });

  // Transform centralized patients data whenever it updates
  useEffect(() => {
    const patients = (rawPatients || []).map((p: any) => ({
      ...p,
      id: p.id?.toString(),
      name: `${p.first_name} ${p.last_name}`,
      lastVisit: p.last_visit || "Not available",
      nextAppt: p.next_appointment || "Pending Scheduling",
      balance: parseFloat(p.balance || 0),
      status: parseFloat(p.balance || 0) > 0 ? "Action Required" : "Up to Date",
      statusColor: parseFloat(p.balance || 0) > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800",
      img: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
    }));
    setPatientsList(patients);
    setSearchTerm(""); // Reset search when data changes
  }, [rawPatients]);

  // Filter patients based on search term
  useEffect(() => {
    const filtered = patientsList.filter((patient) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phone?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredList(filtered);
  }, [patientsList, searchTerm]);

  const handleAddPatient = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      setProcessing(true);
      const [firstName, ...lastNameParts] = form.name.split(' ');
      const { data } = await api.patients.create({
        first_name: firstName,
        last_name: lastNameParts.join(' ') || 'Patient',
        email: form.email,
        balance: parseFloat(form.balance) || 0,
      });

      const newPatient = {
        ...data.data,
        id: data.data.id?.toString(),
        name: `${data.data.first_name} ${data.data.last_name}`,
        lastVisit: "Today",
        nextAppt: "Pending Scheduling",
        balance: parseFloat(data.data.balance || 0),
        status: "Up to Date",
        statusColor: "bg-green-100 text-green-800",
        img: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
      };

      setPatientsList([newPatient, ...patientsList]);
      setIsOpen(false);
      setForm({ name: "", email: "", balance: "" });
      toast.success(`Patient record created for ${form.name}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create patient');
    } finally {
      setProcessing(false);
    }
  };

  const handleResolve = async (p: Patient) => {
    try {
      setProcessing(true);
      await api.patients.update(p.id, {
        balance: 0,
      });
      setPatientsList(prev => prev.map(x => x.id === p.id ? { ...x, status: "Up to Date", statusColor: "bg-green-100 text-green-800", balance: 0 } : x));
      toast.success(`${p.name}'s record marked as resolved.`);
    } catch (err) {
      toast.error('Failed to resolve patient');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (p: Patient) => {
    try {
      setProcessing(true);
      await api.patients.delete(p.id);
      setPatientsList(prev => prev.filter(x => x.id !== p.id));
      toast(`${p.name} removed from directory.`, { icon: "🗑️" });
    } catch (err) {
      toast.error('Failed to delete patient');
    } finally {
      setProcessing(false);
    }
  };

  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setEditForm({
      name: p.name || `${p.first_name} ${p.last_name}`,
      email: p.email,
      balance: String(p.balance),
    });
  };

  const handleEditPatient = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and Email are required.");
      return;
    }
    if (!editPatient) return;

    try {
      setProcessing(true);
      const [firstName, ...lastNameParts] = editForm.name.split(' ');
      await api.patients.update(editPatient.id, {
        first_name: firstName,
        last_name: lastNameParts.join(' ') || 'Patient',
        email: editForm.email,
        balance: parseFloat(editForm.balance) || 0,
      });

      setPatientsList(prev => prev.map(p =>
        p.id === editPatient.id
          ? {
              ...p,
              name: editForm.name,
              email: editForm.email,
              balance: parseFloat(editForm.balance) || 0,
              status: parseFloat(editForm.balance) > 0 ? "Action Required" : "Up to Date",
              statusColor: parseFloat(editForm.balance) > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800",
            }
          : p
      ));
      setEditPatient(null);
      toast.success(`Patient record updated for ${editForm.name}.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update patient');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading patients...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-900 text-sm font-[var(--font-headline)]">Recent Patients Overview</h3>
        <div className="flex items-center gap-3">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="bg-[#00605A] hover:bg-[#004f4a] text-white h-auto py-1.5 px-3 rounded-lg text-xs font-bold shadow-sm">
              Add New Patient
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
              <DialogHeader>
                <DialogTitle className="font-[var(--font-headline)] text-xl text-[#00605A] font-extrabold">Patient Intake</DialogTitle>
                <DialogDescription className="text-sm">Register a new patient into the directory database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500">Patient Full Name</Label>
                  <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Doe" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</Label>
                  <Input id="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. john@example.com" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="balance" className="text-xs font-bold uppercase tracking-wider text-gray-500">Initial Balance</Label>
                  <Input id="balance" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} placeholder="e.g. 150.00" className="rounded-lg" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>Cancel</Button>
                <Button onClick={handleAddPatient} className="bg-[#00605A] hover:bg-[#004f4a] rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>{processing ? 'Saving...' : 'Save Patient Data'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => navigate("/admin/patients")}
            variant="ghost"
            className="h-auto py-1 px-2 text-xs font-bold text-[#00605A] flex items-center gap-1 hover:bg-[#EAF8F8] transition-colors rounded-lg"
          >
            View Register <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Button>
        </div>
      </div>

      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg text-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b border-gray-100 hover:bg-white">
              <TableHead className="px-5 py-3 text-[0.625rem] font-bold tracking-widest text-gray-400 uppercase h-auto">Patient Name</TableHead>
              <TableHead className="px-5 py-3 text-[0.625rem] font-bold tracking-widest text-gray-400 uppercase h-auto">Next Appointment</TableHead>
              <TableHead className="px-5 py-3 text-[0.625rem] font-bold tracking-widest text-gray-400 uppercase h-auto">Outstanding Balance</TableHead>
              <TableHead className="px-5 py-3 text-[0.625rem] font-bold tracking-widest text-gray-400 uppercase h-auto">Status</TableHead>
              <TableHead className="px-5 py-3 text-[0.625rem] font-bold tracking-widest text-gray-400 uppercase text-right h-auto">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {filteredList.map((p) => (
              <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors group border-b-0">
                <TableCell className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt={p.name || p.first_name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                    <div>
                      <div className="font-bold text-xs text-gray-900">{p.name || `${p.first_name} ${p.last_name}`}</div>
                      <div className="text-[0.625rem] text-gray-500 font-mono mt-0.5">{p.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <div className="text-xs font-medium text-gray-800">{p.nextAppt || p.next_appointment}</div>
                  <div className="text-[0.625rem] text-gray-500 mt-0.5">Last Visit: {p.lastVisit || p.last_visit}</div>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <div className={`text-xs font-bold ${(p.balance === 0 || p.balance === "$0.00") ? "text-gray-400" : "text-gray-900"}`}>${typeof p.balance === 'number' ? p.balance.toFixed(2) : p.balance}</div>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <Badge variant="secondary" className={`inline-flex px-2.5 py-0.5 rounded-full text-[0.625rem] font-bold tracking-wider uppercase border-none hover:bg-opacity-80 ${p.statusColor}`}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-7 h-7 rounded-full text-gray-400 hover:text-[#00605A] hover:bg-[#EAF8F8] transition-colors ml-auto hover:bg-muted p-0 inline-flex items-center justify-center" disabled={processing}>
                      <span className="material-symbols-outlined text-[1.125rem]">more_vert</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-sm border-gray-100">
                      <DropdownMenuItem
                        onClick={() => setDetailPatient(p)}
                        className="text-xs font-bold text-gray-700 cursor-pointer rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[1rem] mr-2">person</span>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEdit(p)}
                        className="text-xs font-bold text-gray-700 cursor-pointer rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[1rem] mr-2">edit</span>
                        Edit Record
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/schedule")}
                        className="text-xs font-bold text-gray-700 cursor-pointer rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[1rem] mr-2">calendar_month</span>
                        Schedule Appointment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleResolve(p)}
                        className="text-xs font-bold text-green-700 cursor-pointer rounded-lg hover:bg-green-50"
                      >
                        <span className="material-symbols-outlined text-[1rem] mr-2">check_circle</span>
                        Mark Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(p)}
                        className="text-xs font-bold text-red-600 cursor-pointer rounded-lg hover:bg-red-50"
                      >
                        <span className="material-symbols-outlined text-[1rem] mr-2">delete</span>
                        Remove Patient
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Patient Detail Dialog - Tabbed View */}
      <Dialog open={!!detailPatient} onOpenChange={(open) => {
        if (!open) {
          setDetailPatient(null);
          setDetailTab("overview");
        }
      }}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {detailPatient && (
            <>
              {/* Header */}
              <div className="bg-[#064E3B] p-6 flex items-center gap-4 flex-shrink-0">
                <img src={detailPatient.img} alt={detailPatient.name || detailPatient.first_name} className="w-14 h-14 rounded-full border-2 border-[#80BEA6] object-cover" />
                <div>
                  <div className="text-white font-extrabold text-base leading-tight">{detailPatient.name || `${detailPatient.first_name} ${detailPatient.last_name}`}</div>
                  <div className="text-[#8CE3DE] text-xs font-bold mt-0.5 font-mono">{detailPatient.id}</div>
                  <Badge variant="secondary" className={`inline-flex mt-2 px-2 py-0.5 rounded-sm text-[0.5625rem] font-extrabold tracking-widest uppercase border-none ${detailPatient.statusColor}`}>
                    {detailPatient.status}
                  </Badge>
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="bg-white border-b border-gray-200 px-6 pt-0 flex gap-8 flex-shrink-0">
                {(['overview', 'records', 'appointments', 'billing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`py-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                      detailTab === tab
                        ? 'text-[#00605A] border-[#00605A]'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {detailTab === "overview" && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</div>
                      <div className="text-xs text-gray-700">{detailPatient.email}</div>
                    </div>
                    <div>
                      <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Outstanding Balance</div>
                      <div className={`text-xs font-bold ${(detailPatient.balance === 0 || detailPatient.balance === "$0.00") ? "text-gray-400" : "text-red-600"}`}>${typeof detailPatient.balance === 'number' ? detailPatient.balance.toFixed(2) : detailPatient.balance}</div>
                    </div>
                    <div>
                      <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Visit</div>
                      <div className="text-xs text-gray-700">{detailPatient.lastVisit || detailPatient.last_visit}</div>
                    </div>
                    <div>
                      <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Next Appointment</div>
                      <div className="text-xs text-gray-700">{detailPatient.nextAppt || detailPatient.next_appointment}</div>
                    </div>
                  </div>
                )}

                {/* Health Records Tab */}
                {detailTab === "records" && (
                  <HealthRecordsManager
                    patientId={parseInt(detailPatient.id)}
                    onRefresh={() => {}}
                  />
                )}

                {/* Appointments Tab */}
                {detailTab === "appointments" && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Appointments data coming soon</p>
                  </div>
                )}

                {/* Billing Tab */}
                {detailTab === "billing" && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Billing details coming soon</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex gap-3 border-t border-gray-200 pt-4 flex-shrink-0">
                <Button onClick={() => { navigate("/admin/schedule"); setDetailPatient(null); }} variant="outline" className="flex-1 rounded-xl text-xs font-bold h-auto py-2.5">Schedule Appt</Button>
                <Button onClick={() => setDetailPatient(null)} className="flex-1 rounded-xl bg-[#00605A] hover:bg-[#004f4a] text-white font-bold text-xs h-auto py-2.5">Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
          {editPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="font-[var(--font-headline)] text-xl text-[#00605A] font-extrabold">Edit Patient Record</DialogTitle>
                <DialogDescription className="text-sm">Update patient information and billing details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-wider text-gray-500">Patient Full Name</Label>
                  <Input id="edit-name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="e.g. John Doe" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</Label>
                  <Input id="edit-email" type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="e.g. john@example.com" className="rounded-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-balance" className="text-xs font-bold uppercase tracking-wider text-gray-500">Outstanding Balance</Label>
                  <Input id="edit-balance" value={editForm.balance} onChange={e => setEditForm({...editForm, balance: e.target.value})} placeholder="e.g. 150.00" className="rounded-lg" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditPatient(null)} className="rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>Cancel</Button>
                <Button onClick={handleEditPatient} className="bg-[#00605A] hover:bg-[#004f4a] rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
