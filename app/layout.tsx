import type { Metadata } from 'next'
import { Orbitron, Exo_2, Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import VoiceWidget from '@/components/VoiceWidget'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Process Gravity | AI Automation for Service Businesses',
  description:
    'We give service business owners their evenings and weekends back. Custom AI automation built on your craft knowledge, running 24/7 in the background.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${exo2.variable} ${outfit.variable}`}
    >
      <body className="bg-space-navy text-white-text font-body font-light antialiased">
        {/* SVG grain texture overlay — 4% opacity, non-interactive */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
        {children}
        <VoiceWidget />
        <ChatWidget />

        {/* Vapi SDK — loads after page is interactive. Their default button is
            hidden via CSS; our custom VoiceWidget calls vapiInstance directly. */}
        <style>{`
          /* Hide Vapi's default pill button — we use our own VoiceWidget instead */
          .vapi-btn { display: none !important; }
        `}</style>
        <Script
          id="vapi-sdk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var vapiInstance = null;
              const assistant = "47633597-2470-4433-a6ad-ce4fd69f6df5";
              const apiKey = "be8df4ac-02ea-45ee-9f38-40694c7edab8";
              (function (d, t) {
                var g = document.createElement(t), s = d.getElementsByTagName(t)[0];
                g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
                g.defer = true;
                g.async = true;
                s.parentNode.insertBefore(g, s);
                g.onload = function () {
                  vapiInstance = window.vapiSDK.run({
                    apiKey: apiKey,
                    assistant: assistant,
                    config: { position: "bottom-right", offset: "40px", width: "1px", height: "1px" },
                  });
                  window.vapiInstance = vapiInstance;
                };
              })(document, "script");
            `,
          }}
        />
      </body>
    </html>
  )
}
