import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  // Idempotency guard — skip events we've already processed
  const order = await db.order.findFirst({
    where: {
      OR: [
        { stripeEventIds: { has: event.id } },
        ...(event.type === 'checkout.session.completed'
          ? [{ stripeSessionId: (event.data.object as Stripe.Checkout.Session).id }]
          : []),
        ...(event.type === 'payment_intent.succeeded'
          ? [{ paymentIntentId: (event.data.object as Stripe.PaymentIntent).id }]
          : []),
      ],
    },
    select: { id: true, stripeEventIds: true, status: true },
  })

  if (order?.stripeEventIds?.includes(event.id)) {
    return NextResponse.json({ received: true, skipped: true })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (!session.id) break

      const target = await db.order.findUnique({
        where: { stripeSessionId: session.id },
        select: { id: true, stripeEventIds: true, status: true },
      })
      if (!target) break

      if (target.status !== 'PENDING') {
        await db.order.update({
          where: { id: target.id },
          data: { stripeEventIds: { push: event.id } },
        })
        break
      }

      await db.order.update({
        where: { id: target.id },
        data: {
          status: session.payment_status === 'paid' ? 'PAID' : 'PENDING',
          paymentIntentId: session.payment_intent as string ?? null,
          stripeEventIds: { push: event.id },
        },
      })
      break
    }

    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent
      await db.order.updateMany({
        where: { paymentIntentId: intent.id, status: { not: 'PAID' } },
        data: { status: 'PAID' },
      })
      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: { stripeEventIds: { push: event.id } },
        })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      await db.order.updateMany({
        where: { paymentIntentId: intent.id, status: 'PENDING' },
        data: { status: 'CANCELLED' },
      })
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
