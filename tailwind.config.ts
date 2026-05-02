import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'space-navy': '#0c1120',
        'deep-navy': '#0d1830',
        'blade-blue': '#1a4fbd',
        'electric-blue': '#2979ff',
        'sky-blue': '#00aaff',
        'orb-blue': '#4499ff',
        'accent-rule': '#0088ff',
        chrome: '#a8c0d6',
        'chrome-light': '#dce8f0',
        'white-text': '#e8f0fe',
        muted: 'rgba(232,240,254,0.5)',
        glass: 'rgba(255,255,255,0.04)',
        'glass-border': 'rgba(255,255,255,0.07)',
        'blue-glow': 'rgba(41,121,255,0.25)',
        'sky-glow': 'rgba(0,170,255,0.2)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Orbitron', 'sans-serif'],
        ui: ['var(--font-ui)', 'Exo 2', 'sans-serif'],
        body: ['var(--font-body)', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
