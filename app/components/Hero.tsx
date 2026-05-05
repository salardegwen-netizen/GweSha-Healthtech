import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden min-h-[85vh] py-20 lg:py-0">
      <div className="container-xl relative z-10 grid lg:grid-cols-2 gap-12 items-center h-full">
        {/* Left content */}
        <div className="max-w-xl anim-fade-up">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-[0.6875rem] font-bold tracking-widest text-blue-600 bg-blue-100"
            style={{
              borderRadius: "var(--radius-full)",
            }}
          >
            Excellence in Healthcare
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight mb-6 text-[#1A2E46]"
            style={{ fontFamily: "var(--font-headline)", lineHeight: 1.1 }}
          >
            Patient-Centered Care for a <span className="text-[#0D62D1]">Healthier Future</span>
          </h1>

          {/* Body */}
          <p
            className="text-sm md:text-base leading-relaxed mb-8 max-w-md anim-fade-up delay-1 text-gray-600"
          >
            MediClinic provides advanced medical solutions and empathetic care, ensuring you and your family receive world-class treatment in a comfortable environment.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 anim-fade-up delay-2">
            <Link to="/appointment" id="hero-schedule-btn" className="btn bg-[#003B95] text-white px-6 py-3 hover:bg-[#002D73]">
              Book Appointment
            </Link>
            <button id="hero-learn-more-btn" className="btn bg-[#E8EFFF] text-[#003B95] px-6 py-3 hover:bg-[#D1E0FF] font-semibold">
              Our Specialists
            </button>
          </div>
        </div>

        {/* Right image (visible on lg+) */}
        <div className="hidden lg:block relative h-[500px] anim-scale-in delay-2">
          <div
            className="w-full h-full overflow-hidden relative rounded-2xl"
            style={{ boxShadow: "0 24px 48px rgba(28,28,25,0.12)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
              alt="Medical Professional"
              className="w-full h-full object-cover"
            />
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
