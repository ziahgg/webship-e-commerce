'use client'

import Link from 'next/link'
import { ProductCard } from '@/components/store/product/product-card'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string[]
  featured: boolean
  category: { name: string; slug: string }
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null
  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '5px 16px', borderRadius: 99,
              border: '1px solid var(--g-red)',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--g-red)',
              marginBottom: 10,
            }}>
              Picks for you
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--g-ink)', margin: 0, lineHeight: 1.1 }}>
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            style={{ fontSize: 14, color: 'var(--g-ink-soft)', textDecoration: 'none', paddingBottom: 2, borderBottom: '1px solid var(--g-cream-border)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--g-red)'; e.currentTarget.style.borderBottomColor = 'var(--g-red)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--g-ink-soft)'; e.currentTarget.style.borderBottomColor = 'var(--g-cream-border)' }}
          >
            View all →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
