import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import PainSection from '@/components/PainSection'
import WhatWeDo from '@/components/WhatWeDo'
import ThePromise from '@/components/ThePromise'
import HowItWorks from '@/components/HowItWorks'
import SocialProof from '@/components/SocialProof'
import ClosingCTA from '@/components/ClosingCTA'
import Footer from '@/components/Footer'
import ClientOnly from '@/components/ClientOnly'

export default function Home() {
  return (
    <>
      <ClientOnly />
      <Nav />
      <main>
        <Hero />
        <PainSection />
        <WhatWeDo />
        <ThePromise />
        <HowItWorks />
        <SocialProof />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
