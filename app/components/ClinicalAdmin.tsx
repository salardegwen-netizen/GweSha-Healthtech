const features = [
  {
    icon: "prescriptions",
    title: "Digital Prescriptions",
    desc: "Get your prescriptions sent directly to your local pharmacy immediately after your visit.",
  },
  {
    icon: "science",
    title: "Lab Results & Imaging",
    desc: "Access all your test results securely online as soon as they are finalized by out lab partners.",
  },
  {
    icon: "folder_managed",
    title: "Secure Medical Records",
    desc: "Your complete health history, visit notes, and paperwork are securely stored and accessible anytime.",
  },
];

export default function AdvancedCare() {
  return (
    <section id="technology" className="section-py" style={{ background: "var(--color-surface-container-low)" }}>
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image side */}
          <div className="relative max-w-lg mx-auto lg:mx-0 w-full">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACs7Jf1x1cOFKOobdP5y-IZo8hYPUwu91_8muegtP63Q-6TmUHtabS-vjy0B9yqcGB2-ROyZ141qNC2Zj77jCGmkHmyD1_oGMK5em6XBVIam64GlJ4G-h5RlbcyWBCwzGGSxtb-2xAr80wYW6LKQlqST2jNio1IWlJkOVsGk0UtGnF8TKJKDHPCWyv68OM7GADB-kso-oL6uqEO_kQemN5SqreCfuiqK10BAbLixW24Fo-7mkTAkbBoEa20ePVBrKDISXnuCuODu5w"
              alt="Advanced Clinical Technology"
              className="w-full object-cover rounded-2xl shadow-xl"
            />
            {/* Stat overlay */}
            <div
              className="absolute bottom-4 right-4 sm:-right-4 flex items-center gap-3 px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                borderRadius: "1rem",
                boxShadow: "0 8px 24px rgba(28,28,25,0.08)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ background: "var(--color-primary-fixed)", borderRadius: "var(--radius-full)" }}
              >
                <span className="material-symbols-outlined text-sm" style={{ color: "var(--color-primary)" }}>trending_up</span>
              </div>
              <div>
                <p className="text-[0.625rem] font-medium uppercase tracking-wide mb-0.5" style={{ color: "var(--color-on-surface-variant)" }}>Recovery Rate</p>
                <p className="text-sm font-bold m-0" style={{ color: "var(--color-on-surface)" }}>+34% vs. Ind</p>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="max-w-xl mx-auto lg:mx-0">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 text-[0.625rem] font-bold tracking-widest uppercase"
              style={{ background: "var(--color-surface-container-highest)", color: "var(--color-on-surface-variant)", borderRadius: "var(--radius-full)" }}
            >
              <span className="material-symbols-outlined text-[1rem]">medical_services</span>
              Patient-First Care
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-balance">
              Comprehensive Medical Services
            </h2>
            <p className="text-sm mb-8 text-balance" style={{ color: "var(--color-on-surface-variant)" }}>
              Whether you need a routine check-up, urgent care, or chronic disease management, our clinics are equipped to provide the highest standard of medical attention.
            </p>

            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.icon} className="flex gap-3 items-start">
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-surface-container-lowest)", borderRadius: "0.5rem", color: "var(--color-primary)", boxShadow: "0 2px 8px rgba(1,100,100,0.05)" }}
                  >
                    <span className="material-symbols-outlined text-[1.125rem]">{f.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-0.5">{f.title}</h4>
                    <p className="text-[0.8125rem]" style={{ color: "var(--color-on-surface-variant)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
