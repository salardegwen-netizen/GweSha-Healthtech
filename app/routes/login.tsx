import type { Route } from "./+types/login";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { type Role, setRole } from "~/lib/role";
import { api } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In | GweSha HealthTech" },
    { name: "description", content: "Access your GweSha HealthTech portal." },
  ];
}

type RoleTab = { id: Role; label: string; icon: string; description: string; destination: string };

const ROLE_TABS: RoleTab[] = [
  {
    id: "patient",
    label: "Patient",
    icon: "personal_injury",
    description: "Access your health records, appointments & billing",
    destination: "/dashboard",
  },
  {
    id: "admin",
    label: "Admin",
    icon: "admin_panel_settings",
    description: "Full clinic management & staff control",
    destination: "/admin",
  },
];

// Demo credentials per role
const DEMO_CREDENTIALS: Record<Role, { email: string; password: string; name: string }> = {
  patient: { email: "patient@gwesha.com", password: "password", name: "Patient User" },
  admin:   { email: "admin@gwesha.com",   password: "password", name: "Admin User" },
};

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentTab = ROLE_TABS.find(t => t.id === selectedRole)!;
  const demo = DEMO_CREDENTIALS[selectedRole];

  const handleRoleSwitch = (role: Role) => {
    setSelectedRole(role);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call real backend API using the central apiClient
      const response = await api.auth.login(email, password, selectedRole);
      const data = response.data;

      if (data.success && data.data?.token) {
        // Store real token from backend
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setRole(selectedRole);
        navigate(currentTab.destination);
      } else {
        setError(data.message || "Invalid credentials. Use the demo credentials below.");
      }
    } catch (err: any) {
      // Axios errors are handled by interceptors in api.ts, 
      // but we still catch here to show a local state error if needed.
      const msg = err.response?.data?.message || err.message || "Network error. Please check if backend is running on port 8000.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 anim-fade-up" suppressHydrationWarning>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full top-[-20%] left-[-10%]" style={{ background: "radial-gradient(circle, rgba(164,240,239,0.15), transparent 70%)" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-5%]" style={{ background: "radial-gradient(circle, rgba(1,100,100,0.1), transparent 70%)" }} />
      </div>

      <div className="max-w-md w-full space-y-6 p-10 relative z-10" style={{ background: "var(--color-surface-container-lowest)", borderRadius: "2rem", boxShadow: "0 24px 48px rgba(28,28,25,0.06)", border: "1px solid var(--color-outline-variant)" }}>
        
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-10 h-10 bg-[#E8EFFF] text-[#003B95] rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-xl">lock</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2E46] mb-2 font-['Inter',sans-serif]">
            Welcome to GweSha HealthTech
          </h1>
          <p className="text-gray-500 text-sm">Securely access your patient portal</p>
        </div>

        {/* Role Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {ROLE_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleRoleSwitch(tab.id)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  selectedRole === tab.id
                    ? "text-[#003B95] border-b-2 border-[#003B95]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                suppressHydrationWarning
              >
                {tab.label}
              </button>
          ))}
        </div>



        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <span className="material-symbols-outlined text-lg">mail</span>
              </span>
              <input
                id="email-address"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003B95] sm:text-sm"
                placeholder="name@email.com"
                suppressHydrationWarning
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
              <a href="#" className="text-xs font-semibold text-[#003B95] hover:underline">Forgot Password?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <span className="material-symbols-outlined text-lg">key</span>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003B95] sm:text-sm"
                placeholder="••••••••"
                suppressHydrationWarning
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400" suppressHydrationWarning>
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-600 font-bold bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[1rem]">error</span>
              {error}
            </div>
          )}



          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#003B95] hover:bg-[#002D73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003B95] disabled:opacity-60"
            suppressHydrationWarning
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500 uppercase">OR</span>
            </div>
          </div>
          
          <button
            type="button"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003B95]"
            suppressHydrationWarning
          >
            <span className="material-symbols-outlined text-lg">fingerprint</span>
            Sign in with Biometrics
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="border border-dashed border-gray-200 rounded-xl p-3">
          <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-2">Demo Credentials ({currentTab.label})</div>
          <div className="text-[0.6875rem] text-gray-600 font-mono mb-2">
            <div>{demo.email}</div>
            <div>{demo.password}</div>
          </div>
          <button type="button" onClick={fillDemo} className="text-[0.6875rem] font-bold text-[#003B95] hover:underline" suppressHydrationWarning>
            Auto-fill credentials →
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#003B95] hover:underline">
            Register
          </Link>
        </p>

        <div className="flex justify-center items-center gap-1.5 mt-8 text-gray-400 text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          HIPAA COMPLIANT ENVIRONMENT
        </div>
      </div>
    </div>
  );
}
