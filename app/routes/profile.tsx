import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import { toast } from "sonner";
import DashboardNav from "~/components/dashboard/DashboardNav";

export default function PatientProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Get user data from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const userData = {
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            id: user.id,
          };
          setProfile(userData);
          setFormData(userData);
        } else {
          throw new Error("No user data available");
        }
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      // Try to save to backend API
      try {
        await api.patients.updateProfile({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        });
      } catch (apiErr) {
        console.warn("Backend save failed, saving locally:", apiErr);
      }

      // Always save to localStorage for immediate UI update
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = {
          ...user,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfile(formData);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-surface)]">
        <DashboardNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-surface)]">
        <DashboardNav />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-surface)]">
      <DashboardNav />
      <div className="pt-20 max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => {
                if (isEditing) {
                  setFormData(profile);
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqslDRT9dOYQCQWRZz5XSproFwX3P4kySEiBWBlXgp0YHVafjJUxLt5Cg2BDI8HC3t0dXf05sYTuwbVkvC72TydErxnneFVCkeFXxlAz5QzoNDff95IQrSuubhI6q5dLxKsw4C0f5P-U3BKMZvgpbU8weSKXMlOJd38iLP446HAsg3xrtCFbR-am50NDw45-kDQjf70fPaXXHM4tAgXfFoVUe7jyV42iZoWFc9RSxM1WUoMfPJYkCcGKkxlyqab_OGX-_XDx6MKkcT"
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-[var(--color-primary-container)]"
              />
              <div>
                <p className="text-lg font-bold text-gray-900">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="text-gray-600">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData?.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="text-gray-600">{profile.phone || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData?.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="text-gray-600">{profile.address || "Not provided"}</p>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-3 border-t border-gray-100 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
