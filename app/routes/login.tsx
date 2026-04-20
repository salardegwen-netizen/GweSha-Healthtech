import type { Route } from "./+types/login";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { type Role, setRole } from "~/lib/role";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In | Sanctuary Health" },
    { name: "description", content: "Access your Sanctuary Health portal." },
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
  patient: { email: "patient@sanctuary.com", password: "password", name: "Patient User" },
  admin:   { email: "admin@sanctuary.com",   password: "password", name: "Admin User" },
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
      // Call real backend API
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        // Store real token from backend
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setRole(selectedRole);
        navigate(currentTab.destination);
      } else {
        setError(data.message || "Invalid credentials. Use the demo credentials below.");
      }
    } catch (err) {
      setError("Network error. Please check if backend is running on port 8000.");
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 anim-fade-up">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full top-[-20%] left-[-10%]" style={{ background: "radial-gradient(circle, rgba(164,240,239,0.15), transparent 70%)" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-5%]" style={{ background: "radial-gradient(circle, rgba(1,100,100,0.1), transparent 70%)" }} />
      </div>

      <div className="max-w-md w-full space-y-6 p-10 relative z-10" style={{ background: "var(--color-surface-container-lowest)", borderRadius: "2rem", boxShadow: "0 24px 48px rgba(28,28,25,0.06)", border: "1px solid var(--color-outline-variant)" }}>
        
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}>
            Sanctuary Health
          </Link>
          <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>Sign in to your portal</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleRoleSwitch(tab.id)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === tab.id
                  ? "bg-white shadow-sm text-[#00605A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="material-symbols-outlined text-[1.375rem]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Role Description */}
        <div className="flex items-start gap-3 bg-[#EAF8F8] rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-[#00605A] text-[1.25rem] mt-0.5">info</span>
          <div>
            <div className="text-xs font-bold text-[#00605A]">{currentTab.label} Portal</div>
            <div className="text-[0.6875rem] text-[#00605A]/70 mt-0.5">{currentTab.description}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="text"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 font-bold bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[1rem]">error</span>
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded" style={{ borderColor: "var(--color-outline)", accentColor: "var(--color-primary)" }} />
              <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: "var(--color-on-surface-variant)" }}>Remember me</label>
            </div>
            <a href="#" className="text-sm font-semibold transition-colors" style={{ color: "var(--color-primary)" }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-3 text-[0.875rem] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[1.125rem] animate-spin">progress_activity</span> Signing in...</span>
            ) : (
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[1.125rem]">login</span> Sign in as {currentTab.label}</span>
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="border border-dashed border-gray-200 rounded-xl p-3">
          <div className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-2">Demo Credentials ({currentTab.label})</div>
          <div className="text-[0.6875rem] text-gray-600 font-mono mb-2">
            <div>{demo.email}</div>
            <div>{demo.password}</div>
          </div>
          <button type="button" onClick={fillDemo} className="text-[0.6875rem] font-bold text-[#00605A] hover:underline">
            Auto-fill credentials →
          </button>
        </div>

        {selectedRole === "patient" && (
          <p className="text-center text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold transition-colors" style={{ color: "var(--color-primary)" }}>
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
