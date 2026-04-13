import { createContext } from 'react'

export type ToastInput =
  | string
  | {
      title: string
      subtitle?: string
    }

export type ToastContextValue = {
  show: (input: ToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
