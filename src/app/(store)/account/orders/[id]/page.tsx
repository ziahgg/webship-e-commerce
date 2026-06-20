import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { ChevronLeft, MapPin, Package } from 'lucide-react'
import type { ShippingAddress } from '@/types'

export const metadata: Metadata = { title: 'Order Detail' }

interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params
  const order = await db.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true },
  })
  if (!order) notFound()

  const address = order.shippingAddress as unknown as ShippingAddress

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-4 w-4" />Back to Orders
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={getOrderStatusColor(order.status)} variant="outline">
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4" />Items Ordered</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border bg-muted">
                {item.productImage ? (
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="56px" />
                ) : <div className="absolute inset-0 bg-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.productName}</p>
                {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                <p className="text-xs text-muted-foreground">×{item.quantity} · {formatCurrency(Number(item.price))}</p>
              </div>
              <p className="text-sm font-bold shrink-0">{formatCurrency(Number(item.price) * item.quantity)}</p>
            </div>
          ))}
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{Number(order.shippingCost) === 0 ? 'FREE' : formatCurrency(Number(order.shippingCost))}</span></div>
            <div className="flex justify-between font-bold text-base mt-1"><span>Total</span><span>{formatCurrency(Number(order.total))}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4" />Shipping Address</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <p className="font-medium">{address.recipient}</p>
          <p className="text-muted-foreground">{address.phone}</p>
          <p className="text-muted-foreground">{address.street}, {address.city}, {address.province} {address.postalCode}, {address.country}</p>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">Notes: {order.notes}</CardContent>
        </Card>
      )}
    </div>
  )
}
