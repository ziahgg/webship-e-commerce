'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  { q: 'How fast is delivery?', a: 'Standard delivery takes 2–4 business days. We offer same-day delivery in select cities and next-day delivery for most major areas. Premium shipping options are available at checkout.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return window. Items must be unused and in original packaging. Simply contact our support team and we\'ll arrange a free pickup.' },
  { q: 'Are the products authentic?', a: 'Absolutely. We source directly from verified manufacturers and authorized distributors. Every product comes with a quality guarantee and authenticity certification.' },
  { q: 'How do I track my order?', a: 'After placing your order, you\'ll receive an email with a tracking link. You can also track in real-time from your account dashboard under "My Orders".' },
  { q: 'Do you offer bulk or wholesale pricing?', a: 'Yes! For orders of 10+ units, we offer special pricing. Contact our sales team at support@webship.com to discuss your requirements.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as digital wallets. All transactions are secured with SSL encryption.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of placement. After that, they enter fulfilment. Contact support immediately and we\'ll do our best to help.' },
  { q: 'How do I apply a discount code?', a: 'Enter your discount code in the "Promo Code" field at checkout before completing payment. Only one code can be applied per order.' },
  { q: 'What happens if my item arrives damaged?', a: 'We\'re sorry to hear that. Please contact us within 48 hours with a photo of the damage and we\'ll send a replacement or full refund immediately — no questions asked.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship nationwide across Indonesia. International shipping is coming soon. Sign up for our newsletter to be notified when it launches.' },
  { q: 'How do I create an account?', a: 'Click "Get Started" in the top navigation and follow the registration steps. An account lets you track orders, save addresses, and access exclusive member deals.' },
  { q: 'Is my personal data safe?', a: 'Yes. We follow strict data protection practices and never sell your information to third parties. Read our Privacy Policy for full details on how we handle your data.' },
]

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 16px', borderRadius: 99,
  border: '1px solid var(--g-red)',
  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--g-red)',
}

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={badgeStyle}>FAQ</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--g-ink)', margin: 0 }}>
            Frequently asked{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--g-red)', fontFamily: 'var(--font-display)' }}>
              questions.
            </em>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--g-ink-soft)', margin: 0 }}>
            Everything you need to know. Can&apos;t find the answer? Contact our support team anytime.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', borderTop: '1px solid var(--g-cream-border)' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--g-cream-border)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--g-ink)', paddingRight: 16 }}>{faq.q}</span>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 99,
                  border: `1.5px solid ${open === i ? 'var(--g-red)' : 'var(--g-cream-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: open === i ? 'var(--g-red)' : 'var(--g-ink-soft)',
                  transition: 'color 0.15s, border-color 0.15s',
                }}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {open === i && (
                <p style={{ margin: 0, paddingBottom: 20, fontSize: 15, lineHeight: 1.75, color: 'var(--g-ink-soft)' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div style={{ maxWidth: 760, margin: '56px auto 0', textAlign: 'center', padding: '40px', backgroundColor: 'var(--g-cream-alt)', borderRadius: 20, border: '1px solid var(--g-cream-border)' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--g-ink)', margin: '0 0 8px' }}>Still have questions?</p>
          <p style={{ fontSize: 15, color: 'var(--g-ink-soft)', margin: '0 0 20px' }}>Our support team is available 24/7 to help you.</p>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 24px', borderRadius: 100,
            backgroundColor: 'var(--g-red)', color: '#fff',
            fontSize: 14, fontWeight: 500, textDecoration: 'none',
          }}>
            Contact Support
          </Link>
        </div>
      </section>
    </>
  )
}
