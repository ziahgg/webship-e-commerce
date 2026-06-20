import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read Webship\'s Privacy Policy and how we handle your data.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly: name, email address, shipping address, and payment information when you register or place an order. We also collect usage data such as pages visited, browser type, IP address, and device information automatically.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to process orders, send order confirmations and shipping updates, provide customer support, send marketing emails (with your consent), improve our website and services, and comply with legal obligations.',
  },
  {
    title: '3. Sharing Your Information',
    body: 'We do not sell, trade, or rent your personal information to third parties. We share data only with trusted service providers (payment processors, shipping carriers, analytics providers) who are contractually bound to keep it confidential.',
  },
  {
    title: '4. Cookies & Tracking',
    body: 'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, analyze site traffic, and deliver relevant content. You can control cookies through your browser settings, though some features may not function correctly without them.',
  },
  {
    title: '5. Data Security',
    body: 'We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications by clicking "unsubscribe" in any email or contacting us directly. To exercise these rights, email support@webship.com.',
  },
  {
    title: '7. Data Retention',
    body: 'We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Order records are kept for 5 years for tax and accounting purposes. You may request deletion of your account at any time.',
  },
  {
    title: '8. Children\'s Privacy',
    body: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.',
  },
  {
    title: '9. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or a prominent notice on our website. The date at the top of this page indicates when the policy was last updated.',
  },
  {
    title: '10. Contact Us',
    body: 'If you have questions about this Privacy Policy or how we handle your data, contact our Privacy Team at support@webship.com. We aim to respond to all privacy inquiries within 48 hours.',
  },
]

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 16px', borderRadius: 99,
  border: '1px solid var(--g-red)',
  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--g-red)',
}

export default function PrivacyPage() {
  return (
    <>
      <section style={{ padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={badgeStyle}>Legal</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--g-ink)', margin: 0 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'var(--g-ink-soft)', margin: 0 }}>Last updated: June 2026</p>
        </div>
      </section>

      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ borderBottom: '1px solid var(--g-cream-border)', paddingBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--g-ink)', margin: '0 0 12px' }}>{s.title}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--g-ink-soft)', margin: 0 }}>{s.body}</p>
            </div>
          ))}

          <div style={{ textAlign: 'center', paddingTop: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--g-ink-soft)', marginBottom: 16 }}>
              Questions? See our{' '}
              <Link href="/terms" style={{ color: 'var(--g-red)', textDecoration: 'none' }}>Terms & Conditions</Link>{' '}
              or{' '}
              <Link href="/contact" style={{ color: 'var(--g-red)', textDecoration: 'none' }}>contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
