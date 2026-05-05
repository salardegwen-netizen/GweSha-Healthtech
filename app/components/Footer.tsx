const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "HIPAA Compliance", href: "#" },
  { label: "Accessibility", href: "#" },
];

const socialLinks = [
  { icon: "language", label: "Website", href: "#" },
  { icon: "mail", label: "Email", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-surface-container-low)" }}>
      <div className="max-w-7xl mx-auto px-8 py-6 w-full">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-6">
          
          {/* Brand column */}
          <div className="md:w-1/3">
            <div className="text-base font-bold mb-2 tracking-tight" style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}>
              MediClinic
            </div>
            <p className="text-xs leading-relaxed max-w-xs mb-4" style={{ color: "var(--color-on-surface-variant)" }}>
              Where advanced clinical expertise meets the warmth of intentional hospitality. Your path to restorative care starts here.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-7 h-7 flex items-center justify-center transition-colors"
                  style={{ background: "var(--color-surface-container)", borderRadius: "var(--radius-full)", color: "var(--color-on-surface-variant)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-primary)";
                    e.currentTarget.style.color = "var(--color-on-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-surface-container)";
                    e.currentTarget.style.color = "var(--color-on-surface-variant)";
                  }}
                >
                  <span className="material-symbols-outlined text-[0.8125rem]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-24 xl:gap-32 md:w-2/3 md:justify-end">
            {/* Navigation column */}
            <div>
              <h4 className="font-bold text-[0.6875rem] uppercase tracking-wider mb-3" style={{ color: "var(--color-on-surface)" }}>Navigate</h4>
              <ul className="space-y-2 m-0 p-0 list-none">
                {["Wellness", "Specialists", "Care Plans", "Locations"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-xs transition-colors"
                      style={{ color: "var(--color-on-surface-variant)", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-on-surface-variant)")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div>
              <h4 className="font-bold text-[0.6875rem] uppercase tracking-wider mb-3" style={{ color: "var(--color-on-surface)" }}>Contact</h4>
              <div className="space-y-2.5">
                {[
                  { icon: "location_on", text: "123 Wellness Blvd, CA" },
                  { icon: "call", text: "+1 (800) 724-6268" },
                  { icon: "mail", text: "care@sanctuaryhealth.com" },
                ].map((c) => (
                  <div key={c.icon} className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }}>{c.icon}</span>
                    <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--color-outline-variant)" }}>
          <p className="text-[0.625rem] m-0" style={{ color: "rgba(28,28,25,0.5)" }}>
            © 2024 MediClinic Professional Healthcare. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[0.625rem] transition-colors"
                style={{ color: "rgba(28,28,25,0.55)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-tertiary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(28,28,25,0.55)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
