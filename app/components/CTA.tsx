import { Link } from "react-router";

export default function CTA() {
  return (
    <section className="section-py">
      <div className="container-xl">
        <div
          className="relative overflow-hidden text-center py-16 px-6 lg:px-20 mx-auto max-w-5xl"
          style={{
            background: "linear-gradient(135deg, rgba(1,100,100,0.06), rgba(45,125,125,0.1))",
            borderRadius: "2.5rem",
            border: "1px solid rgba(1,100,100,0.08)",
          }}
        >
          {/* Background blobs */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-50px",
              left: "-50px",
              width: "250px",
              height: "250px",
              background: "radial-gradient(circle, rgba(164,240,239,0.3), transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(1,100,100,0.12), transparent 70%)",
              borderRadius: "50%",
            }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-[0.625rem] font-bold tracking-widest uppercase"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                borderRadius: "var(--radius-full)",
              }}
            >
              <span className="material-symbols-outlined text-[1rem]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Begin Your Journey
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight mb-4 mx-auto leading-tight"
              style={{ color: "var(--color-on-surface)", maxWidth: "600px" }}
            >
              Ready to See a Doctor?
            </h2>
            <p
              className="text-sm mb-8 mx-auto"
              style={{ color: "var(--color-on-surface-variant)", maxWidth: "420px" }}
            >
              Book an appointment online in under two minutes and get the medical care you need, when you need it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/appointment" id="cta-become-patient" className="btn btn-primary px-8 py-3 w-full sm:w-auto justify-center">
                Book Appointment
              </Link>
              <button
                id="cta-speak-expert"
                className="btn btn-ghost px-8 py-3 w-full sm:w-auto justify-center"
                style={{ background: "var(--color-surface-container-lowest)", boxShadow: "0 4px 12px rgba(28,28,25,0.04)" }}
              >
                <span className="material-symbols-outlined text-base">call</span>
                Call Clinic Desk
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { icon: "verified", label: "Board-Certified Specialists" },
                { icon: "lock", label: "HIPAA Secure" },
                { icon: "support_agent", label: "24/7 Support" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-[0.8125rem] font-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                  <span className="material-symbols-outlined text-[1.125rem]" style={{ color: "var(--color-primary)" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
