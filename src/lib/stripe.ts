import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
  typescript: true,
})

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''

export const formatAmountForStripe = (amount: number): number => Math.round(amount * 100)

export const formatAmountFromStripe = (amount: number): number => amount / 100
