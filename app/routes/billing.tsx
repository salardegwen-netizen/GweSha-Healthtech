import type { Route } from "./+types/billing";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import DashboardNav from "~/components/dashboard/DashboardNav";
import Footer from "~/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { useData } from "~/lib/DataContext";
import { api } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Billing & Statements - Sanctuary Health" },
    { name: "description", content: "Review and pay your billing statements" },
  ];
}

type Invoice = {
  id: string | number;
  date: string;
  description: string;
  amount: string;
  amountRaw: number;
  status: "Due" | "Paid" | "Waived" | "Processing";
  statusColor: string;
  icon: string;
};

const PAYMENT_METHODS = ["Credit Card", "Debit Card", "Bank Transfer (ACH)", "Health Insurance"];

export default function Billing() {
  const { invoices: rawInvoices = [] } = useData();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [cardNumber, setCardNumber] = useState("");
  const [processing, setProcessing] = useState(false);

  // Transform raw invoices into Invoice format
  useEffect(() => {
    const transformed = (rawInvoices || []).map((inv: any) => {
      const amount = parseFloat(inv.amount || 0);
      const statusLower = (inv.status || "pending").toLowerCase();
      let status: "Due" | "Paid" | "Waived" | "Processing" = "Due";
      let statusColor = "bg-red-100 text-red-800";

      if (statusLower === 'paid') {
        status = "Paid";
        statusColor = "bg-green-100 text-green-800";
      } else if (statusLower === 'waived') {
        status = "Waived";
        statusColor = "bg-gray-100 text-gray-800";
      } else if (statusLower === 'processing') {
        status = "Processing";
        statusColor = "bg-blue-100 text-blue-800";
      }

      return {
        id: inv.id,
        date: inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown',
        description: inv.description || `Invoice #${inv.id}`,
        amount: `$${amount.toFixed(2)}`,
        amountRaw: amount,
        status,
        statusColor,
        icon: 'receipt_long',
      };
    });
    setInvoices(transformed);
  }, [rawInvoices]);

  const outstandingTotal = invoices
    .filter(inv => inv.status === "Due")
    .reduce((sum, inv) => sum + inv.amountRaw, 0);

  const hasDue = outstandingTotal > 0;

  const handleDownload = (invoiceId: string | number) => {
    toast.promise(
      new Promise(res => setTimeout(res, 1200)),
      {
        loading: `Generating PDF for ${invoiceId}...`,
        success: `Receipt for ${invoiceId} downloaded.`,
        error: "Failed to generate receipt.",
      }
    );
  };

  const handleDownloadAll = () => {
    toast.promise(
      new Promise(res => setTimeout(res, 1800)),
      {
        loading: "Compiling all statements...",
        success: "Full statement PDF downloaded.",
        error: "Failed to compile statements.",
      }
    );
  };

  const handlePayment = async () => {
    if (!cardNumber || cardNumber.length < 4) {
      toast.error("Please enter a valid payment reference.");
      return;
    }

    if (!payingInvoice) {
      toast.error("No invoice selected");
      return;
    }

    // Map display names to backend values
    const paymentMethodMap: { [key: string]: string } = {
      "Credit Card": "card",
      "Debit Card": "card",
      "Bank Transfer (ACH)": "bank_transfer",
      "Health Insurance": "check",
    };

    setProcessing(true);
    try {
      // Try to submit payment via API
      await api.billing.payments.create({
        invoice_id: payingInvoice.id,
        amount: payingInvoice.amountRaw,
        payment_method: paymentMethodMap[paymentMethod] || "card",
        reference: cardNumber,
      });

      setInvoices(prev =>
        prev.map(inv =>
          inv.id === payingInvoice?.id
            ? { ...inv, status: "Paid", statusColor: "bg-green-100 text-green-800" }
            : inv
        )
      );
      setProcessing(false);
      setPayingInvoice(null);
      setCardNumber("");
      toast.success(`Payment of ${payingInvoice?.amount} processed successfully!`, { icon: "✅" });
    } catch (err) {
      console.error("Payment error:", err);
      setProcessing(false);
      toast.error("Payment failed. Please try again or contact support.");
    }
  };

  return (
    <div className="bg-[#F8F7F4] min-h-screen flex flex-col font-['Inter']">
      <DashboardNav />

      <main className="flex-grow pt-32 pb-20 px-6 w-full">

        {/* Header */}
        <section className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-left">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-colors border border-gray-200">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight font-[var(--font-headline)] text-[var(--color-primary)] text-left">
                Billing & Payments
              </h1>
            </div>
            <p className="text-sm text-gray-600 pl-11 max-w-lg text-left">
              Manage your outstanding balances, view payment history, and download tax-ready receipts.
            </p>
          </div>
          <button
            onClick={handleDownloadAll}
            className="px-5 py-2.5 rounded-full bg-white text-sm font-bold text-[var(--color-primary)] border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[1.125rem]">receipt_long</span>
            Download statement PDF
          </button>
        </section>

        {/* Outstanding Balance Hero */}
        <div className={`rounded-3xl p-8 shadow-md mb-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left relative overflow-hidden ${hasDue ? "bg-[#00605A] text-white" : "bg-green-50 border border-green-100"}`}>
          <div className="absolute top-[-30px] right-[-20px] opacity-10">
            <span className="material-symbols-outlined text-[15rem]">account_balance_wallet</span>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${hasDue ? "text-[#8CE3DE]" : "text-green-600"}`}>
              {hasDue ? "Outstanding Balance" : "Account Status"}
            </p>
            <h2 className={`text-5xl font-extrabold mb-1 font-[var(--font-headline)] ${hasDue ? "text-white" : "text-green-700"}`}>
              {hasDue ? `$${outstandingTotal.toFixed(2)}` : "All Clear ✓"}
            </h2>
            <p className={`text-sm ${hasDue ? "text-[#8CE3DE]" : "text-green-600"}`}>
              {hasDue ? "Due by October 30, 2026" : "No outstanding balances. You're all up to date!"}
            </p>
          </div>

          {hasDue && (
            <div className="relative z-10 w-full md:w-auto">
              <button
                onClick={() => {
                  const firstDue = invoices.find(inv => inv.status === "Due");
                  if (firstDue) setPayingInvoice(firstDue);
                }}
                className="w-full md:w-auto px-8 py-3.5 rounded-full bg-white text-[#00605A] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Make a Payment
              </button>
            </div>
          )}
        </div>

        {/* What you owe breakdown */}
        {hasDue && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
            <div>
              <div className="text-sm font-bold text-amber-800">How is my balance calculated?</div>
              <div className="text-xs text-amber-700 mt-1">
                Your outstanding balance is the sum of all invoices marked as <strong>Due</strong> below. Each invoice corresponds to a specific clinical service or consultation you received.
              </div>
            </div>
          </div>
        )}

        {/* Statement History */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 font-[var(--font-headline)] mb-5">Your Statements</h2>
          <div className="flex flex-col gap-4">
            {invoices.map(invoice => (
              <div key={invoice.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-gray-200 transition-colors">

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${invoice.status === "Due" ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"}`}>
                    <span className="material-symbols-outlined text-xl">{invoice.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{invoice.description}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono text-gray-400">{invoice.id}</span>
                      <span>•</span>
                      <span>{invoice.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-gray-100 md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-bold text-lg text-gray-900">{invoice.amount}</span>
                    <span className={`text-[0.625rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${invoice.statusColor}`}>
                      {invoice.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {invoice.status === "Due" && (
                      <button
                        onClick={() => setPayingInvoice(invoice)}
                        className="px-4 py-2 rounded-full bg-[#00605A] text-white text-xs font-bold hover:bg-[#004f4a] transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(invoice.id)}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#00605A] hover:bg-[#EAF8F8] transition-colors"
                      title="Download receipt"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />

      {/* Payment Dialog */}
      <Dialog open={!!payingInvoice} onOpenChange={(open) => !open && !processing && setPayingInvoice(null)}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl p-0 overflow-hidden">
          {payingInvoice && (
            <>
              <div className="bg-[#064E3B] p-6">
                <DialogTitle className="text-white font-extrabold text-xl font-[var(--font-headline)]">Complete Payment</DialogTitle>
                <DialogDescription className="text-[#8CE3DE] text-sm mt-1">
                  You are paying for: <strong className="text-white">{payingInvoice.description}</strong>
                </DialogDescription>
                <div className="mt-4 bg-white/10 rounded-xl px-5 py-3 flex justify-between items-center">
                  <span className="text-[#8CE3DE] text-xs font-bold uppercase tracking-widest">Amount Due</span>
                  <span className="text-white text-2xl font-extrabold">{payingInvoice.amount}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all text-left ${paymentMethod === method ? "border-[#00605A] bg-[#EAF8F8] text-[#00605A]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {paymentMethod === "Bank Transfer (ACH)" ? "Bank Reference / Routing Number" : paymentMethod === "Health Insurance" ? "Insurance Member ID" : "Card Number (last 4 digits)"}
                  </Label>
                  <Input
                    id="card"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder={paymentMethod === "Health Insurance" ? "MEM-XXXX-XXXXX" : "XXXX"}
                    className="rounded-xl"
                    maxLength={paymentMethod === "Credit Card" || paymentMethod === "Debit Card" ? 4 : 20}
                  />
                </div>

                <div className="text-[0.6875rem] text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                  🔒 This is a secure simulation. No real payment will be processed.
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <Button variant="outline" onClick={() => setPayingInvoice(null)} disabled={processing} className="flex-1 rounded-xl font-bold text-xs h-auto py-2.5">
                  Cancel
                </Button>
                <Button onClick={handlePayment} disabled={processing} className="flex-1 rounded-xl bg-[#00605A] hover:bg-[#004f4a] text-white font-bold text-xs h-auto py-2.5">
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[1rem] animate-spin">progress_activity</span>
                      Processing...
                    </span>
                  ) : `Confirm Payment`}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
