import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/store/checkout/checkout-form'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/checkout')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <CheckoutForm userId={session.user.id} />
    </div>
  )
}
