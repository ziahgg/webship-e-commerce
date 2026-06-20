'use client'

import Link from 'next/link'
import Image from 'next/image'

const corners = [
  {
    src: '/hero-clothes.png',
    alt: 'Fashion',
    label: 'Fashion',
    position: {
      top: 32,
      left: 40,
    },
    rotate: -8,
  },
  {
    src: '/hero-earbuds.png',
    alt: 'Electronics',
    label: 'Electronics',
    position: {
      top: 44,
      right: 40,
    },
    rotate: 6,
  },
  {
    src: '/hero-cap.png',
    alt: 'Accessories',
    label: 'Accessories',
    position: {
      bottom: 48,
      left: 40,
    },
    rotate: -6,
  },
  {
    src: '/hero-watch.png',
    alt: 'Gadgets',
    label: 'Gadgets',
    position: {
      bottom: 44,
      right: 40,
    },
    rotate: 8,
  },
]

export function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Corner product images — desktop only (hidden below lg / 1024px) */}
      {corners.map((c) => (
        <div
          key={c.alt}
          className="hidden lg:block"
          style={{
            position: 'absolute',
            ...c.position,
            transform: `rotate(${c.rotate}deg)`,
            transformOrigin: 'center center',
            zIndex: 0,
          }}
        >
          <Image
            src={c.src}
            alt={c.alt}
            width={180}
            height={180}
            style={{ objectFit: 'contain', display: 'block' }}
            sizes="180px"
            priority
          />
        </div>
      ))}

      {/* Center content */}
      <div
        style={{
          maxWidth: 680,
          textAlign: 'center',
          padding: '80px 24px',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Eyebrow */}
        <div style={{
          display: 'inline-block',
          padding: '5px 16px', borderRadius: 99,
          border: '1px solid var(--g-red)',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--g-red)',
        }}>
          Premium Online Store
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 700,
          lineHeight: 1.03,
          letterSpacing: '-0.035em',
          color: 'var(--g-ink)',
          margin: 0,
        }}>
          Everything you need,{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--g-red)',
              fontFamily: 'var(--font-display)',
              display: 'block',
            }}
          >
            delivered.
          </em>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 17,
          lineHeight: 1.65,
          color: 'var(--g-ink-soft)',
          maxWidth: 460,
          margin: 0,
        }}>
          Thousands of quality products at the best prices. Fast shipping, easy returns, trusted by customers nationwide.
        </p>

        {/* CTA */}
        <Link
          href="/products"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px',
            backgroundColor: 'var(--g-red)',
            color: '#fff',
            fontSize: 15, fontWeight: 500,
            borderRadius: 100,
            textDecoration: 'none',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-red-dark)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--g-red)')}
        >
          Shop Now
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Star rating */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 18 18" fill="var(--g-red)">
                <path d="M9 1.5l2.09 4.26 4.7.68-3.4 3.32.8 4.68L9 12.27l-4.19 2.17.8-4.68-3.4-3.32 4.7-.68L9 1.5z"/>
              </svg>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--g-ink-soft)', margin: 0 }}>
            5 stars · loved by thousands of customers
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0 40px',
          justifyContent: 'center',
          paddingTop: 24,
          borderTop: '1px solid var(--g-cream-border)',
          width: '100%',
          maxWidth: 480,
        }}>
          {[
            { value: '1,000+', label: 'Products' },
            { value: '50K+', label: 'Customers' },
            { value: '500+', label: 'Cities' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--g-ink)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--g-ink-soft)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
