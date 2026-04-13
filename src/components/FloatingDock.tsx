import { useCart } from '../context/useCart'
import { useCartDrawer } from '../context/useCartDrawer'
import { WhatsAppFloat } from './WhatsAppFloat'

function MobileFloatingCartButton() {
  const { totalQty } = useCart()
  const { open, toggle } = useCartDrawer()

  return (
    <button
      type="button"
      onClick={() => toggle()}
      className="relative flex h-14 w-14 items-center justify-center rounded-full border border-bris-border bg-bris-surface text-bris-ink shadow-[0_4px_14px_rgba(20,17,15,0.12)] transition-transform hover:scale-105 hover:shadow-[0_6px_18px_rgba(20,17,15,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-bris-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bris-canvas"
      aria-label="Abrir carrito"
      aria-expanded={open}
      aria-controls="global-cart-drawer"
    >
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalQty > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-bris-accent px-1 text-[10px] font-semibold text-white">
          {totalQty > 99 ? '99+' : totalQty}
        </span>
      )}
    </button>
  )
}

/**
 * Móvil: carrito flotante arriba + WhatsApp abajo. Desktop (md+): solo WhatsApp.
 */
export function FloatingDock() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <div className="pointer-events-auto md:hidden">
        <MobileFloatingCartButton />
      </div>
      <div className="pointer-events-auto">
        <WhatsAppFloat />
      </div>
    </div>
  )
}
