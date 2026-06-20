import Link from 'next/link'
import { formatCurrency, formatDate, getOrderStatusLabel } from '@/lib/utils'
import type { SerializedOrderRow } from '@/lib/serialize'

type Order = SerializedOrderRow

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

export function OrderTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No orders found.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Customer</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Date</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">View</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(-8).toUpperCase()}</span>
                <p className="text-xs text-muted-foreground">{o._count.items} item{o._count.items !== 1 ? 's' : ''}</p>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <p className="font-medium leading-none">{o.user.name ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.user.email}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-muted text-muted-foreground'}`}>
                  {getOrderStatusLabel(o.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(o.total))}</td>
              <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell text-xs">
                {formatDate(new Date(o.createdAt))}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
