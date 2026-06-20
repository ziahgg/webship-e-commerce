'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItemLocal } from '@/types'

interface CartStore {
  items: CartItemLocal[]
  addItem: (item: Omit<CartItemLocal, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

function sameItem(
  a: CartItemLocal,
  productId: string,
  variantId?: string | null
): boolean {
  return a.productId === productId && (a.variantId ?? null) === (variantId ?? null)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => sameItem(i, item.productId, item.variantId))
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameItem(i, item.productId, item.variantId)
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity }] }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !sameItem(i, productId, variantId)),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            sameItem(i, productId, variantId) ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
