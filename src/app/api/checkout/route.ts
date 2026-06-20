import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { z } from 'zod'
import { checkoutRateLimit } from '@/lib/rate-limit'

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().nullable().optional(),
    name: z.string(),
    image: z.string(),
    variantName: z.string().nullable().optional(),
    price: z.number().positive(),
    quantity: z.number().int().positive().max(100),
  })),
  shippingAddress: z.object({
    recipient: z.string().min(2),
    phone: z.string().min(7),
    street: z.string().min(5),
    city: z.string().min(2),
    province: z.string().min(2),
    postalCode: z.string().min(5),
    country: z.string().default('United States'),
  }),
  shippingCost: z.number().min(0),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const limited = await checkoutRateLimit(req)
  if (limited) return limited

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Please sign in to continue' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data', issues: parsed.error.issues }, { status: 400 })
  }

  const { items, shippingAddress, shippingCost, notes } = parsed.data
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal + shippingCost

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      ...items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.variantName ?? undefined,
            images: item.image ? [item.image] : [],
          },
          unit_amount: formatAmountForStripe(item.price),
        },
        quantity: item.quantity,
      })),
      ...(shippingCost > 0 ? [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: formatAmountForStripe(shippingCost),
        },
        quantity: 1,
      }] : []),
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
    metadata: {
      userId: session.user.id,
      subtotal: String(subtotal),
      shippingCost: String(shippingCost),
      notes: notes ?? '',
    },
  })

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      status: 'PENDING',
      total,
      subtotal,
      shippingCost,
      shippingAddress,
      notes,
      stripeSessionId: stripeSession.id,
      items: {
        create: items.map(item => ({
          productName: item.name,
          productImage: item.image,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId,
          variantId: item.variantId,
        })),
      },
    },
  })

  return NextResponse.json({ url: stripeSession.url, orderId: order.id })
}
