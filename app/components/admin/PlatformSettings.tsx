import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { api } from "~/lib/api";

type Tab = "Clinic Profile" | "Billing Configuration" | "Notifications" | "Security & Access";

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("Clinic Profile");
  const [loading, setLoading] = useState(true);
  const [savingClinic, setSavingClinic] = useState(false);
  const [savingBilling, setSavingBilling] = useState(false);

  // Clinic Profile
  const [clinicForm, setClinicForm] = useState({ clinicName: "Sanctuary Health", email: "admin@sanctuaryhealth.com", contact: "+1 (555) 019-3821", address: "1200 Wellness Ave, San Francisco, CA" });

  // Billing
  const [billingForm, setBillingForm] = useState({ taxId: "US-TAX-8829-1001", billingCycle: "Monthly", paymentMethod: "ACH Bank Transfer", currency: "USD" });

  // Notifications (toggles)
  const [notifications, setNotifications] = useState({ emailAlerts: true, smsAlerts: false, appointmentReminders: true, billingAlerts: true, systemUpdates: false });

  // Security
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: "30", requirePasswordReset: false });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await api.settings.get();
        const data = response.data.data;

        if (data) {
          setClinicForm({
            clinicName: data.clinic_name || "Sanctuary Health",
            email: data.clinic_email || "admin@sanctuaryhealth.com",
            contact: data.clinic_phone || "+1 (555) 019-3821",
            address: data.clinic_address || "1200 Wellness Ave, San Francisco, CA",
          });

          setBillingForm({
            taxId: data.tax_id || "US-TAX-8829-1001",
            billingCycle: data.billing_cycle || "Monthly",
            paymentMethod: data.payment_method || "ACH Bank Transfer",
            currency: data.currency || "USD",
          });

          setNotifications({
            emailAlerts: data.email_alerts ?? true,
            smsAlerts: data.sms_alerts ?? false,
            appointmentReminders: data.appointment_reminders ?? true,
            billingAlerts: data.billing_alerts ?? true,
            systemUpdates: data.system_updates ?? false,
          });

          setSecurity({
            twoFactor: data.two_factor ?? true,
            sessionTimeout: String(data.session_timeout ?? "30"),
            requirePasswordReset: data.require_password_reset ?? false,
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveClinic = async () => {
    try {
      setSavingClinic(true);
      await api.settings.updateClinicProfile({
        clinic_name: clinicForm.clinicName,
        clinic_email: clinicForm.email,
        clinic_phone: clinicForm.contact,
        clinic_address: clinicForm.address,
      });
      toast.success("Clinic profile updated successfully");
    } catch (err) {
      console.error("Failed to save clinic profile:", err);
      toast.error("Failed to save clinic profile");
    } finally {
      setSavingClinic(false);
    }
  };

  const handleSaveBilling = async () => {
    try {
      setSavingBilling(true);
      await api.settings.updateBillingConfig({
        tax_id: billingForm.taxId,
        billing_cycle: billingForm.billingCycle,
        payment_method: billingForm.paymentMethod,
        currency: billingForm.currency,
      });
      toast.success("Billing configuration updated successfully");
    } catch (err) {
      console.error("Failed to save billing config:", err);
      toast.error("Failed to save billing configuration");
    } finally {
      setSavingBilling(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await api.settings.updateNotifications({
        email_alerts: notifications.emailAlerts,
        sms_alerts: notifications.smsAlerts,
        appointment_reminders: notifications.appointmentReminders,
        billing_alerts: notifications.billingAlerts,
        system_updates: notifications.systemUpdates,
      });
      toast.success("Notification preferences updated successfully");
    } catch (err) {
      console.error("Failed to save notifications:", err);
      toast.error("Failed to update notification preferences");
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await api.settings.updateSecurity({
        two_factor: security.twoFactor,
        session_timeout: parseInt(security.sessionTimeout),
        require_password_reset: security.requirePasswordReset,
      });
      toast.success("Security settings updated successfully");
    } catch (err) {
      console.error("Failed to save security settings:", err);
      toast.error("Failed to update security settings");
    }
  };

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error("All password fields are required.");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password changed successfully.");
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  const tabs: Tab[] = ["Clinic Profile", "Billing Configuration", "Notifications", "Security & Access"];

  const renderForm = () => {
    switch (activeTab) {
      case "Clinic Profile":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Clinic Name</label>
                <input type="text" value={clinicForm.clinicName} onChange={(e) => setClinicForm({...clinicForm, clinicName: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Registration Number</label>
                <input type="text" defaultValue="MED-891-2290" disabled className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 cursor-not-allowed outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Primary Email Address</label>
              <input type="email" value={clinicForm.email} onChange={(e) => setClinicForm({...clinicForm, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Support Contact</label>
              <input type="tel" value={clinicForm.contact} onChange={(e) => setClinicForm({...clinicForm, contact: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Clinic Address</label>
              <input type="text" value={clinicForm.address} onChange={(e) => setClinicForm({...clinicForm, address: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
              <Button onClick={() => setClinicForm({ clinicName: "Sanctuary Health", email: "admin@sanctuaryhealth.com", contact: "+1 (555) 019-3821", address: "1200 Wellness Ave, San Francisco, CA" })} variant="outline" className="rounded-lg text-xs font-bold h-auto py-2">Discard Changes</Button>
              <Button onClick={handleSaveClinic} disabled={savingClinic} className="rounded-lg text-xs font-bold bg-[#00605A] hover:bg-[#004f4a] text-white h-auto py-2">{savingClinic ? "Saving..." : "Save Configuration"}</Button>
            </div>
          </div>
        );

      case "Billing Configuration":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tax ID / EIN</label>
                <input type="text" value={billingForm.taxId} onChange={(e) => setBillingForm({...billingForm, taxId: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Currency</label>
                <select value={billingForm.currency} onChange={(e) => setBillingForm({...billingForm, currency: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none bg-white">
                  <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Billing Cycle</label>
              <div className="flex gap-3">
                {["Monthly", "Quarterly", "Annually"].map(cycle => (
                  <button key={cycle} onClick={() => setBillingForm({...billingForm, billingCycle: cycle})} className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${billingForm.billingCycle === cycle ? "border-[#00605A] bg-[#EAF8F8] text-[#00605A]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{cycle}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Default Payment Method</label>
              <select value={billingForm.paymentMethod} onChange={(e) => setBillingForm({...billingForm, paymentMethod: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none bg-white">
                <option>ACH Bank Transfer</option><option>Credit Card</option><option>Wire Transfer</option><option>Insurance Direct</option>
              </select>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
              <Button onClick={handleSaveBilling} disabled={savingBilling} className="rounded-lg text-xs font-bold bg-[#00605A] hover:bg-[#004f4a] text-white h-auto py-2">{savingBilling ? "Saving..." : "Save Billing Config"}</Button>
            </div>
          </div>
        );

      case "Notifications":
        const toggles: { key: keyof typeof notifications; label: string; desc: string }[] = [
          { key: "emailAlerts",          label: "Email Alerts",           desc: "Receive critical system alerts via email" },
          { key: "smsAlerts",            label: "SMS Notifications",      desc: "Text alerts for urgent patient events" },
          { key: "appointmentReminders", label: "Appointment Reminders",  desc: "Auto-send reminders 24h before appointments" },
          { key: "billingAlerts",        label: "Billing Alerts",         desc: "Notify on overdue and new invoice events" },
          { key: "systemUpdates",        label: "System Update Notices",  desc: "Announcements for platform updates" },
        ];
        return (
          <div className="space-y-4">
            {toggles.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-bold text-gray-800">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
                <button
                  onClick={() => {
                    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
                    toast(notifications[key] ? `${label} disabled.` : `${label} enabled.`, { icon: notifications[key] ? "🔕" : "🔔" });
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${notifications[key] ? "bg-[#00605A]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSaveNotifications} className="rounded-lg text-xs font-bold bg-[#00605A] hover:bg-[#004f4a] text-white h-auto py-2">Save Preferences</Button>
            </div>
          </div>
        );

      case "Security & Access":
        return (
          <div className="space-y-6">
            {/* 2FA + Session */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <div className="text-sm font-bold text-gray-800">Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500 mt-0.5">Require a second factor for all admin logins</div>
                </div>
                <button
                  onClick={() => {
                    setSecurity(s => ({ ...s, twoFactor: !s.twoFactor }));
                    toast(security.twoFactor ? "2FA disabled — account less secure." : "2FA enabled.", { icon: security.twoFactor ? "⚠️" : "🔐" });
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors ${security.twoFactor ? "bg-[#00605A]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${security.twoFactor ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <div className="text-sm font-bold text-gray-800">Force Password Reset on Next Login</div>
                  <div className="text-xs text-gray-500 mt-0.5">All admin users will be prompted to change passwords</div>
                </div>
                <button
                  onClick={() => setSecurity(s => ({ ...s, requirePasswordReset: !s.requirePasswordReset }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${security.requirePasswordReset ? "bg-[#00605A]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${security.requirePasswordReset ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Session Timeout (minutes)</label>
                <div className="flex gap-3">
                  {["15", "30", "60", "120"].map(t => (
                    <button key={t} onClick={() => setSecurity(s => ({ ...s, sessionTimeout: t }))} className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${security.sessionTimeout === t ? "border-[#00605A] bg-[#EAF8F8] text-[#00605A]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{t}m</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Change Admin Password</div>
              <div className="space-y-3">
                <input type="password" placeholder="Current password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
                <input type="password" placeholder="New password" value={passwordForm.newPass} onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
                <input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#00605A] focus:outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button onClick={handleSaveSecurity} variant="outline" className="rounded-lg text-xs font-bold h-auto py-2">Save Security Settings</Button>
                <Button onClick={handleChangePassword} className="rounded-lg text-xs font-bold bg-[#00605A] hover:bg-[#004f4a] text-white h-auto py-2">Update Password</Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mt-8 relative mb-12">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      ) : (
        <>
          <Badge className="absolute -top-3 left-6 z-10 bg-[#00605A] text-white hover:bg-[#00605A] border-none px-4 shadow-md font-bold uppercase tracking-wider text-[0.6875rem]">System Configuration</Badge>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-2 flex flex-col space-y-1">
              {tabs.map(tab => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant="ghost"
                  className={`justify-start text-sm font-bold w-full rounded-xl transition-colors ${activeTab === tab ? "bg-[#EAF8F8] text-[#00605A] hover:bg-[#D5EFEF]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100">
            <CardHeader className="border-b border-gray-50 pb-5">
              <CardTitle className="text-lg font-bold font-[var(--font-headline)] text-gray-900">{activeTab}</CardTitle>
              <CardDescription className="text-xs text-gray-500">Manage the {activeTab.toLowerCase()} properties and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {renderForm()}
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
