import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useData } from "~/lib/DataContext";

interface Invoice {
  id: string;
  amount: number;
  created_at: string;
  status: string;
}

export default function BillingCard() {
  const navigate = useNavigate();
  const { invoices: rawInvoices } = useData();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rawInvoices) return;

    if (rawInvoices.length === 0) {
      setInvoice(null);
      setTotalDue(0);
      setLoading(false);
      return;
    }

    // Find first pending/due invoice
    const pending = rawInvoices.find((inv: any) =>
      (inv.status || '').toLowerCase() === 'pending' ||
      (inv.status || '').toLowerCase() === 'due'
    );
    const selectedInvoice = pending || rawInvoices[0];

    if (selectedInvoice) {
      setInvoice({
        ...selectedInvoice,
        amount: parseFloat(selectedInvoice.amount) || 0,
      });
    }

    // Calculate total pending
    const total = rawInvoices
      .filter((inv: any) =>
        (inv.status || '').toLowerCase() === 'pending' ||
        (inv.status || '').toLowerCase() === 'due'
      )
      .reduce((sum: number, inv: any) => sum + (parseFloat(inv.amount) || 0), 0);
    setTotalDue(total);
    setLoading(false);
  }, [rawInvoices]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="col-span-1 md:col-span-12 lg:col-span-4 rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 font-[var(--font-headline)]">Billing Summary</h3>
        <span className="material-symbols-outlined text-gray-400">credit_card</span>
      </div>

      <div className="bg-[#003B95] rounded-xl p-6 text-white relative overflow-hidden flex-1 shadow-md">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        
        <p className="text-[0.6875rem] font-semibold text-blue-100 mb-1 relative z-10">Current Balance Due</p>
        <h4 className="text-4xl font-extrabold mb-8 relative z-10">₱{totalDue > 0 ? totalDue.toFixed(2) : "0.00"}</h4>
        
        <div className="space-y-3 mb-6 relative z-10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-100">Recent Copay</span>
            <span className="font-bold">₱2,500</span>
          </div>
          <div className="h-px w-full bg-white/20"></div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-100">Last Statement</span>
            <span className="font-bold">Oct 01</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate("/billing")}
          className="w-full bg-white text-[#003B95] py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors relative z-10"
        >
          Pay Outstanding Balance
        </button>
      </div>
      
      <div className="grid grid-cols-2 mt-2 gap-2">
        <div className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          Statements
        </div>
        <div className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
          <span className="material-symbols-outlined text-sm">health_and_safety</span>
          Insurance
        </div>
      </div>
    </div>
  );
}
