'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

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
    <section style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            padding: '5px 16px', borderRadius: 99,
            border: '1px solid var(--g-red)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--g-red)',
            marginBottom: 12,
          }}>
            FAQ
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--g-ink)', margin: 0 }}>
            Common questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--g-cream-border)' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--g-cream-border)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '20px 0',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--g-ink)', paddingRight: 16 }}>
                  {faq.q}
                </span>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 28,
                  border: '1.5px solid var(--g-cream-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: open === i ? 'var(--g-red)' : 'var(--g-ink-soft)',
                  borderColor: open === i ? 'var(--g-red)' : 'var(--g-cream-border)',
                  transition: 'color 0.15s, border-color 0.15s',
                }}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {open === i && (
                <p style={{
                  margin: 0, paddingBottom: 20,
                  fontSize: 15, lineHeight: 1.7, color: 'var(--g-ink-soft)',
                }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
