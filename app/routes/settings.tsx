import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import { toast } from "sonner";
import DashboardNav from "~/components/dashboard/DashboardNav";

export default function PatientSettings() {
  const [settings, setSettings] = useState<any>(() => {
    // Guard against SSR — localStorage not available on server
    if (typeof window === 'undefined') {
      return {
        notifications: { email: true, sms: false, appointments: true, billing: true, health_updates: true },
        privacy: { share_health_records: false, data_collection: true },
        preferences: { language: "en", theme: "light", appointment_reminders: "24h" },
      };
    }
    const saved = localStorage.getItem("patientSettings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      notifications: {
        email: true,
        sms: false,
        appointments: true,
        billing: true,
        health_updates: true,
      },
      privacy: {
        share_health_records: false,
        data_collection: true,
      },
      preferences: {
        language: "en",
        theme: "light",
        appointment_reminders: "24h",
      },
    };
  });

  const [loading, setLoading] = useState(false);

  const updateSettings = async (newSettings: any) => {
    try {
      setLoading(true);
      // Save to localStorage
      localStorage.setItem("patientSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (key: string) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    updateSettings(updated);
  };

  const handlePrivacyToggle = (key: string) => {
    const updated = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    };
    updateSettings(updated);
  };

  const handlePreferenceChange = (key: string, value: string) => {
    const updated = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    };
    updateSettings(updated);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-surface)]">
      <DashboardNav />
      <div className="pt-20 max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]: any) => (
              <div key={key} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === "email" && "Receive notifications via email"}
                    {key === "sms" && "Receive notifications via SMS"}
                    {key === "appointments" && "Get appointment reminders"}
                    {key === "billing" && "Get billing notifications"}
                    {key === "health_updates" && "Get health updates"}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  disabled={loading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-[var(--color-primary)]" : "bg-gray-300"
                  } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]: any) => (
              <div key={key} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === "share_health_records" && "Allow doctors to share your records"}
                    {key === "data_collection" && "Allow us to collect usage data for improvements"}
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle(key)}
                  disabled={loading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-[var(--color-primary)]" : "bg-gray-300"
                  } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handlePreferenceChange("language", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Reminders</label>
              <select
                value={settings.preferences.appointment_reminders}
                onChange={(e) => handlePreferenceChange("appointment_reminders", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
              >
                <option value="24h">24 hours before</option>
                <option value="1h">1 hour before</option>
                <option value="15m">15 minutes before</option>
                <option value="none">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mt-6">
          <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
          <p className="text-sm text-red-700 mb-4">
            These actions cannot be undone. Please be careful.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
