'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Live positions
    const mouse = { x: -200, y: -200 }
    const ringPos = { x: -200, y: -200 }
    let ringSize = 36
    let pulseTween: gsap.core.Tween | null = null
    let raf: number

    // ── Animation loop ──────────────────────────────────────────────────
    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.1
      ringPos.y += (mouse.y - ringPos.y) * 0.1

      dot.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`
      ring.style.transform = `translate(${ringPos.x - ringSize / 2}px, ${ringPos.y - ringSize / 2}px)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // ── Mouse move ──────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    // ── Hover helpers ───────────────────────────────────────────────────
    const setRing = (size: number, bg: string, borderRadius: string, borderColor: string) => {
      ringSize = size
      gsap.to(ring, {
        width: size,
        height: size,
        background: bg,
        borderRadius,
        borderColor,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    const resetRing = () => {
      if (pulseTween) { pulseTween.kill(); pulseTween = null }
      gsap.to(ring, { scale: 1, duration: 0.2 })
      setRing(36, 'transparent', '50%', 'rgba(41,121,255,0.4)')
      gsap.to(dot, { backgroundColor: '#2979ff', duration: 0.2 })
    }

    // ── Delegate hover via event delegation ────────────────────────────
    const onEnter = (e: MouseEvent) => {
      const el = e.target as Element

      if (el.closest('a, button')) {
        setRing(52, 'rgba(0,170,255,0.08)', '50%', 'rgba(0,170,255,0.7)')
        gsap.to(dot, { backgroundColor: '#00aaff', duration: 0.2 })
        return
      }
      if (el.closest('[data-animate="glass-card"]')) {
        setRing(46, 'transparent', '6px', 'rgba(41,121,255,0.5)')
        return
      }
      if (el.closest('#logo-canvas')) {
        setRing(64, 'transparent', '50%', 'rgba(0,170,255,0.5)')
        pulseTween = gsap.to(ring, {
          scale: 1.15,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
    }
    const onLeave = (e: MouseEvent) => {
      const el = e.target as Element
      if (el.closest('a, button') || el.closest('[data-animate="glass-card"]') || el.closest('#logo-canvas')) {
        resetRing()
      }
    }

    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      pulseTween?.kill()
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#2979ff',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
        className="hidden-on-touch"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(41,121,255,0.4)',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
        }}
        className="hidden-on-touch"
      />
      <style>{`
        @media (pointer: coarse) {
          .hidden-on-touch { display: none !important; }
        }
      `}</style>
    </>
  )
}
