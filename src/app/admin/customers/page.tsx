import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { CustomerTable } from '@/components/admin/customers/customer-table'

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { q = '', page = '1' } = await searchParams
  const perPage = 20
  const skip = (parseInt(page) - 1) * perPage

  const where = {
    role: 'CUSTOMER' as const,
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [rawCustomers, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
          select: { total: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    db.user.count({ where }),
  ])

  const customers = rawCustomers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    createdAt: c.createdAt,
    orderCount: c._count.orders,
    totalSpent: c.orders.reduce((s, o) => s + Number(o.total), 0),
  }))

  const totalPages = Math.ceil(total / perPage)
  const currentPage = parseInt(page)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{total} registered</p>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email..."
          className="input-base max-w-xs"
        />
        <button type="submit" className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors">
          Search
        </button>
      </form>

      <CustomerTable customers={customers} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {skip + 1}–{Math.min(skip + perPage, total)} of {total}</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link href={`/admin/customers?q=${q}&page=${currentPage - 1}`} className="px-3 py-1 rounded border hover:bg-muted transition-colors">
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link href={`/admin/customers?q=${q}&page=${currentPage + 1}`} className="px-3 py-1 rounded border hover:bg-muted transition-colors">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
