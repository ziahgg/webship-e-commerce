import { Role, OrderStatus } from '@/generated/prisma/client'

export type { Role, OrderStatus }

export interface CartItemLocal {
  id: string
  productId: string
  variantId?: string | null
  name: string
  slug: string
  image: string
  price: number
  variantName?: string | null
  quantity: number
  stock: number
}

export interface ShippingAddress {
  recipient: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Standard Shipping', description: 'USPS / UPS Ground', price: 4.99, estimatedDays: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', description: 'FedEx Express', price: 12.99, estimatedDays: '2-3 business days' },
  { id: 'free', name: 'Free Shipping', description: 'Orders over $50', price: 0, estimatedDays: '5-7 business days' },
]

export const FREE_SHIPPING_THRESHOLD = 50

export interface ProductWithDetails {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  featured: boolean
  active: boolean
  categoryId: string
  category: { id: string; name: string; slug: string }
  variants: { id: string; name: string; value: string; stock: number; priceDelta: number }[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderWithItems {
  id: string
  status: OrderStatus
  total: number
  subtotal: number
  shippingCost: number
  shippingAddress: ShippingAddress
  notes: string | null
  createdAt: Date
  updatedAt: Date
  items: {
    id: string
    productName: string
    productImage: string
    variantName: string | null
    price: number
    quantity: number
  }[]
}
