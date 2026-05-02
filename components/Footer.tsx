export default function Footer() {
  return (
    <footer className="bg-deep-navy border-t border-accent-rule px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: logo + tagline */}
        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Assets/Process-Gravity-Logo-Text-Only-No-Tagline.png"
            alt="Process Gravity"
            style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
          />
          <p className="font-ui text-xs text-muted tracking-[0.14em] uppercase">
            WE BUILD THE ENGINE. YOU DRIVE THE BUSINESS.
          </p>
        </div>

        {/* Right: LinkedIn + email */}
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/company/processgravity"
            aria-label="Process Gravity on LinkedIn"
            className="text-chrome hover:text-white-text transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* LinkedIn icon */}
            <svg
              width="20"
              height="20"
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

          <a
            href="mailto:hello@processgravity.com"
            className="font-ui text-sm text-muted hover:text-white-text tracking-[0.06em] transition-colors duration-200"
          >
            hello@processgravity.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-glass-border">
        <p className="font-ui text-xs text-muted tracking-[0.06em]">
          © {new Date().getFullYear()} Process Gravity. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
