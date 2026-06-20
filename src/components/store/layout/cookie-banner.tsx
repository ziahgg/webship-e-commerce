'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'webship_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        width: 'calc(100% - 48px)',
        maxWidth: 680,
        backgroundColor: 'var(--g-ink)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        animation: 'slide-up 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Cookie icon */}
      <span style={{ fontSize: 28, flexShrink: 0 }}>🍪</span>

      {/* Text */}
      <p style={{
        flex: 1, minWidth: 200,
        fontSize: 14, lineHeight: 1.6,
        color: 'rgba(255,255,255,0.75)',
        margin: 0,
      }}>
        We use cookies to improve your experience and analyze site traffic.{' '}
        <Link href="/privacy" style={{ color: 'var(--g-red)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Learn more
        </Link>
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '9px 18px',
            borderRadius: 100,
            backgroundColor: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '9px 20px',
            borderRadius: 100,
            backgroundColor: 'var(--g-red)',
            border: 'none',
            color: '#fff',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-red-dark)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--g-red)')}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
