import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

export interface CartItem {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images' | 'stock'>
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: CartItem['product'], quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, product.stock)
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: newQty } : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }] }
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.product.id !== productId)
            : state.items.map((i) =>
                i.product.id === productId
                  ? { ...i, quantity: Math.min(quantity, i.product.stock) }
                  : i
              ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'serlab-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
