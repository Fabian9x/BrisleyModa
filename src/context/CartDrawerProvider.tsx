import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CartDrawerContext } from './cart-drawer-context'

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
    }),
    [open, toggle],
  )

  return (
    <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
  )
}
