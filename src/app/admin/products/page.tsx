import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ProductTable } from '@/components/admin/products/product-table'
import { serializeProductRow } from '@/lib/serialize'
import { Plus } from 'lucide-react'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { q = '', page = '1' } = await searchParams
  const perPage = 20
  const skip = (parseInt(page) - 1) * perPage

  const where = q
    ? { name: { contains: q, mode: 'insensitive' as const } }
    : {}

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    db.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)
  const currentPage = parseInt(page)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="input-base max-w-xs"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors"
        >
          Search
        </button>
      </form>

      <ProductTable initialProducts={products.map(serializeProductRow)} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {skip + 1}–{Math.min(skip + perPage, total)} of {total}
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/products?q=${q}&page=${currentPage - 1}`}
                className="px-3 py-1 rounded border hover:bg-muted transition-colors"
              >
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/products?q=${q}&page=${currentPage + 1}`}
                className="px-3 py-1 rounded border hover:bg-muted transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
