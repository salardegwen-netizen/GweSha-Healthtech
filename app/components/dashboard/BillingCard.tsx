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

  // Update when invoices from DataContext change
  useEffect(() => {
    if (rawInvoices && rawInvoices.length > 0) {
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
    }
  }, [rawInvoices]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-[var(--color-surface-container-low)] rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-3"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-[var(--color-surface-container-low)] rounded-2xl p-6">
        <p className="text-[var(--color-on-surface-variant)]">No billing information available</p>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-[var(--color-surface-container-low)] rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative">
      <Link to="/billing" className="absolute inset-0 z-0" aria-label="Go to billing" />
      <div className="md:w-1/2 space-y-3 relative z-10 pointer-events-none">
        <div className="bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] px-2.5 py-1 rounded-full text-[0.625rem] font-bold inline-block">Payment Pending</div>
        <h3 className="font-[var(--font-headline)] text-xl font-bold text-left">Billing Oversight</h3>
        <p className="text-[var(--color-on-surface-variant)] text-sm text-left">
          Your outstanding balance for recent services is due for processing.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
          <span className="material-symbols-outlined text-[1rem]">info</span>
          Click anywhere on this card to view your full statement.
        </div>
      </div>
      <div className="md:w-1/2 flex flex-col justify-between gap-4 relative z-10 pointer-events-none">
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[0.625rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-0.5">Amount Due</p>
            <p className="text-2xl font-black text-[var(--color-on-surface)]">${invoice.amount.toFixed(2)}</p>
            <p className="text-[0.625rem] text-gray-400 mt-0.5">{invoice.id} · Due {formatDate(invoice.created_at)}</p>
          </div>
          <span className="material-symbols-outlined text-[var(--color-tertiary)] text-[2rem]">account_balance_wallet</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate("/billing"); }}
          className="w-full bg-[var(--color-on-surface)] text-[var(--color-surface)] py-3 rounded-xl font-semibold text-sm hover:bg-[var(--color-inverse-surface)] transition-colors pointer-events-auto flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[1.125rem]">payment</span>
          Pay Statement
        </button>
      </div>
    </div>
  );
}
