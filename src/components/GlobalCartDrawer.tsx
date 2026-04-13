import { startTransition, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBusiness } from '../api/catalog'
import { useCartDrawer } from '../context/useCartDrawer'
import { useCart } from '../context/useCart'
import { WhatsAppIcon } from './icons/WhatsAppIcon'
import { buildWhatsAppPedidoText } from '../lib/whatsapp-order'
import { buildWhatsAppUrl, formatMoney } from '../lib/money'
import type { Business } from '../types'

export function GlobalCartDrawer() {
  const { open, setOpen } = useCartDrawer()
  const {
    lines,
    add,
    removeOne,
    removeLine,
    subtotal,
    totalQty,
    businessId,
    clear,
  } = useCart()
  const [note, setNote] = useState('')
  const [business, setBusiness] = useState<Business | null>(null)
  const [bizLoading, setBizLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  useEffect(() => {
    if (!businessId) return undefined

    let cancelled = false
    startTransition(() => {
      setBizLoading(true)
    })
    fetchBusiness()
      .then((b) => {
        if (cancelled) return
        startTransition(() => {
          setBusiness(b.id === businessId ? b : null)
        })
      })
      .finally(() => {
        if (!cancelled) {
          startTransition(() => setBizLoading(false))
        }
      })

    return () => {
      cancelled = true
      startTransition(() => {
        setBusiness(null)
        setBizLoading(false)
      })
    }
  }, [businessId])

  const waUrl = useMemo(() => {
    if (!business || !lines.length || businessId !== business.id) return null
    const text = buildWhatsAppPedidoText({
      businessName: business.name,
      currency: business.currency,
      lines,
      subtotal,
      note,
    })
    return buildWhatsAppUrl(business.whatsapp, text)
  }, [lines, business, subtotal, businessId, note])

  const currency = business?.currency ?? 'USD'

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-bris-ink/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Cerrar carrito"
        onClick={() => setOpen(false)}
      />
      <aside
        id="global-cart-drawer"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-bris-border bg-bris-surface shadow-2xl transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-bris-border px-4">
          <h2 id="cart-drawer-title" className="text-base font-semibold text-bris-ink">
            Carrito
          </h2>
          <div className="flex items-center gap-2">
            {totalQty > 0 && (
              <button
                type="button"
                onClick={() => clear()}
                className="text-xs text-bris-muted hover:text-bris-accent hover:underline"
              >
                Vaciar
              </button>
            )}
            <button
              type="button"
              className="rounded-md p-2 text-bris-muted hover:bg-bris-soft hover:text-bris-ink"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          {totalQty === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
              <p className="text-sm text-bris-muted">Tu carrito está vacío.</p>
              <Link
                to="/"
                className="text-sm font-medium text-bris-ink underline decoration-bris-border-strong underline-offset-4 hover:decoration-bris-accent"
                onClick={() => setOpen(false)}
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              {bizLoading && (
                <p className="text-xs text-bris-muted">Cargando datos de la tienda…</p>
              )}
              {!bizLoading && !business && (
                <p className="text-sm text-red-700">
                  No se pudieron cargar los datos del negocio.
                </p>
              )}

              <p className="mt-1 text-xs text-bris-muted">
                {totalQty} artículo{totalQty === 1 ? '' : 's'}
                {business && (
                  <span className="text-bris-border-strong"> · {business.name}</span>
                )}
              </p>

              <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5">
                {lines.map((l) => {
                  const multi = l.product.sizes.length > 1
                  return (
                    <li
                      key={l.lineKey}
                      className="flex gap-3 rounded-md border border-bris-border bg-bris-soft p-3 text-sm"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-bris-line bg-bris-surface">
                        <img
                          src={l.product.image}
                          alt=""
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-bris-ink">{l.product.name}</p>
                        {multi && (
                          <p className="mt-0.5 text-xs text-bris-muted">Talle {l.size}</p>
                        )}
                        <p className="mt-0.5 text-xs tabular-nums text-bris-muted">
                          {formatMoney(l.product.price, currency)} × {l.qty}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            aria-label="Quitar uno"
                            className="flex h-8 w-8 items-center justify-center rounded border border-bris-border bg-bris-surface text-bris-muted hover:bg-bris-soft"
                            onClick={() => removeOne(l.lineKey)}
                          >
                            −
                          </button>
                          <button
                            type="button"
                            aria-label="Agregar uno"
                            className="flex h-8 w-8 items-center justify-center rounded border border-bris-border bg-bris-surface text-bris-muted hover:bg-bris-soft"
                            onClick={() => add(l.product, l.size)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-bris-muted hover:text-bris-accent hover:underline"
                          onClick={() => removeLine(l.lineKey)}
                        >
                          Quitar
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {business && lines.length > 0 && (
                <div className="mt-auto shrink-0 border-t border-bris-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-bris-muted">Subtotal</span>
                    <span className="font-semibold tabular-nums text-bris-ink">
                      {formatMoney(subtotal, business.currency)}
                    </span>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-xs font-medium text-bris-muted">
                      Notas (opcional)
                    </span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="mt-1.5 w-full resize-none rounded-md border border-bris-border bg-bris-surface px-3 py-2 text-sm text-bris-ink placeholder:text-bris-border-strong focus:border-bris-border-strong focus:outline-none focus:ring-1 focus:ring-bris-accent"
                      placeholder="Nombre, horario de retiro…"
                    />
                  </label>

                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-md bg-[#25d366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1ebe57]"
                      onClick={() => setOpen(false)}
                    >
                      <WhatsAppIcon className="h-6 w-6 shrink-0" />
                      <span>Pagar en WhatsApp</span>
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
