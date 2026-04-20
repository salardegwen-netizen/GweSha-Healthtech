import type { Route } from "./+types/register";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { api } from "~/lib/api";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register Account | Sanctuary Health" },
    { name: "description", content: "Create your Sanctuary Health patient portal account." },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await api.auth.register(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password,
        formData.role,
        formData.password_confirmation
      );

      toast.success("Account created successfully! Logging you in...");
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("role", response.data.data.user.role);

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
        Object.entries(errorData.errors).forEach(([field, messages]: [string, any]) => {
          const msg = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${msg}`);
        });
      } else {
        toast.error(errorData?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 anim-fade-up">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full top-[-10%] right-[-10%]"
          style={{ background: "radial-gradient(circle, rgba(164,240,239,0.15), transparent 70%)" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bottom-[-10%] left-[-5%]"
          style={{ background: "radial-gradient(circle, rgba(1,100,100,0.1), transparent 70%)" }}
        />
      </div>

      <div
        className="max-w-md w-full space-y-8 p-10 relative z-10"
        style={{
          background: "var(--color-surface-container-lowest)",
          borderRadius: "2rem",
          boxShadow: "0 24px 48px rgba(28,28,25,0.06)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div>
          <Link
            to="/"
            className="flex justify-center text-2xl font-bold tracking-tight mb-2"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}
          >
            Sanctuary Health
          </Link>
          <h2 className="text-center text-2xl font-bold tracking-tight" style={{ color: "var(--color-on-surface)" }}>
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
            Begin your restorative journey with us
          </p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="sr-only">First Name</label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors disabled:opacity-50"
                style={{ background: "var(--color-surface)", border: errors.firstName ? "2px solid red" : "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName[0]}</p>}
            </div>
            <div>
              <label htmlFor="last-name" className="sr-only">Last Name</label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors disabled:opacity-50"
                style={{ background: "var(--color-surface)", border: errors.lastName ? "2px solid red" : "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName[0]}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={loading}
              className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors disabled:opacity-50"
              style={{ background: "var(--color-surface)", border: errors.email ? "2px solid red" : "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
              placeholder="Email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              disabled={loading}
              className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors disabled:opacity-50"
              style={{ background: "var(--color-surface)", border: errors.password ? "2px solid red" : "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
              placeholder="Create a password (min 6 characters)"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
          </div>
          <div>
            <label htmlFor="password-confirm" className="sr-only">Confirm Password</label>
            <input
              id="password-confirm"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              autoComplete="new-password"
              required
              disabled={loading}
              className="appearance-none block w-full px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-sm transition-colors disabled:opacity-50"
              style={{ background: "var(--color-surface)", border: errors.password_confirmation ? "2px solid red" : "1px solid var(--color-outline-variant)", color: "var(--color-on-surface)", borderRadius: "1rem" }}
              placeholder="Confirm password"
            />
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>}
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                disabled={loading}
                className="h-4 w-4 rounded disabled:opacity-50"
                style={{ borderColor: "var(--color-outline)", accentColor: "var(--color-primary)" }}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" style={{ color: "var(--color-on-surface-variant)" }}>
                I agree to the{" "}
                <a href="#" className="font-semibold transition-colors hover:underline" style={{ color: "var(--color-primary)" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold transition-colors hover:underline" style={{ color: "var(--color-primary)" }}>
                  Privacy Policy
                </a>.
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-3 text-[0.875rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold transition-colors" style={{ color: "var(--color-primary)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
