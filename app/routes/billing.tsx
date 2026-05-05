import type { Route } from "./+types/billing";
import PatientLayout from "~/components/patient/PatientLayout";
import { useData } from "~/lib/DataContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Billing & Payments | GweSha HealthTech" },
  ];
}

export default function Billing() {
  const { invoices } = useData();

  const outstandingBalance = invoices?.reduce((total: number, inv: any) => {
    return inv.status?.toLowerCase() === 'due' ? total + parseFloat(inv.amount || 0) : total;
  }, 0) || 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { month: 'N/A', day: '', year: '' };
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  return (
    <PatientLayout>
      <div className="max-w-[1200px] mx-auto animate-fade-in flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[1.75rem] font-bold text-[#111827] mb-1">Billing & Payments</h1>
          <p className="text-gray-500 text-sm">Manage your health service invoices and payment history.</p>
        </div>

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main Balance Card */}
          <div className="bg-[#1A56DB] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <span className="material-symbols-outlined absolute right-6 top-6 text-[6rem] text-white/10 pointer-events-none">account_balance_wallet</span>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold mb-4 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[1rem]">receipt_long</span> Current Account Status
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Outstanding Balance</p>
              <h2 className="text-[3rem] font-bold leading-none mb-8">₱{outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-white text-[#1A56DB] font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                Pay Now
              </button>
              <button className="bg-white/20 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
                Payment Plan
              </button>
            </div>
          </div>

          {/* Right Cards Stack */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Payment Method */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-[150px]">
                <div className="flex justify-between items-start mb-auto">
                  <h3 className="text-[#003B95] font-bold text-lg leading-tight">Payment<br/>Method</h3>
                  <button className="text-gray-400 hover:text-[#003B95] text-xs font-bold">Edit</button>
                </div>
                <div className="flex items-center gap-3 bg-[#F2F6FF] p-3 rounded-xl mt-4">
                  <span className="material-symbols-outlined text-[#003B95]">credit_card</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Visa ending in 4242</p>
                    <p className="text-[0.65rem] text-gray-500">Expires 12/28</p>
                  </div>
                </div>
              </div>

              {/* Active Insurance */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-[150px]">
                <div className="flex justify-between items-start mb-auto">
                  <h3 className="text-[#003B95] font-bold text-lg leading-tight">Active<br/>Insurance</h3>
                  <button className="text-gray-400 hover:text-[#003B95] text-xs font-bold">Details</button>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl mt-4">
                  <span className="material-symbols-outlined text-[#003B95]">verified_user</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">BlueShield PPO</p>
                    <p className="text-[0.65rem] text-gray-500">Group ID: 99120-XB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Strip */}
            <div className="bg-[#E5EDFF] rounded-2xl p-6 flex justify-between items-center text-center">
              <div className="flex-1 border-r border-[#003B95]/10">
                <p className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Payment</p>
                <p className="text-sm font-bold text-gray-900">$240.00 <span className="text-gray-500 font-normal text-xs">on Oct 12</span></p>
              </div>
              <div className="flex-1 border-r border-[#003B95]/10">
                <p className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-1">Next Due</p>
                <p className="text-sm font-bold text-gray-900">Oct 31, 2023</p>
              </div>
              <div className="flex-1">
                <p className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-1">Statements</p>
                <p className="text-sm font-bold text-gray-900">12 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statements Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#003B95]">Recent Billing Statements</h3>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[1rem]">filter_list</span> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[1rem]">download</span> Export All
              </button>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FA] text-gray-500 text-[0.65rem] font-bold uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices && invoices.length > 0 ? (
                invoices.map((invoice: any) => {
                  const { month, day, year } = formatDate(invoice.date || invoice.created_at);
                  const isDue = invoice.status?.toLowerCase() === 'due';
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">{month} {day},<br/><span className="text-gray-500 text-xs">{year}</span></td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{invoice.description}</p>
                        <p className="text-xs text-gray-500">{invoice.doctor?.name || "Clinic Services"}</p>
                      </td>
                      <td className="px-6 py-4">
                        {isDue ? (
                          <span className="px-2.5 py-1 rounded bg-red-50 text-red-600 text-[0.65rem] font-bold uppercase tracking-wider">Due</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-[#E5EDFF] text-[#003B95] text-[0.65rem] font-bold uppercase tracking-wider">{invoice.status || 'Paid'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">${parseFloat(invoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 flex items-center justify-end gap-6">
                        <button className={`flex items-center gap-2 font-bold text-xs ${isDue ? 'text-[#003B95] hover:underline' : 'text-gray-400 hover:text-gray-600'}`}>
                          <span className="material-symbols-outlined text-[1rem]">picture_as_pdf</span> Download statement PDF
                        </button>
                        {isDue ? (
                          <button className="bg-[#003B95] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#002D7A] transition-colors w-[100px]">
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-bold w-[100px] text-center">Cleared</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No billing statements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 bg-[#F8F9FA]">
            <span>Showing {invoices?.length || 0} statements</span>
            <div className="flex gap-2">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50"><span className="material-symbols-outlined text-[1rem]">chevron_left</span></button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50"><span className="material-symbols-outlined text-[1rem]">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-8 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#F2F6FF] text-[#003B95] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[2.5rem]">support_agent</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Need help with your bill?</h3>
            <p className="text-gray-500 text-sm max-w-xl">If you have questions regarding your insurance coverage or need to set up a monthly payment plan, our billing specialists are here to assist you from Mon-Fri, 8 AM - 6 PM.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-[#003B95] hover:bg-gray-50 transition-colors">Contact Billing</button>
            <button className="px-6 py-3 bg-[#003B95] text-white rounded-xl font-bold hover:bg-[#002D7A] transition-colors">Financial Assistance</button>
          </div>
        </div>

      </div>
    </PatientLayout>
  );
}
