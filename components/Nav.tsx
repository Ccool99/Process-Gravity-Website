'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(12,17,32,0.9)] backdrop-blur-[16px]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Image
          src="/Assets/Process-Gravity-Logo-Text-Only-No-Tagline.png"
          alt="Process Gravity"
          width={0}
          height={0}
          sizes="200px"
          style={{ height: '48px', width: 'auto' }}
          priority
        />

        {/* CTA */}
        <a
          href="#contact"
          className="font-ui text-sm uppercase tracking-[0.12em] px-6 py-2.5 border border-electric-blue text-white-text hover:bg-[rgba(41,121,255,0.15)] transition-colors duration-200"
        >
          BOOK A FREE CALL
        </a>
      </div>
    </nav>
  )
}
