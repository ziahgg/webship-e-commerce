import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, ShieldCheck, Heart, Headphones } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Webship — our story, mission, and the values that drive us.',
}

const stats = [
  { value: '1,000+', label: 'Products' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Cities Served' },
  { value: '3+', label: 'Years of Trust' },
]

const values = [
  { icon: ShieldCheck, title: 'Quality First', desc: 'Every product is sourced from verified suppliers and tested to meet our high quality standards before reaching you.' },
  { icon: Heart, title: 'Customer Love', desc: 'We obsess over the customer experience — from browsing to unboxing, every touchpoint is designed with care.' },
  { icon: Truck, title: 'Fast & Reliable', desc: 'Same-day and next-day delivery in major cities. Your order is our priority, and speed is our promise.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Real humans, real help. Our support team is available around the clock to answer any question you have.' },
]

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 16px', borderRadius: 99,
  border: '1px solid var(--g-red)',
  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--g-red)',
}

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: 'var(--g-cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={badgeStyle}>Our Story</div>
          <h1 style={{
            fontSize: 'clamp(44px, 8vw, 96px)', fontWeight: 700,
            lineHeight: 1.0, letterSpacing: '-0.04em',
            color: 'var(--g-ink)', margin: 0,
          }}>
            We&apos;re Webship,{' '}
            <br />
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--g-red)', fontFamily: 'var(--font-display)' }}>
              your trusted store.
            </em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--g-ink-soft)', maxWidth: 520, margin: 0 }}>
            Born from a simple belief: great products should be accessible to everyone, delivered fast and with care.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <Link href="/products" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '12px 28px', borderRadius: 100,
              backgroundColor: 'var(--g-red)', color: '#fff',
              fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>
              Shop Now
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '12px 28px', borderRadius: 100,
              border: '1px solid var(--g-cream-border)', color: 'var(--g-ink)',
              fontSize: 15, textDecoration: 'none',
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Our Story ── */}
      <section style={{ padding: '96px 24px 80px' }}>
        <div className="about-story-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...badgeStyle, alignSelf: 'flex-start' }}>How it started</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--g-ink)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              A small idea that grew into something big
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--g-ink-soft)', margin: 0 }}>
              Webship started in a small room with a big dream — to make online shopping feel personal again. We were tired of impersonal mega-stores where you're just an order number.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--g-ink-soft)', margin: 0 }}>
              So we built something different. A store where quality is non-negotiable, delivery is lightning-fast, and customer support actually feels human. Today, we serve thousands of customers across hundreds of cities — and we're just getting started.
            </p>
          </div>
          {/* Visual */}
          <div style={{
            height: 380, borderRadius: 24,
            backgroundColor: 'var(--g-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ textAlign: 'center', padding: 32 }}>
              <p style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 700, color: 'var(--g-white)', lineHeight: 1, margin: '0 0 12px', letterSpacing: '-0.04em' }}>
                2021
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Founded with a mission</p>
              <div style={{ width: 40, height: 2, backgroundColor: 'var(--g-red)', margin: '20px auto 0', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Stats ── */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--g-cream-alt)', borderTop: '1px solid var(--g-cream-border)', borderBottom: '1px solid var(--g-cream-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={badgeStyle}>By the numbers</div>
          </div>
          <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 48, fontWeight: 700, color: 'var(--g-ink)', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 14, color: 'var(--g-ink-soft)', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Our Values ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ ...badgeStyle, marginBottom: 14 }}>What we stand for</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--g-ink)', margin: 0, letterSpacing: '-0.02em' }}>
              Built on values that matter
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{
                padding: '32px 28px', borderRadius: 20,
                backgroundColor: 'var(--g-cream-alt)',
                border: '1px solid var(--g-cream-border)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: 'var(--g-red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="#fff" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--g-ink)', margin: 0 }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--g-ink-soft)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--g-ink)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--g-white)', margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Ready to experience{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--g-red)', fontFamily: 'var(--font-display)' }}>Webship?</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.65 }}>
            Join thousands of happy customers who trust us for quality products, fast delivery, and honest service.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 100,
              backgroundColor: 'var(--g-red)', color: '#fff',
              fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>
              Shop Now
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 28px', borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)',
              fontSize: 15, textDecoration: 'none',
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
