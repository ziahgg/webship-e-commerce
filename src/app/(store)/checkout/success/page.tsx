import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Payment Successful' }

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-2">Thank you! Your order is being processed.</p>
      {session_id && (
        <p className="text-xs text-muted-foreground mb-6">Ref: {session_id.slice(-12)}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button render={<Link href="/account/orders" />}>View Orders</Button>
        <Button variant="outline" render={<Link href="/products" />}>Continue Shopping</Button>
      </div>
    </div>
  )
}
