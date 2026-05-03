'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import gsap from 'gsap'

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })

export default function Hero() {
  // ── Hero entrance sequence ─────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial hidden states
      gsap.set('#logo-canvas',       { opacity: 0, scale: 0.92 })
      gsap.set('#hero-rule',          { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('#hero-headline',      { opacity: 0, y: 50 })
      gsap.set('#hero-subheadline',   { opacity: 0, y: 30 })
      gsap.set('#hero-buttons',       { opacity: 0, y: 20 })
      gsap.set('#hero-tagline',       { opacity: 0 })

      const tl = gsap.timeline({ delay: 0.15 })
      tl.to('#logo-canvas',     { opacity: 1, scale: 1,  duration: 0.8, ease: 'power2.out' })
        .to('#hero-rule',        { scaleX: 1,             duration: 0.3, ease: 'power2.out' }, 0.3)
        .to('#hero-headline',    { opacity: 1, y: 0,      duration: 0.5, ease: 'power2.out' }, 0.4)
        .to('#hero-subheadline', { opacity: 1, y: 0,      duration: 0.5, ease: 'power2.out' }, 0.6)
        .to('#hero-buttons > *', {
            opacity: 1, y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
          }, 0.75)
        .to('#hero-tagline',     { opacity: 1,             duration: 0.4, ease: 'power2.out' }, 0.9)
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-0 pt-20">
      {/* Particle field — full viewport, z-0 */}
      <div id="particle-canvas" className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <ParticleField />
      </div>

      <div className="relative flex flex-col items-center w-full" style={{ zIndex: 10 }}>
        {/* Logo canvas — LogoScene (Three.js) mounts here */}
        <div id="logo-canvas" style={{ marginBottom: '56px', background: 'transparent', overflow: 'visible' }}>
          <img
            src="/Assets/Process-Gravity-Logo-final.png"
            alt="Process Gravity"
            style={{
              display: 'block',
              width: '75vw',
              maxWidth: '900px',
              height: 'auto',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Accent rule */}
        <div id="hero-rule" className="w-20 h-px bg-accent-rule mb-10" />

        {/* Headline */}
        <h1
          id="hero-headline"
          className="font-display text-[30px] md:text-[44px] uppercase tracking-[0.08em] text-white-text leading-[1.1] max-w-[760px] mx-auto px-6 mb-7"
        >
          WHAT WOULD YOU DO WITH 15 EXTRA HOURS A WEEK?
        </h1>

        {/* Sub-headline */}
        <p
          id="hero-subheadline"
          className="font-body font-light text-xl text-white-text/80 mt-3 leading-[1.7] max-w-[580px] mx-auto px-6 mb-10"
        >
          We give service business owners their evenings and weekends back. Then we
          help them build the business they always believed was possible.
        </p>

        {/* Buttons */}
        <div id="hero-buttons" className="flex flex-wrap gap-4 justify-center mb-8 px-6">
          <a
            href="#contact"
            className="font-ui text-sm uppercase tracking-[0.08em] font-medium px-8 py-4 bg-gradient-to-r from-electric-blue to-sky-blue text-white rounded-[4px] hover:opacity-90 transition-opacity duration-200"
          >
            BOOK YOUR FREE DISCOVERY CALL
          </a>
          <a
            href="#how-it-works"
            className="font-ui text-sm uppercase tracking-[0.08em] px-8 py-4 border border-sky-blue text-white-text hover:bg-[rgba(0,170,255,0.08)] transition-colors duration-200"
          >
            SEE HOW IT WORKS
          </a>
        </div>

        {/* Reassurance line */}
        <p
          id="hero-tagline"
          className="font-ui text-xs text-accent-rule tracking-[0.15em]"
          style={{ fontVariant: 'small-caps' }}
        >
          NO PITCH. NO CONTRACT. JUST A CONVERSATION.
        </p>
      </div>
    </section>
  )
}
