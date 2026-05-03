const CALENDLY_URL = 'https://calendly.com/processgravity/discovery'

export default function Footer() {
  return (
    <footer
      className="bg-deep-navy px-6 py-16"
      style={{ borderTop: '1px solid rgba(41,121,255,0.25)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Top row: four columns ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1 — Brand */}
          <div className="flex flex-col items-start text-left gap-4">
            {/* Logo + tagline as a single unit */}
            <div className="flex flex-col items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Assets/Process-Gravity-Logo-Text-Only-No-Tagline.png"
                alt="Process Gravity"
                style={{ height: '48px', width: 'auto', maxWidth: '180px', objectFit: 'contain', objectPosition: 'left', display: 'block', marginLeft: 0 }}
              />
              <p className="font-ui text-xs text-white-text/70 tracking-[0.14em] uppercase leading-[1.6]">
                We Build The Engine.<br />You Drive The Business.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-xs text-white-text/40 leading-[1.6]">
                Done for you. Not done to you.
              </p>
              <p className="font-body text-xs text-white-text/40 leading-[1.6]">
                Input once. Run forever. Dashboard daily.
              </p>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div className="flex flex-col gap-4">
            <h4 className="font-ui text-xs uppercase tracking-[0.18em] text-electric-blue">
              Services
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Services">
              {[
                'Free Discovery Audit',
                'Automation & AI Systems',
                'Voice Agent',
                'Growth Partner',
              ].map(item => (
                <a
                  key={item}
                  href="#"
                  className="font-body text-sm text-white-text/60 hover:text-white-text transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 — Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-ui text-xs uppercase tracking-[0.18em] text-electric-blue">
              Company
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Company">
              {[
                ['How It Works', '#how-it-works'],
                ['Client Results', '#results'],
                ['About Us', '#about'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="font-body text-sm text-white-text/60 hover:text-white-text transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 4 — Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="font-ui text-xs uppercase tracking-[0.18em] text-electric-blue">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-white-text/60 hover:text-white-text transition-colors duration-200"
              >
                Book a Free Call
              </a>
              <a
                href="mailto:processgravity@gmail.com"
                className="font-body text-sm text-white-text/60 hover:text-white-text transition-colors duration-200"
              >
                processgravity@gmail.com
              </a>
              <a
                href="https://linkedin.com/company/processgravity"
                aria-label="Process Gravity on LinkedIn"
                className="text-white-text/60 hover:text-white-text transition-colors duration-200 w-fit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom row ───────────────────────────────────────────────── */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="font-ui text-xs text-white-text/40 tracking-[0.06em]">
            © {new Date().getFullYear()} Process Gravity. All rights reserved.
          </p>
          <p className="font-ui text-xs text-white-text/40 tracking-[0.06em]">
            Confidently serving service businesses across Canada.
          </p>
        </div>

      </div>
    </footer>
  )
}
