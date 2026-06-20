'use client'

import { useState } from 'react'
import { Mail, Clock, MapPin } from 'lucide-react'

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 16px', borderRadius: 99,
  border: '1px solid var(--g-red)',
  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--g-red)',
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 800))
    setStatus('done')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    borderRadius: 10, border: '1.5px solid var(--g-cream-border)',
    backgroundColor: 'var(--g-white)',
    fontSize: 15, color: 'var(--g-ink)',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  }

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={badgeStyle}>Contact Us</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--g-ink)', margin: 0 }}>
            We&apos;d love to{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--g-red)', fontFamily: 'var(--font-display)' }}>
              hear from you.
            </em>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--g-ink-soft)', margin: 0 }}>
            Have a question, feedback, or need help with an order? Our team is here and ready to help.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section style={{ padding: '0 24px 96px' }}>
        <div className="contact-grid" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ backgroundColor: 'var(--g-cream-alt)', borderRadius: 24, padding: '40px 36px', border: '1px solid var(--g-cream-border)' }}>
            {status === 'done' ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--g-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--g-ink)', margin: 0 }}>Message sent!</h3>
                <p style={{ fontSize: 15, color: 'var(--g-ink-soft)', margin: 0 }}>We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setStatus('idle') }}
                  style={{ marginTop: 8, fontSize: 14, color: 'var(--g-red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--g-ink)', margin: '0 0 4px' }}>Send a message</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--g-ink)', display: 'block', marginBottom: 6 }}>Full Name *</label>
                    <input type="text" required value={form.name} onChange={set('name')} placeholder="John Doe" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--g-ink)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--g-cream-border)')} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--g-ink)', display: 'block', marginBottom: 6 }}>Email *</label>
                    <input type="email" required value={form.email} onChange={set('email')} placeholder="you@email.com" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--g-ink)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--g-cream-border)')} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--g-ink)', display: 'block', marginBottom: 6 }}>Subject</label>
                  <select value={form.subject} onChange={set('subject')} style={{ ...inputStyle, appearance: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--g-ink)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--g-cream-border)')}>
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="return">Return / Refund</option>
                    <option value="product">Product Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--g-ink)', display: 'block', marginBottom: 6 }}>Message *</label>
                  <textarea required value={form.message} onChange={set('message')} placeholder="Tell us how we can help..." rows={5}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
                    onFocus={e => (e.target.style.borderColor = 'var(--g-ink)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--g-cream-border)')} />
                </div>

                <button type="submit" disabled={status === 'loading'} style={{
                  padding: '13px 28px', borderRadius: 100,
                  backgroundColor: 'var(--g-red)', color: '#fff',
                  fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1, transition: 'opacity 0.15s',
                  alignSelf: 'flex-start',
                }}>
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
            {[
              { icon: Mail, title: 'Email Us', lines: ['support@webship.com', 'We reply within 24 hours'] },
              { icon: Clock, title: 'Business Hours', lines: ['Mon – Fri: 9 AM – 6 PM', 'Sat: 10 AM – 4 PM'] },
              { icon: MapPin, title: 'Headquarters', lines: ['Jakarta, Indonesia', 'Serving nationwide'] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} style={{
                padding: '24px', borderRadius: 16,
                backgroundColor: 'var(--g-cream-alt)',
                border: '1px solid var(--g-cream-border)',
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--g-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--g-ink)' }}>{title}</p>
                  {lines.map(l => <p key={l} style={{ margin: 0, fontSize: 13, color: 'var(--g-ink-soft)', lineHeight: 1.7 }}>{l}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
