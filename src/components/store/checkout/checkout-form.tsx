'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/utils'
import { SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from '@/types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  recipient: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Enter a valid phone number').max(20),
  street: z.string().min(5, 'Enter your full street address'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Enter a valid ZIP code').max(10),
  notes: z.string().optional(),
  shippingMethodId: z.string(),
})
type FormData = z.infer<typeof schema>

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
]

export function CheckoutForm({ userId }: { userId: string }) {
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shippingMethodId: 'standard' },
  })

  const subtotal = totalPrice()
  const eligibleForFree = subtotal >= FREE_SHIPPING_THRESHOLD
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === watch('shippingMethodId')) ?? SHIPPING_METHODS[0]
  const effectiveShippingCost = eligibleForFree && selectedShipping.id === 'standard' ? 0 : selectedShipping.price
  const total = subtotal + effectiveShippingCost

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            image: i.image,
            variantName: i.variantName,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: {
            recipient: data.recipient, phone: data.phone,
            street: data.street, city: data.city,
            province: data.province, postalCode: data.postalCode,
            country: 'United States',
          },
          shippingCost: effectiveShippingCost,
          notes: data.notes,
        }),
      })
      if (!res.ok) { const b = await res.json(); throw new Error(b.error ?? 'Checkout failed') }
      const { url } = await res.json()
      clearCart()
      window.location.href = url
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Your cart is empty.</p>
        <Button className="mt-4" render={<a href="/products" />}>Start Shopping</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-3 space-y-6">
        {/* Shipping address */}
        <div className="border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-lg">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Full Name</Label>
              <Input placeholder="Your full name" {...register('recipient')} />
              {errors.recipient && <p className="text-xs text-destructive">{errors.recipient.message}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Phone Number</Label>
              <Input placeholder="(555) 123-4567" type="tel" {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Street Address</Label>
              <Textarea placeholder="123 Main St, Apt 4B..." {...register('street')} />
              {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input placeholder="New York" {...register('city')} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>ZIP Code</Label>
              <Input placeholder="10001" maxLength={10} {...register('postalCode')} />
              {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>State</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" {...register('province')}>
                <option value="">Select State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.province && <p className="text-xs text-destructive">{errors.province.message}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Order Notes (optional)</Label>
              <Input placeholder="Any special instructions for delivery..." {...register('notes')} />
            </div>
          </div>
        </div>

        {/* Shipping method */}
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold text-lg mb-4">Shipping Method</h2>
          <RadioGroup defaultValue="standard" {...register('shippingMethodId')}>
            <div className="space-y-2">
              {SHIPPING_METHODS.map((m) => {
                const isFree = eligibleForFree && m.id === 'standard'
                const displayPrice = isFree ? 0 : m.price
                return (
                  <label key={m.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${watch('shippingMethodId') === m.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={m.id} id={m.id} {...register('shippingMethodId')} />
                      <div>
                        <p className="text-sm font-medium">{m.name} — {m.description}</p>
                        <p className="text-xs text-muted-foreground">{m.estimatedDays}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${displayPrice === 0 ? 'text-green-600' : ''}`}>
                      {displayPrice === 0 ? 'FREE' : formatCurrency(displayPrice)}
                    </span>
                  </label>
                )
              })}
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Order summary */}
      <div className="md:col-span-2">
        <div className="border rounded-xl p-5 sticky top-20 space-y-4">
          <h2 className="font-semibold text-lg">Your Order</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-2 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p>×{item.quantity}</p>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={effectiveShippingCost === 0 ? 'text-green-600 font-medium' : ''}>{effectiveShippingCost === 0 ? 'FREE' : formatCurrency(effectiveShippingCost)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay with Stripe
          </Button>
          <p className="text-xs text-center text-muted-foreground">Payments are securely processed by Stripe</p>
        </div>
      </div>
    </form>
  )
}
