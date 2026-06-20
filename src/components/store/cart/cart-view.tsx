'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from '@/types'

export function CartView() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Browse our products and find something you love!</p>
        <Button render={<Link href="/products" />}>Start Shopping</Button>
      </div>
    )
  }

  const subtotal = totalPrice()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_METHODS[0].price
  const total = subtotal + shipping

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-3">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 border rounded-xl p-4 bg-background">
            <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border bg-muted">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
              {item.variantName && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
              )}
              <p className="text-sm font-semibold mt-1">{formatCurrency(item.price)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.variantId, Math.min(item.quantity + 1, item.stock))}>
                  <Plus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 ml-2 text-destructive hover:text-destructive" onClick={() => removeItem(item.productId, item.variantId)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="border rounded-xl p-5 bg-background sticky top-20 space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
            </div>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-muted-foreground">Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!</p>
            )}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" size="lg" render={<Link href="/checkout" />}>
            Proceed to Checkout
          </Button>
          <Button variant="outline" className="w-full" render={<Link href="/products" />}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
