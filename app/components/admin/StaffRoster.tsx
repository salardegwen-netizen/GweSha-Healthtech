import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/lib/api";
import { useData } from "~/lib/DataContext";

const ROLE_OPTIONS = [
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "receptionist", label: "Receptionist" },
  { value: "admin", label: "Administrator" },
];

const DEPARTMENT_OPTIONS = [
  "Surgery",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dentistry",
  "Nursing",
  "Anesthesia",
  "Radiology",
  "Pathology",
  "General Medicine",
];

type StaffMember = {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  role: string;
  status: string;
  statusColor: string;
  img: string;
  dept: string;
  department?: string;
  email?: string;
  phone?: string;
};

const STATUS_OPTIONS = [
  { label: "On Duty",   value: "active",    color: "bg-[#1DB67B]/10 text-[#1DB67B]" },
  { label: "Off Duty",  value: "inactive",  color: "bg-gray-100 text-gray-500" },
  { label: "On Leave",  value: "on_leave",  color: "bg-red-100 text-red-600" },
];

function getStatusColor(status: string): string {
  const lower = status.toLowerCase();
  if (lower === 'active' || lower === 'on duty') return "bg-[#1DB67B]/10 text-[#1DB67B]";
  if (lower === 'inactive' || lower === 'off duty') return "bg-gray-100 text-gray-500";
  if (lower === 'on_leave' || lower === 'on leave') return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-500";
}

function getBackendStatus(displayStatus: string): string {
  const lower = displayStatus.toLowerCase();
  if (lower === 'on duty') return "active";
  if (lower === 'off duty') return "inactive";
  if (lower === 'on leave' || lower === 'on_leave') return "on_leave";
  return lower;
}

function formatStatus(status: string): string {
  const lower = status.toLowerCase();
  if (lower === 'active') return "On Duty";
  if (lower === 'inactive') return "Off Duty";
  if (lower === 'on_leave') return "On Leave";
  return status;
}

