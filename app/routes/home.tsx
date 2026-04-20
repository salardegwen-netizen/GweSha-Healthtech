import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import Hero from "~/components/Hero";
import BentoFeatures from "~/components/BentoFeatures";
import ClinicalAdmin from "~/components/ClinicalAdmin";
import CTA from "~/components/CTA";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sanctuary Health | Your Path to Restorative Care" },
    {
      name: "description",
      content:
        "Experience a sanctuary where advanced clinical expertise meets the warmth of intentional hospitality. Schedule your consultation today.",
    },
    { name: "keywords", content: "restorative care, health clinic, wellness, specialists, patient portal" },
    { property: "og:title", content: "Sanctuary Health | Your Path to Restorative Care" },
    { property: "og:description", content: "Advanced clinical expertise meets intentional hospitality." },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
  return (
    <div style={{ background: "var(--color-background)", color: "var(--color-on-surface)" }}>
      <Navbar />
      <main style={{ paddingTop: "5rem" }}>
        <Hero />
        <BentoFeatures />
        <ClinicalAdmin />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
