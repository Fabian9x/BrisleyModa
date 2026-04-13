import { createContext } from 'react'
import type { Business, CartLine, Product } from '../types'

export type CartContextValue = {
  businessId: string | null
  setBusiness: (b: Business | null) => void
  lines: CartLine[]
  add: (product: Product, size: string) => void
  removeOne: (lineKey: string) => void
  removeLine: (lineKey: string) => void
  clear: () => void
  totalQty: number
  subtotal: number
}

export const CartContext = createContext<CartContextValue | null>(null)
