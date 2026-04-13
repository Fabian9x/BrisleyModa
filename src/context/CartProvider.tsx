import { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import type { Business, CartLine, Product } from '../types'
import { cartLineKey } from '../lib/sizes'
import { CartContext } from './cart-context'
import { useToast } from './useToast'

type CartState = Record<string, CartLine>

type State = {
  businessId: string | null
  byId: CartState
}

type Action =
  | { type: 'setBusiness'; payload: Business | null }
  | { type: 'add'; product: Product; size: string }
  | { type: 'removeOne'; lineKey: string }
  | { type: 'removeLine'; lineKey: string }
  | { type: 'clear' }

function pickSize(product: Product, size: string): string {
  if (product.sizes.includes(size)) return size
  return product.sizes[0] ?? 'Única'
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setBusiness': {
      const next = action.payload?.id ?? null
      if (next === state.businessId) return state
      return { businessId: next, byId: {} }
    }
    case 'add': {
      const size = pickSize(action.product, action.size)
      const key = cartLineKey(action.product.id, size)
      const cur = state.byId[key]
      const nextQty = (cur?.qty ?? 0) + 1
      return {
        ...state,
        byId: {
          ...state.byId,
          [key]: {
            lineKey: key,
            product: action.product,
            size,
            qty: nextQty,
          },
        },
      }
    }
    case 'removeOne': {
      const cur = state.byId[action.lineKey]
      if (!cur) return state
      if (cur.qty <= 1) {
        const next = { ...state.byId }
        delete next[action.lineKey]
        return { ...state, byId: next }
      }
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.lineKey]: { ...cur, qty: cur.qty - 1 },
        },
      }
    }
    case 'removeLine': {
      const next = { ...state.byId }
      delete next[action.lineKey]
      return { ...state, byId: next }
    }
    case 'clear':
      return { ...state, byId: {} }
  }
}

const initial: State = { businessId: null, byId: {} }

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const { show: showToast } = useToast()

  const setBusiness = useCallback((b: Business | null) => {
    dispatch({ type: 'setBusiness', payload: b })
  }, [])

  const add = useCallback(
    (product: Product, size: string) => {
      const s = pickSize(product, size)
      dispatch({ type: 'add', product, size: s })
      showToast({
        title: product.sizes.length <= 1 ? product.name : `${product.name} (${s})`,
      })
    },
    [showToast],
  )

  const removeOne = useCallback((lineKey: string) => {
    dispatch({ type: 'removeOne', lineKey })
  }, [])

  const removeLine = useCallback((lineKey: string) => {
    dispatch({ type: 'removeLine', lineKey })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const lines = useMemo(() => Object.values(state.byId), [state.byId])
  const totalQty = useMemo(
    () => lines.reduce((s, l) => s + l.qty, 0),
    [lines],
  )
  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.product.price * l.qty, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      businessId: state.businessId,
      setBusiness,
      lines,
      add,
      removeOne,
      removeLine,
      clear,
      totalQty,
      subtotal,
    }),
    [
      state.businessId,
      setBusiness,
      lines,
      add,
      removeOne,
      removeLine,
      clear,
      totalQty,
      subtotal,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
