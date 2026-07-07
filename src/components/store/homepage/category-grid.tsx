'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/generated/prisma/client'

interface Props { categories: Category[] }

export function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) return null

  const [featured, second, third] = categories

  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-block',
            padding: '5px 16px', borderRadius: 99,
            border: '1px solid var(--g-red)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--g-red)',
            marginBottom: 12,
          }}>
            Categories
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 34px)',
            fontWeight: 700, letterSpacing: '-0.02em',
            color: 'var(--g-ink)', margin: 0,
          }}>
            Explore Trending Categories
          </h2>
          <Link
            href="/products"
            style={{ fontSize: 15, color: 'var(--g-red)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            View all
          </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div
          className="category-bento"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 14,
            minHeight: 380,
          }}
        >
          {/* ── Card 1: Featured left (dark, tall, spans 2 rows) ── */}
          <Link
            href={`/products${featured?.slug ? `?category=${featured.slug}` : ''}`}
            style={{
              gridColumn: '1',
              gridRow: '1 / 3',
              backgroundColor: 'var(--g-ink)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: 20,
              textDecoration: 'none',
              position: 'relative',
              minHeight: 360,
            }}
          >
            {/* Category pill tag */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 14px', borderRadius: 99,
                backgroundColor: '#fff', color: 'var(--g-ink)',
                fontSize: 13, fontWeight: 500,
              }}>
                {featured?.name ?? 'Category'}
              </span>
            </div>

            {/* Product image — centered, transparent bg */}
            <div style={{ flex: 1, position: 'relative', margin: '16px 0', minHeight: 180 }}>
              {featured?.image ? (
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 64,
                }}>
                  🛍️
                </div>
              )}
            </div>

            {/* Explore button */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 20px', borderRadius: 99,
              backgroundColor: 'var(--g-red)', color: '#fff',
              fontSize: 14, fontWeight: 500,
              alignSelf: 'flex-start',
            }}>
              Explore products
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>

          {/* ── Card 2: Top right (image left, text right) ── */}
          {second && (
            <Link
              href={`/products?category=${second.slug}`}
              style={{
                gridColumn: '2',
                gridRow: '1',
                backgroundColor: 'var(--g-cream-alt)',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                textDecoration: 'none',
                minHeight: 175,
              }}
            >
              {/* Image left */}
              <div style={{ position: 'relative', width: '45%', flexShrink: 0 }}>
                {second.image ? (
                  <Image
                    src={second.image}
                    alt={second.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="25vw"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--g-cream-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>📦</div>
                )}
              </div>

              {/* Text right */}
              <div style={{ flex: 1, padding: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--g-ink)', margin: 0, lineHeight: 1.25 }}>
                  {second.name}
                </h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 99,
                  backgroundColor: 'var(--g-red)', color: '#fff',
                  fontSize: 13, fontWeight: 500,
                  alignSelf: 'flex-start',
                }}>
                  Explore product
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* ── Card 3: Bottom right (text left, image right) ── */}
          {third && (
            <Link
              href={`/products?category=${third.slug}`}
              style={{
                gridColumn: '2',
                gridRow: '2',
                backgroundColor: 'var(--g-cream-alt)',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row-reverse',
                alignItems: 'stretch',
                textDecoration: 'none',
                minHeight: 175,
              }}
            >
              {/* Image right */}
              <div style={{ position: 'relative', width: '45%', flexShrink: 0 }}>
                {third.image ? (
                  <Image
                    src={third.image}
                    alt={third.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="25vw"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--g-cream-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>📦</div>
                )}
              </div>

              {/* Text left */}
              <div style={{ flex: 1, padding: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--g-ink)', margin: 0, lineHeight: 1.25 }}>
                  {third.name}
                </h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 99,
                  backgroundColor: 'var(--g-red)', color: '#fff',
                  fontSize: 13, fontWeight: 500,
                  alignSelf: 'flex-start',
                }}>
                  Explore product
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* Fallback if only 1 category */}
          {!second && (
            <Link
              href="/products"
              style={{
                gridColumn: '2', gridRow: '1 / 3',
                backgroundColor: 'var(--g-cream-alt)', borderRadius: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none', color: 'var(--g-ink-soft)',
                fontSize: 15,
              }}
            >
              View all products →
            </Link>
          )}
        </div>

      </div>
    </section>
  )
}
