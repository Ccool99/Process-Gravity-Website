'use client'

import dynamic from 'next/dynamic'

const ScrollAnimations = dynamic(() => import('./ScrollAnimations'), { ssr: false })
const CustomCursor     = dynamic(() => import('./CustomCursor'),     { ssr: false })

export default function ClientOnly() {
  return (
    <>
      <CustomCursor />
      <ScrollAnimations />
    </>
  )
}
