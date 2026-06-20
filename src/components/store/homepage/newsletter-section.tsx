'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 600))
    setStatus('done')
  }

  return (
    <section style={{
      padding: '80px 24px',
      backgroundColor: 'var(--g-cream-alt)',
      borderTop: '1px solid var(--g-cream-border)',
    }}>
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>

        <div style={{
          display: 'inline-block',
          padding: '5px 16px', borderRadius: 99,
          border: '1px solid var(--g-red)',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--g-red)',
          marginBottom: 14,
        }}>
          Stay in the loop
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 700, color: 'var(--g-ink)', margin: '0 0 12px', lineHeight: 1.1 }}>
          Get deals in your inbox
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g-ink-soft)', margin: '0 0 32px', lineHeight: 1.6 }}>
          Subscribe and be the first to know about new arrivals, flash sales, and exclusive discounts.
        </p>

        {status === 'done' ? (
          <div style={{
            padding: '18px 28px', borderRadius: 12,
            backgroundColor: 'var(--g-cream)',
            border: '1px solid var(--g-cream-border)',
            fontSize: 15, color: 'var(--g-ink)',
          }}>
            🎉 You're in! We'll send you the best deals.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1, minWidth: 220,
                padding: '13px 16px',
                borderRadius: 100,
                border: '1.5px solid var(--g-cream-border)',
                backgroundColor: 'var(--g-white)',
                fontSize: 15, color: 'var(--g-ink)',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--g-ink)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--g-cream-border)')}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '13px 24px',
                borderRadius: 100,
                backgroundColor: 'var(--g-red)',
                color: '#fff',
                fontSize: 15, fontWeight: 500,
                border: 'none', cursor: 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                transition: 'background-color 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-red-dark)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--g-red)')}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        <p style={{ fontSize: 12, color: 'var(--g-ink-soft)', marginTop: 16 }}>
          No spam, ever. Unsubscribe any time.
        </p>
      </div>
    </section>
  )
}
