import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { Package, User } from 'lucide-react'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/account')

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: { take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">My Account</h1>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2"><span className="text-muted-foreground w-20">Name</span><span className="font-medium">{session.user.name}</span></div>
          <div className="flex gap-2"><span className="text-muted-foreground w-20">Email</span><span>{session.user.email}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Recent Orders</CardTitle>
            <Link href="/account/orders" className="text-sm text-primary hover:underline">View All</Link>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(Number(order.total))}</p>
                    <Badge className={`text-[10px] ${getOrderStatusColor(order.status)}`} variant="outline">
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
