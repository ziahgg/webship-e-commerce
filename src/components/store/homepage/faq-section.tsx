'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    q: 'How fast is delivery?',
    a: 'Standard delivery takes 2–4 business days. We offer same-day delivery in select cities and next-day delivery for most major areas. Premium shipping options are available at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day hassle-free return window. Items must be unused and in original packaging. Simply contact our support team and we\'ll arrange a free pickup.',
  },
  {
    q: 'Are the products authentic?',
    a: 'Absolutely. We source directly from verified manufacturers and authorized distributors. Every product comes with a quality guarantee and authenticity certification.',
  },
  {
    q: 'How do I track my order?',
    a: 'After placing your order, you\'ll receive an email with a tracking link. You can also track in real-time from your account dashboard under "My Orders".',
  },
  {
    q: 'Do you offer bulk or wholesale pricing?',
    a: 'Yes! For orders of 10+ units, we offer special pricing. Contact our sales team at support@webship.com to discuss your requirements.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--g-cream)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="faq-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 64,
          alignItems: 'start',
        }}>

          {/* ── Left: heading + CTA ── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 48 }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '5px 16px', borderRadius: 99,
                border: '1px solid var(--g-red)',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--g-red)',
                marginBottom: 24,
              }}>
                FAQ
              </div>
              <h2 style={{
                fontSize: 'clamp(48px, 6vw, 80px)',
                fontWeight: 700, lineHeight: 1.0,
                letterSpacing: '-0.035em',
                color: 'var(--g-ink)', margin: 0,
              }}>
                Frequently<br />asked<br />questions.
              </h2>
            </div>

            {/* CTA bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              backgroundColor: 'var(--g-cream-alt)',
              border: '1px solid var(--g-cream-border)',
              borderRadius: 100,
              padding: '12px 12px 12px 24px',
            }}>
              <p style={{ fontSize: 14, color: 'var(--g-ink-soft)', margin: 0, lineHeight: 1.4 }}>
                Have a question? Let&apos;s discuss it now!
              </p>
              <Link href="/faq" style={{
                flexShrink: 0,
                display: 'inline-flex', alignItems: 'center',
                padding: '10px 20px', borderRadius: 100,
                backgroundColor: 'var(--g-ink)', color: '#fff',
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}>
                Browse FAQ
              </Link>
            </div>
          </div>

          {/* ── Right: dark accordion ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--g-ink)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  transition: 'background-color 0.15s',
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 24px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open === i ? 'var(--g-red)' : 'rgba(255,255,255,0.5)',
                    fontSize: 22, lineHeight: 1, fontWeight: 300,
                    transition: 'color 0.15s, transform 0.25s',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>
                    +
                  </span>
                </button>
                {open === i && (
                  <p style={{
                    margin: 0,
                    padding: '0 24px 20px',
                    fontSize: 14, lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.55)',
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
