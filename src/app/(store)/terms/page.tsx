import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read Webship\'s Terms & Conditions.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using Webship ("the Site"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not access the Site. These terms apply to all visitors, users, and customers.',
  },
  {
    title: '2. Use of the Site',
    body: 'You agree to use the Site only for lawful purposes. You may not use the Site in any way that could damage, disable, or impair the Site or interfere with any other party\'s use. Unauthorized use of the Site may give rise to a claim for damages.',
  },
  {
    title: '3. Products & Pricing',
    body: 'All products are subject to availability. Prices are listed in USD and may change at any time without notice. We reserve the right to limit quantities, refuse orders, or cancel orders at our discretion, including after an order has been submitted.',
  },
  {
    title: '4. Orders & Payment',
    body: 'When you place an order, you confirm that all information provided is accurate. Payment is processed at the time of purchase. We accept major credit cards and digital wallets. All transactions are encrypted and secured.',
  },
  {
    title: '5. Shipping & Delivery',
    body: 'We aim to dispatch orders within 1–2 business days. Delivery times vary by location. We are not responsible for delays caused by carriers, customs, or events outside our control. Risk of loss passes to you upon delivery.',
  },
  {
    title: '6. Returns & Refunds',
    body: 'You have 30 days from delivery to return items in original, unused condition. Contact support@webship.com to initiate a return. Refunds are processed within 5–7 business days after we receive the returned item.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on this Site — including text, images, logos, and design — is owned by Webship and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'To the fullest extent permitted by law, Webship shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or products purchased. Our maximum liability is limited to the amount paid for the relevant order.',
  },
  {
    title: '9. Changes to Terms',
    body: 'We reserve the right to update these Terms at any time. Continued use of the Site after changes constitutes your acceptance of the updated terms. We encourage you to review these terms periodically.',
  },
  {
    title: '10. Contact',
    body: 'If you have any questions about these Terms & Conditions, please contact us at support@webship.com.',
  },
]

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 16px', borderRadius: 99,
  border: '1px solid var(--g-red)',
  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--g-red)',
}

export default function TermsPage() {
  return (
    <>
      <section style={{ padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={badgeStyle}>Legal</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--g-ink)', margin: 0 }}>
            Terms &amp; Conditions
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
              Questions? Read our{' '}
              <Link href="/privacy" style={{ color: 'var(--g-red)', textDecoration: 'none' }}>Privacy Policy</Link>{' '}
              or{' '}
              <Link href="/contact" style={{ color: 'var(--g-red)', textDecoration: 'none' }}>contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
