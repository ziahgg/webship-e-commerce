import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { ProductCard } from '@/components/store/product/product-card'
import { ProductFilters } from '@/components/store/product/product-filters'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = { title: 'Product Catalog' }
export const revalidate = 60

interface Props {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const { q, category, minPrice, maxPrice, page = '1' } = params
  const pageNum = Math.max(1, parseInt(page, 10))
  const perPage = 12

  const [products, categories, total] = await Promise.all([
    db.product.findMany({
      where: {
        active: true,
        ...(q && { name: { contains: q, mode: 'insensitive' } }),
        ...(category && { category: { slug: category } }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * perPage,
      take: perPage,
    }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
    db.product.count({
      where: {
        active: true,
        ...(q && { name: { contains: q, mode: 'insensitive' } }),
        ...(category && { category: { slug: category } }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      },
    }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {total} product{total !== 1 ? 's' : ''}{q ? ` for "${q}"` : ''}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try a different keyword or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    p === pageNum ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProductsPageSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
