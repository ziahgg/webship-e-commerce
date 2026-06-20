import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Payment Cancelled' }

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-6">Your order was not completed. You can return to your cart and try again.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button render={<Link href="/cart" />}>Back to Cart</Button>
        <Button variant="outline" render={<Link href="/products" />}>Continue Shopping</Button>
      </div>
    </div>
  )
}
