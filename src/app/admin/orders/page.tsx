import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { OrderTable } from '@/components/admin/orders/order-table'
import { serializeOrderRow } from '@/lib/serialize'

const VALID_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { status = '', page = '1' } = await searchParams
  const perPage = 20
  const skip = (parseInt(page) - 1) * perPage

  const where = status && VALID_STATUSES.includes(status)
    ? { status: status as 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' }
    : {}

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    db.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)
  const currentPage = parseInt(page)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{total} total</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {['', ...VALID_STATUSES].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/orders?status=${s}` : '/admin/orders'}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              status === s
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-muted text-muted-foreground'
            }`}
          >
            {s || 'All'}
          </Link>
        ))}
      </div>

      <OrderTable orders={orders.map(serializeOrderRow)} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {skip + 1}–{Math.min(skip + perPage, total)} of {total}</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/orders?status=${status}&page=${currentPage - 1}`}
                className="px-3 py-1 rounded border hover:bg-muted transition-colors"
              >
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/orders?status=${status}&page=${currentPage + 1}`}
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
