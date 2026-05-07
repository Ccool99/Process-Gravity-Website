'use client'

import { useState, useEffect } from 'react'

// Agent hours (Calgary time, 24h)
const AGENT_HOURS = { start: 8, end: 22 } // 8am to 10pm

function isWithinHours(): boolean {
  const now = new Date()
  const calgary = new Date(now.toLocaleString('en-US', { timeZone: 'America/Edmonton' }))
  const hour = calgary.getHours()
  return hour >= AGENT_HOURS.start && hour < AGENT_HOURS.end
}

// Tell TypeScript that vapiInstance lives on window
declare global {
  interface Window {
    vapiInstance: {
      start: () => void
      stop: () => void
      on: (event: string, callback: () => void) => void
    } | null
  }
}

export default function VoiceWidget() {
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'active'>('idle')
  const [showTooltip, setShowTooltip] = useState(false)
  const [vapiReady, setVapiReady] = useState(false)

  const withinHours = isWithinHours()

  // Poll for vapiInstance to be ready after SDK loads
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.vapiInstance) {
        setVapiReady(true)
        clearInterval(interval)

        // Wire up Vapi events so our button state stays in sync
        window.vapiInstance.on('call-start', () => setCallState('active'))
        window.vapiInstance.on('call-end', () => setCallState('idle'))
        window.vapiInstance.on('error', () => setCallState('idle'))
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (!vapiReady || !window.vapiInstance) return

    if (callState === 'active' || callState === 'connecting') {
      window.vapiInstance.stop()
      setCallState('idle')
      return
    }

    if (!withinHours) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      return
    }

    setCallState('connecting')
    window.vapiInstance.start()
  }

  const tooltipText = !vapiReady
    ? 'Loading voice agent...'
    : !withinHours
    ? 'Available 8am–10pm Calgary time'
    : callState === 'connecting'
    ? 'Connecting...'
    : callState === 'active'
    ? 'Tap to end call'
    : 'Talk to Aria — our AI voice agent'

  const buttonBackground =
    callState === 'active'
      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
      : callState === 'connecting'
      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
      : !vapiReady || !withinHours
      ? 'rgba(41,121,255,0.35)'
      : 'linear-gradient(135deg, #2979ff, #00aaff)'

  const isClickable = vapiReady && (withinHours || callState === 'active' || callState === 'connecting')

  return (
    <>
      <style>{`
        @keyframes pg-voice-pulse {
          0%   { box-shadow: 0 4px 24px rgba(34,197,94,0.4), 0 0 0 0 rgba(34,197,94,0.45); }
          70%  { box-shadow: 0 4px 24px rgba(34,197,94,0.4), 0 0 0 12px rgba(34,197,94,0); }
          100% { box-shadow: 0 4px 24px rgba(34,197,94,0.4), 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes pg-voice-tooltip {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pg-mic-wave {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(1.3); }
        }
        .pg-voice-pulse   { animation: pg-voice-pulse 2s ease-in-out infinite; }
        .pg-voice-tooltip { animation: pg-voice-tooltip 0.15s ease forwards; }
        .pg-mic-bar-1 { animation: pg-mic-wave 0.8s ease-in-out infinite 0s; }
        .pg-mic-bar-2 { animation: pg-mic-wave 0.8s ease-in-out infinite 0.15s; }
        .pg-mic-bar-3 { animation: pg-mic-wave 0.8s ease-in-out infinite 0.3s; }
      `}</style>

      <div style={{ position: 'fixed', bottom: 32, right: 96, zIndex: 1000 }}>

        {showTooltip && (
          <div
            className="pg-voice-tooltip"
            style={{
              position: 'absolute',
              bottom: 66,
              right: 0,
              background: '#0d1830',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '8px 12px',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: '#e8f0fe',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
            }}
          >
            {tooltipText}
            <div style={{
              position: 'absolute',
              bottom: -5,
              right: 20,
              width: 8,
              height: 8,
              background: '#0d1830',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: 'none',
              borderLeft: 'none',
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}

        <button
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={callState === 'active' ? 'End voice call' : 'Start voice call with Process Gravity AI'}
          className={callState === 'active' ? 'pg-voice-pulse' : undefined}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: buttonBackground,
            border: 'none',
            cursor: isClickable ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: callState === 'active'
              ? '0 4px 24px rgba(34,197,94,0.4)'
              : '0 4px 24px rgba(41,121,255,0.25)',
            transition: 'transform 0.2s ease, background 0.3s ease',
          }}
          onMouseDown={e => { if (isClickable) e.currentTarget.style.transform = 'scale(0.95)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {callState === 'active' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {['pg-mic-bar-1', 'pg-mic-bar-2', 'pg-mic-bar-3'].map((cls, i) => (
                <div
                  key={i}
                  className={cls}
                  style={{
                    width: 3,
                    height: [10, 16, 10][i],
                    borderRadius: 2,
                    background: 'white',
                  }}
                />
              ))}
            </div>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="9" y1="22" x2="15" y2="22" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
