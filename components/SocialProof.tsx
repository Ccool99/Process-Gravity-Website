// Replace with real testimonials after first 2–3 client wins

const testimonials = [
  {
    quote:
      'Working with Process Gravity was the first time someone actually understood how our business ran. They didn\'t just automate tasks — they removed the ones that were quietly killing us.',
    name: 'J. Hartley',
    role: 'Electrical Contractor',
  },
  {
    quote:
      'We were manually following up on every lead. Now that system runs on its own and we\'ve recovered jobs we would have lost. The ROI was obvious within the first month.',
    name: 'S. Park',
    role: 'Park Landscaping',
  },
  {
    quote:
      'I started this business to do the work I love, not to be buried in admin at 9pm. That\'s actually my life now — just the good parts.',
    name: 'M. Torres',
    role: 'Independent Consultant',
  },
]

export default function SocialProof() {
  return (
    <section className="bg-space-navy py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-sky-blue mb-4 text-center">
          CLIENT RESULTS
        </p>

        <h2 className="font-display text-[28px] md:text-[40px] uppercase tracking-[0.08em] text-white-text text-center mb-16">
          WHAT HAPPENS AFTER
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-glass border border-glass-border rounded-xl p-10 flex flex-col justify-between gap-8"
              data-animate="glass-card"
            >
              <p className="font-body font-light text-muted leading-[1.8] text-base italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-glass-border pt-6">
                <p
                  className="font-ui text-sm text-sky-blue tracking-[0.12em]"
                  style={{ fontVariant: 'small-caps' }}
                >
                  {t.name}
                </p>
                <p className="font-ui text-xs text-muted tracking-[0.08em] mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
