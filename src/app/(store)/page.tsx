import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { HeroSection } from '@/components/store/homepage/hero-section'
import { CategoryGrid } from '@/components/store/homepage/category-grid'
import { TestimonialSection } from '@/components/store/homepage/testimonial-section'
import { FeaturedProducts } from '@/components/store/homepage/featured-products'
import { FeaturesSection } from '@/components/store/homepage/features-section'
import { FaqSection } from '@/components/store/homepage/faq-section'
import { NewsletterSection } from '@/components/store/homepage/newsletter-section'

export const metadata: Metadata = {
  title: 'Webship — Quality Products at the Best Prices',
  description: 'Discover thousands of quality products. Fast shipping, easy returns, trusted nationwide.',
}

export const revalidate = 300

export default async function HomePage() {
  const [rawProducts, categories] = await Promise.all([
    db.product.findMany({
      where: { featured: true, active: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    db.category.findMany({ take: 6 }),
  ])

  const featuredProducts = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price.toNumber(),
    comparePrice: p.comparePrice ? p.comparePrice.toNumber() : null,
    images: p.images,
    featured: p.featured,
    category: p.category,
  }))

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />
      <TestimonialSection />
      <FeaturedProducts products={featuredProducts} />
      <FeaturesSection />
      <FaqSection />
      <NewsletterSection />
    </>
  )
}
