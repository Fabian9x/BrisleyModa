import { useContext } from 'react'
import { CartDrawerContext } from './cart-drawer-context'

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) throw new Error('useCartDrawer debe usarse dentro de CartDrawerProvider')
  return ctx
}
