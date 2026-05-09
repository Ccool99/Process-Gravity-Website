'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const WEBHOOK_URL = 'https://n8n.dipakkdutta.com/webhook/pg-chatbot'

const OPENING_MESSAGE =
  "Hey there — welcome to Process Gravity. I'm here to answer any questions you have about what we do and whether we might be a fit for your business. What's your name?"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  showBookingButton?: boolean
  calendlyUrl?: string
}

interface ConversationEntry {
  role: string
  content: string
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatMessage(text: string): string {
  // Escape HTML entities first to prevent XSS, then apply markdown transforms
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

type LeadCaptureStage = 'none' | 'asking_name' | 'asking_email' | 'captured'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([])
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [leadCaptureStage, setLeadCaptureStage] = useState<LeadCaptureStage>('none')
  const pendingCalendlyUrl = useRef('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSessionId(crypto.randomUUID())
  }, [])

  useEffect(() => {
    if (isOpen && !hasOpenedBefore) {
      setMessages([{ role: 'assistant', content: OPENING_MESSAGE, timestamp: new Date().toISOString() }])
      setHasOpenedBefore(true)
    }
  }, [isOpen, hasOpenedBefore])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [isOpen])

  useEffect(() => {
    if (!isLoading && isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isLoading, isOpen])

  const sendMessage = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || isLoading) return

    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date().toISOString() }])
    setInputValue('')

    // Handle lead capture stages locally — no webhook call
    if (leadCaptureStage === 'asking_name') {
      setVisitorName(text)
      setLeadCaptureStage('asking_email')
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Thanks ${text}! And the best email to reach you at?`,
          timestamp: new Date().toISOString(),
        },
      ])
      return
    }

    if (leadCaptureStage === 'asking_email') {
      setVisitorEmail(text)
      setLeadCaptureStage('captured')
      // Append the full lead capture exchange so subsequent webhook calls have complete context
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: "Before I pull up the booking link — can I grab your first name so our team can personalise the follow-up?" },
        { role: 'user', content: visitorName },
        { role: 'assistant', content: `Thanks ${visitorName}! And the best email to reach you at?` },
        { role: 'user', content: text },
        { role: 'assistant', content: "Perfect. Here's the link to book a time that works for you — no pitch, just a conversation." },
      ])
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Perfect. Here's the link to book a time that works for you — no pitch, just a conversation.",
          timestamp: new Date().toISOString(),
          showBookingButton: true,
          calendlyUrl: pendingCalendlyUrl.current,
        },
      ])
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          visitorName,
          visitorEmail,
          conversationHistory,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()

      // Only trigger local lead capture if we don't already have name and email from N8N
      const currentName = data.visitorName || visitorName
      const currentEmail = data.visitorEmail || visitorEmail

      const claudeAlreadyAsksForEmail = data.response.toLowerCase().includes('email')
      const triggerLeadCapture =
        (data.intent === 'booking' || data.intent === 'escalation') &&
        data.readyForEmail === true &&
        leadCaptureStage === 'none' &&
        !currentEmail &&
        !claudeAlreadyAsksForEmail

      if (triggerLeadCapture) {
        pendingCalendlyUrl.current = data.calendlyUrl ?? ''
        // If we already have the name, skip to asking for email
        if (currentName) {
          setLeadCaptureStage('asking_email')
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.response,
              timestamp: new Date().toISOString(),
            },
            {
              role: 'assistant',
              content: `Thanks ${currentName}! What's the best email to reach you at so our team can follow up personally?`,
              timestamp: new Date().toISOString(),
            },
          ])
        } else {
          setLeadCaptureStage('asking_name')
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.response,
              timestamp: new Date().toISOString(),
            },
            {
              role: 'assistant',
              content:
                "Before I pull up the booking link — can I grab your first name so our team can personalise the follow-up?",
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toISOString(),
            showBookingButton: data.showBookingButton,
            calendlyUrl: data.calendlyUrl,
          },
        ])
      }

      if (data.conversationHistory) setConversationHistory(data.conversationHistory)
      // Update visitor name and email from N8N extraction if not already captured locally
      if (data.visitorName && !visitorName) setVisitorName(data.visitorName)
      if (data.visitorEmail && !visitorEmail) setVisitorEmail(data.visitorEmail)
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. Please email us at hello@processgravity.com or try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, sessionId, conversationHistory, leadCaptureStage, visitorName, visitorEmail])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <style>{`
        @keyframes pg-pulse-ring {
          0%   { box-shadow: 0 4px 24px rgba(41,121,255,0.4), 0 0 0 0 rgba(41,121,255,0.45); }
          70%  { box-shadow: 0 4px 24px rgba(41,121,255,0.4), 0 0 0 12px rgba(41,121,255,0); }
          100% { box-shadow: 0 4px 24px rgba(41,121,255,0.4), 0 0 0 0 rgba(41,121,255,0); }
        }
        @keyframes pg-window-open {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes pg-dot {
          0%, 60%, 100% { transform: translateY(0);   opacity: 0.4; }
          30%           { transform: translateY(-5px); opacity: 1;   }
        }
        @keyframes pg-status {
          0%, 100% { opacity: 1;   }
          50%      { opacity: 0.4; }
        }
        @keyframes pg-booking-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .pg-launcher-pulse { animation: pg-pulse-ring 2.5s ease-in-out infinite; }
        .pg-window         { animation: pg-window-open 0.25s ease forwards; }
        .pg-dot-1          { animation: pg-dot 1.2s ease infinite 0s;   }
        .pg-dot-2          { animation: pg-dot 1.2s ease infinite 0.2s; }
        .pg-dot-3          { animation: pg-dot 1.2s ease infinite 0.4s; }
        .pg-status-dot     { animation: pg-status 2s ease-in-out infinite; }
        .pg-booking-btn    { animation: pg-booking-in 0.3s ease forwards; }
        .pg-messages::-webkit-scrollbar       { width: 2px; }
        .pg-messages::-webkit-scrollbar-track { background: transparent; }
        .pg-messages::-webkit-scrollbar-thumb { background: #2979ff; border-radius: 2px; }
        .pg-input::placeholder { color: rgba(232,240,254,0.5); }
        @media (max-width: 480px) {
          .pg-window {
            width:         100vw !important;
            height:        70vh  !important;
            bottom:        0     !important;
            right:         0     !important;
            left:          0     !important;
            border-radius: 16px 16px 0 0 !important;
          }
        }
      `}</style>

      {/* ── Launcher button ───────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open Process Gravity chat'}
        className={isOpen ? undefined : 'pg-launcher-pulse'}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2979ff, #00aaff)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(41,121,255,0.4)',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* ── Chat window ───────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="pg-window"
          style={{
            position: 'fixed',
            bottom: 100,
            right: 32,
            width: 380,
            height: 520,
            background: '#0c1120',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(41,121,255,0.1)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'rgba(41,121,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <Image
              src="/Assets/Process-Gravity-Logo-transparent.png"
              alt="Process Gravity"
              width={32}
              height={32}
              style={{ borderRadius: 6, objectFit: 'contain', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#e8f0fe',
                  lineHeight: 1.2,
                }}
              >
                Process Gravity AI
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'rgba(232,240,254,0.5)',
                  marginTop: 2,
                }}
              >
                Typically replies instantly
              </div>
            </div>
            <div
              className="pg-status-dot"
              title="Online"
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                flexShrink: 0,
              }}
            />
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="pg-messages"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Bubble */}
                <div
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #2979ff, #00aaff)',
                          borderRadius: '12px 12px 4px 12px',
                          padding: '12px 16px',
                          maxWidth: '80%',
                          fontFamily: 'var(--font-body)',
                          fontSize: 14,
                          color: 'white',
                          lineHeight: 1.55,
                          wordBreak: 'break-word',
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '12px 12px 12px 4px',
                          padding: '12px 16px',
                          maxWidth: '85%',
                          fontFamily: 'var(--font-body)',
                          fontSize: 14,
                          color: '#e8f0fe',
                          lineHeight: 1.55,
                          wordBreak: 'break-word',
                        }
                  }
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />

                {/* Timestamp */}
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    color: 'rgba(232,240,254,0.5)',
                    marginTop: 4,
                  }}
                >
                  {formatTime(msg.timestamp)}
                </div>

                {/* Booking button */}
                {msg.role === 'assistant' && msg.showBookingButton && msg.calendlyUrl && (
                  <a
                    href={msg.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pg-booking-btn"
                    style={{
                      display: 'block',
                      width: '85%',
                      background: 'linear-gradient(135deg, #2979ff, #00aaff)',
                      color: 'white',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      padding: '10px 16px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      marginTop: 8,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    BOOK YOUR FREE DISCOVERY CALL
                  </a>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px 12px 12px 4px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="pg-dot-1" style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#2979ff' }} />
                    <span className="pg-dot-2" style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#2979ff' }} />
                    <span className="pg-dot-3" style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#2979ff' }} />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'rgba(232,240,254,0.5)',
                    }}
                  >
                    Process Gravity AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="pg-input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e8f0fe',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                minWidth: 0,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: inputValue.trim() && !isLoading ? '#2979ff' : 'rgba(41,121,255,0.25)',
                border: 'none',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
