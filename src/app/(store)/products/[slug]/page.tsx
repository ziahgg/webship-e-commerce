import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/store/product/product-detail'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug }, select: { name: true, description: true, images: true } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.images[0]] },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug, active: true },
    include: {
      category: { select: { name: true, slug: true } },
      variants: { orderBy: [{ name: 'asc' }, { value: 'asc' }] },
    },
  })

  if (!product) notFound()

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    include: {
      category: { select: { name: true, slug: true } },
      variants: { orderBy: [{ name: 'asc' }, { value: 'asc' }] },
    },
    take: 4,
  })

  return <ProductDetail product={product} related={related} />
}
