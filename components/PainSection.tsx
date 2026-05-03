const statements = [
  {
    headline: 'YOU\'RE BRILLIANT AT YOUR CRAFT. BURIED IN YOUR BUSINESS.',
    body: 'The work piles up while the business you imagined stays just out of reach.',
  },
  {
    headline: 'LEADS FALL THROUGH THE CRACKS WHILE YOU\'RE ON THE TOOLS.',
    body: 'Every missed follow-up is revenue lost forever. That changes today.',
  },
  {
    headline: 'YOU WORK EVENINGS AND WEEKENDS JUST TO STAY EVEN.',
    body: 'There\'s a better way to run this. One that doesn\'t cost you more of yourself.',
  },
]

export default function PainSection() {
  return (
    <section className="bg-deep-navy py-28 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-20">
        {statements.map((s, i) => (
          <div key={i} className="pain-statement flex justify-center">
            <div className="flex items-stretch gap-6 max-w-3xl w-full">
              {/* Vertical accent bar */}
              <div className="w-1 flex-shrink-0 bg-electric-blue" />

              <div>
                <h2 className="font-display text-[28px] md:text-[42px] lg:text-[52px] uppercase tracking-[0.08em] text-white-text leading-[1.15]">
                  {s.headline}
                </h2>
                <p className="font-body font-light font-medium text-white-text/75 mt-6 text-lg leading-[1.7]">
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
