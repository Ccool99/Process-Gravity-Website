'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {

      // ── PAIN statements — slide in from left ──────────────────────────
      gsap.utils.toArray<Element>('.pain-statement').forEach((el, i) => {
        gsap.from(el, {
          x: -70,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      })

      // ── GLASS CARDS — scale + fade + shadow bloom ─────────────────────
      gsap.utils.toArray<Element>('[data-animate="glass-card"]').forEach((el, i) => {
        gsap.from(el, {
          scale: 0.95,
          opacity: 0,
          duration: 0.55,
          delay: i * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })
        // Shadow bloom on entrance
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          onEnter: () => {
            gsap.fromTo(
              el,
              { boxShadow: '0 0 0px rgba(41,121,255,0)' },
              {
                boxShadow: '0 0 48px rgba(41,121,255,0.22)',
                duration: 0.4,
                delay: i * 0.15,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
              }
            )
          },
        })
      })

      // ── PROMISE words — stagger reveal with gradient pour ─────────────
      const promiseWords = gsap.utils.toArray<Element>('[data-promise-word]')
      if (promiseWords.length) {
        gsap.set(promiseWords, { opacity: 0, y: 15 })
        ScrollTrigger.create({
          trigger: '#promise-section',
          start: 'top 70%',
          onEnter: () => {
            gsap.to(promiseWords, {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 1.6 / promiseWords.length,
              ease: 'power2.out',
            })
          },
        })
      }

      // ── STEP NUMBERS — count up on entry ──────────────────────────────
      gsap.utils.toArray<Element>('[data-step-number]').forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.stepNumber ?? '1', 10)
        const obj = { val: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 0.8,
              ease: 'power2.out',
              onUpdate() {
                el.textContent = String(Math.round(obj.val)).padStart(2, '0')
              },
            })
          },
        })
      })

      // ── CLOSING CTA — pulse on entrance ───────────────────────────────
      const ctaSection = document.querySelector('#closing-cta')
      if (ctaSection) {
        const btn = ctaSection.querySelector('a')
        gsap.set(ctaSection, { opacity: 0 })
        ScrollTrigger.create({
          trigger: ctaSection,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(ctaSection, { opacity: 1, duration: 0.6, ease: 'power2.out' })
            gsap.fromTo(
              ctaSection.querySelector('h2'),
              { scale: 1 },
              { scale: 1.025, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            )
            if (btn) {
              gsap.fromTo(
                btn,
                { boxShadow: '0 0 0px rgba(41,121,255,0)' },
                {
                  boxShadow: '0 0 32px rgba(41,121,255,0.8)',
                  duration: 0.4,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power2.out',
                }
              )
            }
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
