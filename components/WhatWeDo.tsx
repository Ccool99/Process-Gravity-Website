import { Search, Zap, TrendingUp, type LucideIcon } from 'lucide-react'

const cards: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: 'DIAGNOSE',
    body: 'We map every hour you\'re losing to tasks that shouldn\'t need you.',
    Icon: Search,
  },
  {
    title: 'AUTOMATE',
    body: 'Custom AI systems built on your craft knowledge. Running 24/7 in the background.',
    Icon: Zap,
  },
  {
    title: 'AMPLIFY',
    body: 'Once the weight is lifted, we co-design the growth path you\'ve been deferring for years.',
    Icon: TrendingUp,
  },
]

export default function WhatWeDo() {
  return (
    <section className="bg-space-navy px-6" style={{ paddingTop: '60px', paddingBottom: '48px' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-sky-blue text-center" style={{ marginBottom: '8px' }}>
          HOW WE WORK
        </p>

        {/* Section headline */}
        <h2 className="font-display text-[32px] md:text-[48px] uppercase tracking-[0.08em] text-white-text text-center" style={{ marginBottom: '32px' }}>
          WE BUILD THE ENGINE
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '20px' }}>
          {cards.map(({ title, body, Icon }) => (
            <div
              key={title}
              className="group bg-glass border border-glass-border rounded-xl flex flex-col transition-all duration-300 hover:border-electric-blue hover:shadow-[0_0_40px_rgba(41,121,255,0.2)]"
              style={{ padding: '28px' }}
              data-animate="glass-card"
            >
              {/* Icon */}
              <div className="flex justify-center" style={{ marginBottom: '12px' }}>
                <Icon
                  size={32}
                  color="#00aaff"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,170,255,0.5))' }}
                />
              </div>

              {/* Rule beneath icon */}
              <div className="w-full h-px bg-accent-rule" style={{ marginBottom: '12px' }} />

              {/* Title */}
              <h3 className="font-display text-[24px] uppercase tracking-[0.08em] text-white-text" style={{ marginBottom: '10px' }}>
                {title}
              </h3>

              {/* Body */}
              <p className="font-body font-light text-muted leading-[1.7] text-base">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
