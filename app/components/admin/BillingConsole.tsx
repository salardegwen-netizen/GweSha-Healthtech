import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/lib/api";
import { useData } from "~/lib/DataContext";

type Invoice = {
  id: string;
  patient?: string;
  patient_name?: string;
  date: string;
  amount: number;
  status: string;
  statusColor: string;
};

type Metrics = {
  todayRevenue: number;
  pendingInvoices: number;
  outstandingBalance: number;
};

function getStatusColor(status: string): string {
  const lower = status.toLowerCase();
  if (lower === 'paid') return "bg-[#1DB67B]/10 text-[#1DB67B]";
  if (lower === 'pending' || lower === 'due') return "bg-[#ECAF20]/10 text-[#ECAF20]";
  if (lower === 'overdue') return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-800";
}

export default function BillingConsole() {
  const { invoices: rawInvoices, patients: rawPatients = [], loading, refreshData } = useData();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [metrics, setMetrics] = useState<Metrics>({
    todayRevenue: 0,
    pendingInvoices: 0,
    outstandingBalance: 0,
  });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    amount: "",
    description: "",
    status: "due",
  });

  // Transform invoice data when updated
  useEffect(() => {
    const invoicesList = (rawInvoices || []).map((inv: any) => ({
      id: inv.id?.toString(),
      patient: inv.patient_name,
      patient_name: inv.patient_name,
      date: new Date(inv.date || inv.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      amount: parseFloat(inv.amount) || 0,
      status: inv.status || "Pending",
      statusColor: getStatusColor(inv.status),
    }));
    setInvoices(invoicesList);

    // Calculate metrics
    const pendingCount = invoicesList.filter(inv => inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'due').length;
    const totalPending = invoicesList.filter(inv => inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'due').reduce((sum, inv) => sum + inv.amount, 0);
    const todayRevenue = invoicesList.filter(inv => inv.status.toLowerCase() === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

    setMetrics({
      todayRevenue,
      pendingInvoices: pendingCount,
      outstandingBalance: totalPending,
    });
  }, [rawInvoices]);

  // Filter invoices based on search term
  useEffect(() => {
    const filtered = invoices.filter((inv) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        inv.patient_name?.toLowerCase().includes(searchLower) ||
        inv.id?.toLowerCase().includes(searchLower) ||
        inv.status?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm]);

  const handleExport = () => {
    if (invoices.length === 0) {
      toast.error('No invoices to export');
      return;
    }

    try {
      // Create CSV headers
      const headers = ['Invoice ID', 'Patient Name', 'Bill Date', 'Amount', 'Status'];

      // Create CSV rows from invoice data
      const rows = invoices.map(invoice => [
        invoice.id,
        invoice.patient_name || invoice.patient,
        invoice.date,
        `$${invoice.amount.toFixed(2)}`,
        invoice.status,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      // Create a Blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `billing-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${invoices.length} invoice(s) successfully`);
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export report');
    }
  };

  const handleCreateInvoice = async () => {
    if (!formData.patient_id || !formData.amount || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      await api.invoices.create({
        patient_id: parseInt(formData.patient_id),
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status,
      });

      toast.success('Invoice created successfully');
      setShowCreateDialog(false);
      setFormData({ patient_id: "", amount: "", description: "", status: "Due" });

      // Refresh data
      await refreshData();
    } catch (err: any) {
      console.error('Failed to create invoice:', err);
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 relative mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <Card className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 animate-pulse">
            <div className="h-8 bg-gray-300 rounded"></div>
          </Card>
          <Card className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 animate-pulse">
            <div className="h-8 bg-gray-300 rounded"></div>
          </Card>
          <Card className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 animate-pulse">
            <div className="h-8 bg-gray-300 rounded"></div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 relative mb-12">
      <Badge className="absolute -top-3 left-6 z-10 bg-[#00605A] text-white hover:bg-[#00605A] border-none px-4 shadow-md font-bold uppercase tracking-wider text-[0.6875rem]">Financial Hub</Badge>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Today's Revenue</div>
          <div className="text-3xl font-extrabold text-gray-900">${metrics.todayRevenue.toFixed(2)}</div>
        </Card>
        <Card className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Invoices</div>
          <div className="text-3xl font-extrabold text-gray-900">{metrics.pendingInvoices}</div>
        </Card>
        <Card className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Outstanding Balance</div>
          <div className="text-3xl font-extrabold text-[#ECAF20]">${metrics.outstandingBalance.toFixed(2)}</div>
        </Card>
      </div>

      <Card className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-sm font-[var(--font-headline)]">Recent Transactions</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="h-auto py-1.5 px-3 text-xs font-bold bg-[#00605A] text-white hover:bg-[#004f4a] rounded-lg"
            >
              + Create Invoice
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="h-auto py-1.5 px-3 text-xs font-bold text-gray-700 rounded-lg"
            >
              Export Report
            </Button>
          </div>
        </div>
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <Input
            placeholder="Search by patient name, invoice ID, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg text-xs"
          />
        </div>
        <div className="overflow-x-auto">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-sm font-medium">{searchTerm ? "No matching invoices" : "No transactions available"}</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-100 hover:bg-white text-xs">
                  <TableHead className="px-5 py-4 font-bold tracking-widest text-gray-400 uppercase">Invoice ID</TableHead>
                  <TableHead className="px-5 py-4 font-bold tracking-widest text-gray-400 uppercase">Patient Name</TableHead>
                  <TableHead className="px-5 py-4 font-bold tracking-widest text-gray-400 uppercase">Bill Date</TableHead>
                  <TableHead className="px-5 py-4 font-bold tracking-widest text-gray-400 uppercase text-right">Amount</TableHead>
                  <TableHead className="px-5 py-4 font-bold tracking-widest text-gray-400 uppercase text-center">Status</TableHead>
                  <TableHead className="px-5 py-4 font-bold tracking-widest text-gray-400 uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-50">
                {filteredInvoices.map((bill) => (
                  <TableRow key={bill.id} className="hover:bg-gray-50/50 transition-colors group border-b-0">
                    <TableCell className="px-5 py-4 font-mono text-[0.6875rem] text-gray-500 font-bold">{bill.id}</TableCell>
                    <TableCell className="px-5 py-4 font-bold text-sm text-gray-900">{bill.patient_name || bill.patient}</TableCell>
                    <TableCell className="px-5 py-4 text-xs font-medium text-gray-600">{bill.date}</TableCell>
                    <TableCell className="px-5 py-4 text-sm font-extrabold text-gray-900 text-right">${bill.amount.toFixed(2)}</TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <Badge variant="secondary" className={`inline-flex px-2.5 py-0.5 rounded-md text-[0.625rem] font-extrabold tracking-wider uppercase border-none ${bill.statusColor}`}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <Button
                        onClick={() => setSelectedInvoice(bill)}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold text-[#00605A] hover:bg-[#EAF8F8]"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-[var(--font-headline)] text-xl text-[#00605A] font-extrabold pb-2 border-b border-gray-100">Invoice Details</DialogTitle>
            <DialogDescription className="text-sm pt-2">
              Viewing financial record for {selectedInvoice?.patient_name || selectedInvoice?.patient}.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-500 uppercase">Invoice ID</span>
                <span className="text-sm font-mono font-bold text-gray-900">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-500 uppercase">Date Issued</span>
                <span className="text-sm font-medium text-gray-900">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-500 uppercase">Total Amount</span>
                <span className="text-lg font-extrabold text-[#00605A]">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Current Status</span>
                <Badge variant="secondary" className={`border-none ${selectedInvoice.statusColor} font-bold tracking-wider uppercase text-[0.625rem]`}>
                  {selectedInvoice.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedInvoice(null)} variant="outline" className="text-xs font-bold">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-[var(--font-headline)] text-xl text-[#00605A] font-extrabold pb-2 border-b border-gray-100">Create New Invoice</DialogTitle>
            <DialogDescription className="text-sm pt-2">
              Issue a new invoice to a patient for services rendered.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient" className="text-xs font-bold uppercase text-gray-600">Select Patient</Label>
              <select
                id="patient"
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#00605A] outline-none"
              >
                <option value="">-- Choose a patient --</option>
                {(rawPatients || []).map((patient: any) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name || patient.first_name} {patient.last_name || ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-xs font-bold uppercase text-gray-600">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="rounded-lg text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase text-gray-600">Service Description</Label>
              <textarea
                id="description"
                placeholder="e.g., Consultation, Lab Work, Procedure..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#00605A] outline-none resize-none h-24"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status" className="text-xs font-bold uppercase text-gray-600">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#00605A] outline-none"
              >
                <option value="due">Due</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setFormData({ patient_id: "", amount: "", description: "", status: "due" });
              }}
              disabled={isCreating}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateInvoice}
              disabled={isCreating}
              className="text-xs font-bold bg-[#00605A] text-white hover:bg-[#004f4a]"
            >
              {isCreating ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