export default function StaffRoster() {
  const { staff: rawStaff, loading } = useData();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [viewProfile, setViewProfile] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: "", role: "", dept: "", phone: "", title: "", email: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Transform centralized staff data whenever it updates
  useEffect(() => {
    const staff = (rawStaff || []).map((s: any) => {
      const nameParts = (s.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      let imageUrl = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`;
      if (s.profile_image) {
        imageUrl = s.profile_image.startsWith('http') ? s.profile_image : `http://localhost:8000/${s.profile_image}`;
      }

      return {
        id: s.id?.toString(),
        name: s.name || `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        role: s.role || "Staff",
        status: formatStatus(s.status || "active"),
        statusColor: getStatusColor(s.status || "active"),
        img: imageUrl,
        dept: s.department || "General",
        department: s.department || "General",
        email: s.email,
        phone: s.phone,
      };
    });
    setStaffList(staff);
    setSearchTerm(""); // Reset search when data changes
  }, [rawStaff]);

  // Filter staff based on search term
  useEffect(() => {
    const filtered = staffList.filter((member) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        member.name?.toLowerCase().includes(searchLower) ||
        member.role?.toLowerCase().includes(searchLower) ||
        member.dept?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredStaff(filtered);
  }, [staffList, searchTerm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMember = async () => {
    if (!form.name || !form.role || !form.dept || !form.phone || !form.title) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      setProcessing(true);

      // Validate required fields
      if (!form.name || !form.email || !form.role || !form.dept) {
        toast.error("Please fill in all required fields");
        setProcessing(false);
        return;
      }

      // Create FormData for multipart request
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('role', form.role);
      formData.append('department', form.dept);
      formData.append('title', form.title);
      formData.append('status', 'active');

      // Add image if selected
      if (imageFile) {
        formData.append('profile_image', imageFile);
      }

      // Log form data for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Send FormData via fetch
      const response = await fetch('http://localhost:8000/api/staff', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const result = await response.json();

      console.log('Backend response:', result);

      if (!response.ok || !result.success) {
        const errorMsg = result.errors ? JSON.stringify(result.errors) : result.message;
        throw new Error(errorMsg || `HTTP ${response.status}`);
      }

      const data = result.data;
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const imageUrl = data.profile_image ? (data.profile_image.startsWith('http') ? data.profile_image : `http://localhost:8000/${data.profile_image}`) : null;

      const newMember: StaffMember = {
        id: data.id?.toString(),
        name: data.name,
        first_name: firstName,
        last_name: lastNameParts.join(' '),
        role: data.role || form.role,
        dept: data.department || form.dept,
        status: formatStatus(data.status || "active"),
        statusColor: getStatusColor(data.status || "active"),
        img: imageUrl || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        email: data.email,
        phone: data.phone,
      };
      setStaffList([newMember, ...staffList]);
      setIsAddOpen(false);
      setForm({ name: "", role: "", dept: "", phone: "", title: "", email: "" });
      setImageFile(null);
      setImagePreview(null);
      toast.success(`${form.name} added to the roster!`);

      // DataContext will auto-refresh data in 20 seconds
    } catch (err: any) {
      console.error('Error creating staff:', err);
      toast.error(err.message || 'Failed to add staff member');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${staffName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setProcessing(true);
      await api.staff.delete(staffId);
      setStaffList(prev => prev.filter(s => s.id !== staffId));
      setViewProfile(null);
      toast.success(`${staffName} has been removed from the roster.`);
    } catch (err: any) {
      console.error('Error deleting staff:', err);
      toast.error('Failed to delete staff member');
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (displayStatus: string, newColor: string) => {
    if (!viewProfile) return;
    try {
      setProcessing(true);
      const backendStatus = getBackendStatus(displayStatus);
      // Pass just the string, not an object
      await api.staff.updateStatus(viewProfile.id, backendStatus);
      const updated = staffList.map(s =>
        s.id === viewProfile.id ? { ...s, status: displayStatus, statusColor: newColor } : s
      );
      setStaffList(updated);
      setViewProfile({ ...viewProfile, status: displayStatus, statusColor: newColor });
      toast.success(`${viewProfile.name}'s status updated to "${displayStatus}".`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 relative mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 animate-pulse">
              <div className="p-6 h-40 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 relative mb-12">
      <Badge className="absolute -top-3 left-6 z-10 bg-[#003B95] text-white hover:bg-[#003B95] border-none px-4 shadow-md font-bold uppercase tracking-wider text-[0.6875rem]">Staff Directory</Badge>

      <div className="flex justify-end items-center mb-6 pt-4">
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) {
            setForm({ name: "", role: "", dept: "", phone: "", title: "", email: "" });
            setImageFile(null);
            setImagePreview(null);
          }
        }}>
          <DialogTrigger className="bg-[#003B95] hover:bg-[#002D73] text-white rounded-lg font-bold text-xs py-1.5 px-4 h-auto disabled:opacity-60" disabled={processing}>
            Add New Member
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="font-[var(--font-headline)] text-xl text-[#003B95] font-extrabold">Register Staff Member</DialogTitle>
              <DialogDescription className="text-sm">Add a new professional to the clinic portal.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-wider text-gray-500">Staff Photo (Optional)</Label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-[#003B95]" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">account_circle</span>
                    </div>
                  )}
                  <label htmlFor="image" className="flex-1 cursor-pointer">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={processing}
                    />
                    <div className="px-4 py-2 bg-[#E8EFFF] text-[#003B95] rounded-lg font-bold text-xs text-center hover:bg-[#D0F0ED] transition-colors">
                      {imageFile ? 'Change Photo' : 'Choose Photo'}
                    </div>
                  </label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</Label>
                <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Dr. Jane Smith" className="rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. jane.smith@sanctuary.com" className="rounded-lg" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-gray-500">Official Role</Label>
                <select
                  id="role"
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#003B95]"
                >
                  <option value="">Select a role...</option>
                  {ROLE_OPTIONS.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dept" className="text-xs font-bold uppercase tracking-wider text-gray-500">Department</Label>
                <select
                  id="dept"
                  value={form.dept}
                  onChange={e => setForm({...form, dept: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#003B95]"
                >
                  <option value="">Select a department...</option>
                  {DEPARTMENT_OPTIONS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-gray-500">Job Title</Label>
                <Input id="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Chief Surgeon" className="rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</Label>
                <Input id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="e.g. +1 (555) 123-4567" className="rounded-lg" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>Cancel</Button>
              <Button onClick={handleAddMember} className="bg-[#003B95] hover:bg-[#002D73] rounded-lg h-auto py-2 font-bold text-xs" disabled={processing}>{processing ? 'Adding...' : 'Deploy Member'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 p-5 border border-gray-100 rounded-lg bg-gray-50/50">
        <Input
          placeholder="Search by name, role, department, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 flex items-start gap-4">
              <img src={staff.img} alt={staff.name} className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover" />
              <div className="flex-1">
                <Badge variant="secondary" className={`inline-flex px-2 py-0.5 rounded-sm text-[0.5625rem] font-extrabold tracking-widest uppercase border-none mb-2 ${staff.statusColor}`}>
                  {staff.status}
                </Badge>
                <div className="font-extrabold text-sm text-gray-900 mb-0.5">{staff.name}</div>
                {staff.email && (
                  <div className="text-[0.6875rem] text-[#003B95] font-semibold mb-1">{staff.email}</div>
                )}
                <div className="text-[0.6875rem] font-bold text-gray-600 mb-1">{staff.dept || staff.department}</div>
                <div className="text-xs text-gray-500 font-medium">{staff.role}</div>
              </div>
            </div>
            <div className="border-t border-gray-50 px-6 py-4 bg-gray-50/30 flex justify-between items-center gap-2 mt-auto">
              <span className="text-[0.625rem] font-mono text-gray-400 font-bold">{staff.id}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setViewProfile(staff)}
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1 px-2 text-[0.6875rem] font-bold text-gray-600 hover:text-[#003B95] rounded-md"
                >
                  View Profile
                </Button>
                <Button
                  onClick={() => handleDeleteStaff(staff.id, staff.name)}
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1 px-2 text-[0.6875rem] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  disabled={processing}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Profile Dialog */}
      <Dialog open={!!viewProfile} onOpenChange={(open) => !open && setViewProfile(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 overflow-hidden">
          {viewProfile && (
            <>
              <div className="bg-[#064E3B] p-6 flex items-center gap-4">
                <img src={viewProfile.img} alt={viewProfile.name} className="w-16 h-16 rounded-full border-2 border-[#80BEA6] object-cover" />
                <div>
                  <div className="text-white font-extrabold text-lg leading-tight">{viewProfile.name}</div>
                  <div className="text-[#8CE3DE] text-xs font-bold mt-0.5">{viewProfile.department || viewProfile.dept} — {viewProfile.role}</div>
                  <Badge variant="secondary" className={`inline-flex mt-2 px-2 py-0.5 rounded-sm text-[0.5625rem] font-extrabold tracking-widest uppercase border-none ${viewProfile.statusColor}`}>
                    {viewProfile.status}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Staff ID</div>
                    <div className="font-mono text-xs font-bold text-gray-700">{viewProfile.id}</div>
                  </div>
                  <div>
                    <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</div>
                    <div className="text-xs font-bold text-gray-700">{viewProfile.department || viewProfile.dept}</div>
                  </div>
                  <div>
                    <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</div>
                    <div className="text-xs text-gray-700">{viewProfile.email || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</div>
                    <div className="text-xs text-gray-700">{viewProfile.phone}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-3">Update Status</div>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => handleStatusChange(opt.label, opt.color)}
                        disabled={processing}
                        className={`px-3 py-1 rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider border-2 transition-all ${viewProfile.status === opt.label ? "border-[#003B95] scale-105" : "border-transparent"} ${opt.color}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <Button
                  onClick={() => viewProfile && handleDeleteStaff(viewProfile.id, viewProfile.name)}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-auto py-2.5"
                  disabled={processing}
                >
                  Delete Member
                </Button>
                <Button
                  onClick={() => setViewProfile(null)}
                  className="flex-1 rounded-xl bg-[#003B95] hover:bg-[#002D73] text-white font-bold text-xs h-auto py-2.5"
                  disabled={processing}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
