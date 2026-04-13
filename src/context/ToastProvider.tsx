import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ToastInput } from './toast-context'
import { ToastContext } from './toast-context'

type ToastItem = { id: number; title: string; subtitle?: string }

const DISMISS_MS = 2500

function normalize(input: ToastInput): Omit<ToastItem, 'id'> {
  if (typeof input === 'string') {
    return { title: input }
  }
  return { title: input.title, subtitle: input.subtitle }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const show = useCallback((input: ToastInput) => {
    const id = ++idRef.current
    const { title, subtitle } = normalize(input)
    setToasts((prev) => [...prev, { id, title, subtitle }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, DISMISS_MS)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-[min(calc(100vw-2rem),26rem)] -translate-x-1/2 flex-col gap-3 px-4 sm:bottom-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-enter pointer-events-auto overflow-hidden rounded-2xl border border-bris-border/90 bg-bris-surface shadow-[0_12px_40px_-8px_rgba(20,17,15,0.12),0_0_0_1px_rgba(230,226,222,0.9)]"
          >
            <div className="flex gap-4 p-4 pr-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-bris-accent to-bris-burgundy text-bris-surface shadow-inner"
                aria-hidden
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bris-muted">
                  Agregado al carrito
                </p>
                <p className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-bris-ink">
                  {t.title}
                </p>
                {t.subtitle ? (
                  <p className="mt-2 text-sm leading-relaxed text-bris-muted">{t.subtitle}</p>
                ) : null}
              </div>
            </div>
            <div className="h-1 bg-bris-line">
              <div
                className="toast-progress-bar h-full w-full origin-left bg-gradient-to-r from-bris-border-strong via-bris-muted to-bris-accent"
                style={{
                  animationDuration: `${DISMISS_MS}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
