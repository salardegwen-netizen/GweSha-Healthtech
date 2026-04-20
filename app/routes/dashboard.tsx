import type { Route } from "./+types/dashboard";
import DashboardNav from "~/components/dashboard/DashboardNav";
import DashboardHeader from "~/components/dashboard/DashboardHeader";
import NextAppointment from "~/components/dashboard/NextAppointment";
import HealthRecords from "~/components/dashboard/HealthRecords";
import BillingCard from "~/components/dashboard/BillingCard";
import Vitals from "~/components/dashboard/Vitals";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Patient Dashboard - Sanctuary Health" },
    { name: "description", content: "Your personalized patient dashboard" },
  ];
}

export default function Dashboard() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen selection:bg-[var(--color-primary-fixed)] selection:text-[var(--color-on-primary-fixed)]">
      <DashboardNav />

      <main className="pt-32 pb-20 px-8 w-full">
        <DashboardHeader />

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          <NextAppointment />
          <Vitals />
          <HealthRecords />
          <BillingCard />
        </div>
      </main>

      <Footer />

      {/* Floating Assistance Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] rounded-full shadow-[0px_12px_32px_rgba(28,28,25,0.12)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
      </button>
    </div>
  );
}
