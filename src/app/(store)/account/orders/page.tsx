import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'Order History' }

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/account/orders')

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="h-4 w-4" />Back to Account
      </Link>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No orders yet</p>
          <Link href="/products" className="text-primary hover:underline text-sm mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block border rounded-xl p-5 hover:bg-muted/30 transition-colors bg-background">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <Badge className={getOrderStatusColor(order.status)} variant="outline">
                  {getOrderStatusLabel(order.status)}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatCurrency(Number(order.total))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {order.items.slice(0, 3).map(item => (
                  <span key={item.id} className="text-xs bg-muted rounded px-2 py-0.5">{item.productName}</span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
