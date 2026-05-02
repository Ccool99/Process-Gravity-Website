'use client'

import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleField() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <Particles
      id="tsparticles"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      options={{
        fpsLimit: 60,
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 70 },
          color: { value: ['#2979ff', '#00aaff', '#4499ff'] },
          opacity: {
            value: { min: 0.08, max: 0.35 },
          },
          size: {
            value: { min: 1, max: 2 },
          },
          move: {
            enable: true,
            speed: 0.25,
            direction: 'none',
            outModes: { default: 'out' },
          },
          links: {
            enable: true,
            distance: 130,
            opacity: 0.06,
            color: '#2979ff',
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'bubble' },
          },
          modes: {
            bubble: {
              distance: 100,
              size: 4,
              opacity: 0,
            },
          },
        },
        detectRetina: true,
      }}
    />
  )
}
