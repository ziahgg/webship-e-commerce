import { Navbar } from '@/components/store/layout/navbar'
import { Footer } from '@/components/store/layout/footer'
import { CookieBanner } from '@/components/store/layout/cookie-banner'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--g-cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
