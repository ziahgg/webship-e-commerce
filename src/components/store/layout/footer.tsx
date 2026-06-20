'use client'

import Link from 'next/link'
import Image from 'next/image'
const year = new Date().getFullYear()

const socials = [
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#161616"/>
      </svg>
    ),
  },
]

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/cart', label: 'Cart' },
]

const accountLinks = [
  { href: '/login', label: 'Sign In' },
  { href: '/register', label: 'Create Account' },
  { href: '/account/orders', label: 'My Orders' },
  { href: '/account', label: 'Settings' },
]

const headingStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#555',
  margin: '0 0 18px',
}

const linkStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  color: '#777',
  lineHeight: '2.1',
  textDecoration: 'none',
  transition: 'color 0.15s',
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#161616', color: '#fff' }}>

      {/* ── Top nav columns ── */}
      <div
        className="footer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px 48px',
          padding: '52px 48px 40px',
        }}
      >
        {/* Quick Links */}
        <div>
          <p style={headingStyle}>Quick Links</p>
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#777')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Account */}
        <div>
          <p style={headingStyle}>Account</p>
          {accountLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#777')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Follow Us */}
        <div>
          <p style={headingStyle}>Follow Us</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {socials.map(({ svg, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '1px solid #2e2e2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#777',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#555'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#2e2e2e'
                  e.currentTarget.style.color = '#777'
                }}
              >
                {svg}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Giant logo wordmark ── */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0 }}>
        <Image
          src="/logo-footer.png"
          alt="Webship"
          width={1400}
          height={360}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: '1px solid #222',
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
          © {year} Webship. All rights reserved.
        </p>
        <div className="footer-bottom-links" style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'FAQ', href: '/faq' },
            { label: 'Terms & Conditions', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{ fontSize: 13, color: '#555', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  )
}
