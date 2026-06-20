import type { Metadata } from 'next'
import { CartView } from '@/components/store/cart/cart-view'

export const metadata: Metadata = { title: 'Shopping Cart' }

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <CartView />
    </div>
  )
}
