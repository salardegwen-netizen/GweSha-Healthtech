import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden min-h-[85vh] py-20 lg:py-0">
      <div className="container-xl relative z-10 grid lg:grid-cols-2 gap-12 items-center h-full">
        {/* Left content */}
        <div className="max-w-xl anim-fade-up">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-[0.6875rem] font-bold tracking-widest"
            style={{
              background: "var(--color-primary-fixed)",
              color: "var(--color-on-primary-fixed)",
              borderRadius: "var(--radius-full)",
            }}
          >
            <span
              className="material-symbols-outlined text-[1rem]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calendar_month
            </span>
            FAST & EASY BOOKING
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight mb-6"
            style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-headline)", lineHeight: 1 }}
          >
            Book Your{" "}
            <span style={{ color: "var(--color-primary)" }}>Clinic Appointment</span>{" "}
            Today.
          </h1>

          {/* Body */}
          <p
            className="text-sm md:text-base leading-relaxed mb-8 max-w-md anim-fade-up delay-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Skip the waiting room. Schedule an in-person or telehealth visit with our board-certified doctors in minutes. Quality healthcare when you need it most.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 anim-fade-up delay-2">
            <Link to="/appointment" id="hero-schedule-btn" className="btn btn-primary px-6 py-3 anim-glow">
              Book Appointment
              <span className="material-symbols-outlined text-[1.125rem]">event_available</span>
            </Link>
            <button id="hero-learn-more-btn" className="btn btn-ghost px-6 py-3">
              Find a Doctor
              <span className="material-symbols-outlined text-[1.125rem]">search</span>
            </button>
          </div>
        </div>

        {/* Right image (visible on lg+) */}
        <div className="hidden lg:block relative h-[600px] anim-scale-in delay-2">
          <div
            className="w-full h-full overflow-hidden relative"
            style={{ borderRadius: "2rem", boxShadow: "0 24px 48px rgba(28,28,25,0.12)" }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhZYC1orP2J-srVIk5WZVK5FUo5cJO9LPCXxsq65mH_d7FG9Om1mWuDSaIPcrIIz8u2d13fuOJlkCCX6EFJRI0T43ZS7tGVFHC2-oAHOX5uPULT6a67fEjEptaNJm8LobfJ_GgSj5ZaEGzxGv4bjFvnEVQIoLL2WU58aejYfR13w4YvmUkb2s4-m1aklss-uwPdogyzX-BCc1p5cbBQ23hrAffRy6lWdhuTbrgFPu81DJF_34gFVL14NRLdxZUjzTZAvqGBpVpegly"
              alt="Modern clinic interior"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(28,28,25,0.15), transparent 40%)" }}
            />
          </div>

          {/* Floating vitals card */}
          <div
            className="absolute -bottom-6 -left-6 anim-float"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              boxShadow: "0 12px 32px rgba(28,28,25,0.08)",
              minWidth: "240px",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-tertiary-fixed)",
                  color: "var(--color-tertiary)",
                }}
              >
                <span
                  className="material-symbols-outlined text-[1.25rem]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
              <div>
                <p className="text-[0.6875rem] font-semibold text-gray-500 uppercase tracking-wider mb-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                  Verified Reviews
                </p>
                <p className="text-sm font-bold m-0" style={{ color: "var(--color-on-surface)", lineHeight: 1 }}>
                  4.9/5 Average rating
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div
              className="h-1 w-full overflow-hidden"
              style={{ background: "var(--color-surface-container-highest)", borderRadius: "var(--radius-full)" }}
            >
              <div
                className="h-full"
                style={{
                  width: "98%",
                  background: "linear-gradient(to right, var(--color-primary), var(--color-tertiary))",
                  borderRadius: "var(--radius-full)",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[0.625rem] font-medium" style={{ color: "var(--color-on-surface-variant)" }}>Patient Recommendation</span>
              <span className="text-[0.625rem] font-bold" style={{ color: "var(--color-primary)" }}>98%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Blob */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          right: "-200px",
          top: "10%",
          background: "radial-gradient(circle, rgba(1,100,100,0.04), transparent 60%)",
          zIndex: 0,
        }}
      />
    </section>
  );
}
