'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FeaturesSection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: 99,
            border: '1px solid var(--g-red)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--g-red)',
            marginBottom: 20,
          }}>
            Why Webship
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--g-ink)', margin: '0 0 14px',
          }}>
            Why customers choose Webship
          </h2>
          <p style={{ fontSize: 16, color: 'var(--g-ink-soft)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Exceptional service and unparalleled product quality that set the standard for online shopping.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 1.1fr 1fr',
          gridTemplateRows: 'minmax(280px, auto) minmax(260px, auto)',
          gap: 12,
        }}>

          {/* ── Card 1: Left tall (spans 2 rows) ── */}
          <div style={{
            gridColumn: '1',
            gridRow: '1 / 3',
            backgroundColor: 'var(--g-cream-alt)',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            gap: 16,
          }}>
            {/* Inner image inset card */}
            <div style={{
              flex: 1,
              backgroundColor: 'var(--g-cream)',
              borderRadius: 14,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 240,
            }}>
              <Image
                src="/hero-clothes.png"
                alt="Fashion"
                fill
                style={{ objectFit: 'contain', padding: 24 }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Text + button */}
            <div style={{ padding: '4px 8px 8px' }}>
              <p style={{
                fontSize: 20, fontWeight: 700, color: 'var(--g-ink)',
                lineHeight: 1.3, margin: '0 0 18px',
              }}>
                Handpicked products, delivered with care and built to impress.
              </p>
              <Link
                href="/products"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 20px',
                  backgroundColor: 'var(--g-ink)', color: '#fff',
                  fontSize: 14, fontWeight: 500,
                  borderRadius: 100, textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-ink-mid)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--g-ink)')}
              >
                Explore Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Card 2: Top middle (dark + earbuds image) ── */}
          <div style={{
            gridColumn: '2',
            gridRow: '1',
            backgroundColor: 'var(--g-ink)',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 280,
          }}>
            <Image
              src="/hero-earbuds.png"
              alt="Electronics"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center', padding: 32 }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Dark gradient overlay for text readability */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(17,17,17,0.85) 40%, transparent 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px' }}>
              <p style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.35, margin: 0 }}>
                <span style={{ color: '#fff' }}>Trusted by </span>
                <span style={{ color: 'rgba(255,255,255,0.38)' }}>50,000+ satisfied customers worldwide.</span>
              </p>
            </div>
          </div>

          {/* ── Card 3: Top right (light + stat + watch) ── */}
          <div style={{
            gridColumn: '3',
            gridRow: '1',
            backgroundColor: 'var(--g-cream-alt)',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 280,
            padding: '24px 20px',
          }}>
            <p style={{
              fontSize: 64, fontWeight: 700, color: 'var(--g-ink)',
              lineHeight: 1, margin: '0 0 8px', letterSpacing: '-0.03em',
            }}>
              1K+
            </p>
            <p style={{ fontSize: 14, color: 'var(--g-ink-soft)', margin: 0, lineHeight: 1.5 }}>
              Products available in our store.
            </p>
            {/* Watch image — bottom-right, overflows edge */}
            <div style={{
              position: 'absolute',
              bottom: -8, right: -8,
              width: 160, height: 180,
            }}>
              <Image
                src="/hero-watch.png"
                alt="Smart Watch"
                fill
                style={{ objectFit: 'contain', objectPosition: 'bottom right' }}
                sizes="160px"
              />
            </div>
          </div>

          {/* ── Card 4: Bottom right wide (dark + cap image) ── */}
          <div style={{
            gridColumn: '2 / 4',
            gridRow: '2',
            backgroundColor: 'var(--g-ink)',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 260,
            display: 'flex',
            alignItems: 'flex-end',
          }}>
            {/* Cap image — right side */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 24,
            }}>
              <div style={{ position: 'relative', width: 240, height: 220 }}>
                <Image
                  src="/hero-cap.png"
                  alt="Accessories"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="240px"
                />
              </div>
            </div>
            {/* Text left */}
            <div style={{ position: 'relative', zIndex: 1, padding: '24px 28px', maxWidth: '58%' }}>
              <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, margin: 0 }}>
                <span style={{ color: '#fff' }}>Elevates your lifestyle </span>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                  and upgrades your everyday with style and precision.
                </span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
