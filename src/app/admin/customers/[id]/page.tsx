import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { formatCurrency, formatDate, getOrderStatusLabel } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { id } = await params
  const customer = await db.user.findUnique({
    where: { id, role: 'CUSTOMER' },
    select: {
      id: true, name: true, email: true, createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, status: true, total: true, createdAt: true,
          _count: { select: { items: true } },
        },
      },
    },
  })

  if (!customer) notFound()

  const totalSpent = customer.orders
    .filter((o) => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status))
    .reduce((s, o) => s + Number(o.total), 0)

  const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Customers
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm">{customer.name ?? customer.email}</span>
      </div>

      {/* Profile */}
      <div>
        <h1 className="text-2xl font-bold">{customer.name ?? 'Unnamed'}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{customer.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Member Since</p>
          <p className="font-semibold text-sm">{formatDate(customer.createdAt)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
          <p className="font-semibold text-2xl">{customer.orders.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
          <p className="font-semibold text-2xl">{formatCurrency(totalSpent)}</p>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="font-semibold mb-3">Order History</h2>
        {customer.orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customer.orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(-8).toUpperCase()}</span>
                      <p className="text-xs text-muted-foreground">{o._count.items} item{o._count.items !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {getOrderStatusLabel(o.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(o.total))}</td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground hidden sm:table-cell">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/orders/${o.id}`} className="text-xs text-primary hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
