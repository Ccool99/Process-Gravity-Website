const steps = [
  {
    number: '01',
    title: 'FREE DISCOVERY CALL',
    desc: 'No pitch. We map your gaps, identify your fastest win, and show you exactly what\'s possible.',
  },
  {
    number: '02',
    title: 'WE BUILD IT FOR YOU',
    desc: 'Custom AI automation delivered into your existing workflow. Zero training. Zero disruption.',
  },
  {
    number: '03',
    title: 'YOU GET YOUR LIFE BACK',
    desc: 'Then we help you think about where you actually want to take this business.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-deep-navy py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-sky-blue mb-4 text-center">
          THE PROCESS
        </p>

        <h2 className="font-display text-[32px] md:text-[48px] uppercase tracking-[0.08em] text-white-text text-center mb-20">
          THREE STEPS. ZERO FRICTION.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Watermark number */}
              <span
                className="absolute -top-6 -left-2 font-display leading-none select-none pointer-events-none text-sky-blue"
                style={{
                  fontSize: '155px',
                  opacity: 0.22,
                  zIndex: 0,
                  textShadow: '0 0 24px rgba(0,170,255,0.2)',
                }}
                aria-hidden="true"
                data-step-number={parseInt(step.number, 10)}
              >
                00
              </span>

              {/* Step content */}
              <div className="relative" style={{ zIndex: 10 }}>
                <h3 className="font-display text-[28px] uppercase tracking-[0.08em] text-white-text leading-tight">
                  {step.title}
                </h3>
                <div className="w-12 h-px bg-accent-rule mt-4 mb-5" />
                <p className="font-body font-light text-muted leading-[1.7] text-base">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
