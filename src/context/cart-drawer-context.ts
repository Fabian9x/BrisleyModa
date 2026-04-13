import { createContext } from 'react'

export type CartDrawerContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const CartDrawerContext = createContext<CartDrawerContextValue | null>(
  null,
)
