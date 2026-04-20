import { useLocation, Link } from "react-router";

export default function NotFound() {
  const location = useLocation();

  // Return empty response for well-known and other system requests
  if (location.pathname.startsWith("/.well-known") ||
      location.pathname.includes(".json") ||
      location.pathname.includes(".txt")) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-background)" }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--color-primary-fixed)" }}>
          <span className="material-symbols-outlined text-4xl" style={{ color: "var(--color-primary)" }}>search_off</span>
        </div>
        <h1 className="text-5xl font-extrabold mb-2" style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}>404</h1>
        <p className="text-base mb-8" style={{ color: "var(--color-on-surface-variant)" }}>The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="btn btn-primary px-6 py-3"
        >
          <span className="material-symbols-outlined text-[1.125rem]">home</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
