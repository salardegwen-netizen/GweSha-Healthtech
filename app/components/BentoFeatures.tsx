import { Link } from "react-router";

const specialists = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5I2uff4LGusfr5Swhxmt9pBMzT5V_erb6FgpobpyX37KEjsawFT7DkMg7LnDPBtPnJmb4iGyjmczsFcfkMRa8HiML6kD1HnJ2z1M9b17vkWfbqpum0seBQDuCY3bAVpxyibosKdX30x0ttzQeyLw_ImRl7mJuJU-IvMwdGpEoxms2nxwTqRzO1ZbW2UUBqtvN0mMyKPb6NSQwtg3etDVyJF3mc1Wml62zJyaVSsI2l4K629r2D_Lr-4OLM4WabapoxbNxmjdgZhUL",
    alt: "Female doctor",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjI2kWJl8DYMT08M9nfFmW2g2HLSKbfeKJkytpz9_MeL1nVkvqOT0M-pvIJ1_F-98E1rQxsxSSlypgjzqKx6pIkfh6upbVc73i8D4YoasPqp-WtyO5S3sCBpKb0eSFsm4yRLgchUQfpSWafjXFOQEun81TLsuoDR-ekcGRhiNiurDZUZcFXYEjA_gjFtH4NapyrB9gOO10msOOSmAxJpzvWw4HUwSFxO3uOH6Mt9RyKWC5HgTMuEhwI8aylBV9QX2GMIq5Mw8LQQDl",
    alt: "Male doctor",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxQRbQWKdcfI035J4wKa3_2yuRSZJD1elyE1cKiRYaxk4zz39aZ3dbZVRpbntvbV0FBTmS7jHDUv9IDIU6cA_IrdpDmFpV0dhnCpwu2g_Ims9mjWAHglvfS8lYuKX8kVrdGBl8SNrUrtlu0FIdsEFmmQMdHtcAzLZ6P1wMeQvK_HBr0yuTXlJX-I5gWu0ci236jihdsdgE5mfq0CRQJfWU3yhOhB0LRuxEkCnE2N8Xp83W675MVl4OR2pzobZgIz9qtfA-vi4EscnO",
    alt: "Specialist",
  },
];

export default function BentoFeatures() {
  return (
    <section id="wellness" className="section-py">
      <div className="container-xl">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Healthcare Made Simple</h2>
          <p className="text-sm text-gray-600" style={{ color: "var(--color-on-surface-variant)" }}>
            Booking an appointment shouldn't be a hassle. Experience a seamless digital environment that connects you with top medical professionals fast.
          </p>
        </div>

        {/* CSS grid with tight tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-sm lg:auto-rows-[280px]">

          {/* Card 2 — Specialists */}
          <div
            className="relative overflow-hidden p-8 h-full flex flex-col justify-center"
            style={{ background: "var(--color-primary)", borderRadius: "1.5rem" }}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-on-primary)" }}>Top-Rated Doctors</h3>
              <p className="mb-6 opacity-90 text-[0.8125rem]" style={{ color: "var(--color-on-primary)" }}>
                Direct access to primary care physicians and certified medical specialists.
              </p>
              <div className="flex -space-x-2.5">
                {specialists.map((sp, i) => (
                  <img
                    key={i}
                    src={sp.src}
                    alt={sp.alt}
                    className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
                    style={{ borderColor: "var(--color-primary)" }}
                  />
                ))}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[0.625rem] font-bold border-2"
                  style={{
                    borderColor: "var(--color-primary)",
                    background: "var(--color-primary-fixed)",
                    color: "var(--color-on-primary-fixed)",
                  }}
                >
                  +12
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 — Clinical Excellence */}
          <div
            className="flex flex-col justify-center items-center text-center p-8 h-full"
            style={{ background: "var(--color-surface-container-highest)", borderRadius: "1.5rem" }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mb-4"
              style={{ background: "rgba(28,28,25,0.06)", borderRadius: "var(--radius-full)" }}
            >
              <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-tertiary)" }}>local_hospital</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Priority Care</h3>
            <p className="text-[0.8125rem] mb-4" style={{ color: "var(--color-on-surface-variant)" }}>
              Guaranteed shorter wait times and prioritized walk-in support for immediate medical needs.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["URGENT CARE", "WALK-IN", "PEDIATRICS"].map((badge) => (
                <span
                  key={badge}
                  className="text-[0.625rem] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed)" }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4 — Booking */}
          <div
            id="care-plans"
            className="lg:col-span-2 relative overflow-hidden p-8 h-full group flex flex-col justify-center"
            style={{ background: "var(--color-surface-container-low)", borderRadius: "1.5rem" }}
          >
            <div className="grid sm:grid-cols-2 gap-8 items-center h-full">
              <div className="max-w-sm">
                <h3 className="text-xl font-bold mb-3">Same-Day Appointments</h3>
                <p className="mb-5" style={{ color: "var(--color-on-surface-variant)" }}>
                  See a doctor when you need it. Our system finds the earliest available slots near you.
                </p>
                <Link
                  to="/appointment"
                  id="bento-explore-btn"
                  className="inline-flex items-center gap-1.5 font-bold text-[0.8125rem] hover:opacity-80 transition-opacity"
                  style={{ color: "var(--color-primary)" }}
                >
                  Book Available Slot
                  <span className="material-symbols-outlined text-[1.125rem]">arrow_right_alt</span>
                </Link>
              </div>
              <div
                className="p-5 shadow-sm transition-transform group-hover:-translate-y-1"
                style={{ background: "var(--color-surface-container-lowest)", borderRadius: "1rem" }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--color-surface-container)" }}>
                    <span className="font-bold text-[0.8125rem]">Next Available</span>
                    <span className="text-[0.625rem] font-bold" style={{ color: "var(--color-tertiary)" }}>ONLINE NOW</span>
                  </div>
                  {[
                    { label: "General Consultation", time: "14:00 PM", bg: "var(--color-surface-container)" },
                    { label: "Pediatric Check-up", time: "Tomorrow", bg: "rgba(164,240,239,0.3)" },
                  ].map((slot) => (
                    <div
                      key={slot.label}
                      className="flex justify-between items-center p-2.5"
                      style={{ background: slot.bg, borderRadius: "0.5rem" }}
                    >
                      <span className="font-medium text-xs">{slot.label}</span>
                      <span
                        className="text-[0.625rem] font-medium px-2 py-0.5"
                        style={{ background: "var(--color-surface-container-lowest)", borderRadius: "var(--radius-full)", color: "var(--color-on-surface-variant)" }}
                      >
                        {slot.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
