import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const firstName = user.name ? user.name.split(" ")[0] : "there";
      setUserName(firstName);
    }
  }, []);

  return (
    <header className="mb-16 flex flex-col md:flex-row md:items-end justify-start md:justify-between gap-8">
      <div className="space-y-2 text-left flex-1">
        <h1 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-on-surface)] text-left">
          Welcome back, <span className="text-[var(--color-primary)] italic">{userName}</span>.
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-base text-left">
          Your restorative journey is on track. You have one upcoming session this week.
        </p>
      </div>
      <button
        onClick={() => navigate("/appointment")}
        className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 shadow-[0px_12px_32px_rgba(1,100,100,0.2)] hover:scale-[1.02] active:scale-95 transition-transform whitespace-nowrap cursor-pointer">
        <span className="material-symbols-outlined text-[1.25rem]">calendar_add_on</span>
        Book Appointment
      </button>
    </header>
  );
}
