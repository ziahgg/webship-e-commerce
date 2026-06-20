import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderStatusSelect } from '@/components/admin/orders/order-status-select'
import { ChevronLeft } from 'lucide-react'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { orderBy: { productName: 'asc' } },
    },
  })

  if (!order) notFound()

  const address = order.shippingAddress as {
    name?: string; street?: string; city?: string; state?: string; zip?: string; country?: string
  } | null

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Orders
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Order Detail</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="rounded-lg border bg-card p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Customer</p>
          <p className="font-medium">{order.user.name ?? 'Unknown'}</p>
          <p className="text-sm text-muted-foreground">{order.user.email}</p>
          <Link href={`/admin/customers/${order.user.id}`} className="text-xs text-primary hover:underline">
            View customer →
          </Link>
        </div>

        {/* Shipping address */}
        {address && (
          <div className="rounded-lg border bg-card p-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Shipping Address</p>
            <p className="font-medium">{address.name}</p>
            <p className="text-sm text-muted-foreground">{address.street}</p>
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-sm text-muted-foreground">{address.country}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/50">
          <p className="text-sm font-semibold">Items ({order.items.length})</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-2 text-right font-medium text-muted-foreground">Qty</th>
              <th className="px-4 py-2 text-right font-medium text-muted-foreground">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{item.productName}</p>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground">{item.variantName}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(Number(item.price))}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(item.price) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t flex justify-end">
          <div className="space-y-1 text-sm min-w-[200px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(Number(order.shippingCost))}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-1 mt-1">
              <span>Total</span>
              <span>{formatCurrency(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
