import { useState } from "react";
import { Link } from "react-router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-3xl"
      style={{
        background: "rgba(252,249,245,0.85)",
        boxShadow: "0px 6px 24px rgba(28,28,25,0.04)",
      }}
    >
      <div className="container-xl flex justify-between items-center py-4">
        {/* Logo */}
        <a
          href="/"
          className="text-lg md:text-xl font-bold tracking-tight"
          style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}
        >
          GweSha HealthTech
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {["Wellness", "Specialists", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-xs font-semibold tracking-wide transition-colors duration-200"
              style={{ color: "rgba(28,28,25,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(28,28,25,0.65)")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/admin" className="text-xs font-semibold" style={{ color: "rgba(28,28,25,0.65)" }}>
            Admin Access
          </Link>
          <Link to="/login" className="btn btn-primary" id="nav-patient-login">
            Patient Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-menu-toggle"
          className="md:hidden p-1.5 rounded-md hover:bg-surface-container"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ color: "var(--color-on-surface)" }}
        >
          <span className="material-symbols-outlined text-[1.25rem]">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4 shadow-lg border-t"
          style={{ background: "rgba(252,249,245,0.98)", borderColor: "var(--color-surface-container)" }}
        >
          {["Wellness", "Specialists", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-semibold"
              style={{ color: "var(--color-on-surface-variant)" }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-2.5 pt-3 border-t" style={{ borderColor: "var(--color-surface-container-high)" }}>
            <Link to="/admin" className="text-sm font-semibold mb-2" style={{ color: "var(--color-on-surface-variant)" }}>Admin Access</Link>
            <Link to="/login" className="btn btn-primary justify-center w-full">Patient Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
