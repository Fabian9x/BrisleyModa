import type { ReactNode } from 'react'
import { Link, BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { GlobalCartDrawer } from './components/GlobalCartDrawer'
import { FloatingDock } from './components/FloatingDock'
import { CartDrawerProvider } from './context/CartDrawerProvider'
import { CartProvider } from './context/CartProvider'
import { ToastProvider } from './context/ToastProvider'
import { useCart } from './context/useCart'
import { useCartDrawer } from './context/useCartDrawer'
import { ProductPage } from './pages/ProductPage'
import { Store } from './pages/Store'

const basename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

const brisleyLogoSrc = `${import.meta.env.BASE_URL}logo-brisley.jpg`

function LegacyProductRedirect() {
  const { productId } = useParams<{ productId: string }>()
  return <Navigate to={`/producto/${productId}`} replace />
}

function CartNavButton() {
  const { totalQty } = useCart()
  const { open, toggle } = useCartDrawer()

  return (
    <button
      type="button"
      onClick={() => toggle()}
      className="relative rounded-md p-2 text-bris-muted transition-colors hover:bg-bris-soft hover:text-bris-ink"
      aria-label="Abrir carrito"
      aria-expanded={open}
      aria-controls="global-cart-drawer"
    >
      <svg
        className="h-6 w-6"
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

function AppHeader() {
  return (
    <header className="border-b border-bris-border bg-bris-surface/95 shadow-[0_1px_0_0_rgba(20,17,15,0.06)] backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center outline-none ring-bris-accent focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bris-canvas"
        >
          <img
            src={brisleyLogoSrc}
            alt="Brisley Moda"
            className="h-9 w-auto max-h-10 max-w-[min(11rem,52vw)] object-contain object-left sm:h-10 sm:max-w-[13rem]"
            width={180}
            height={48}
            decoding="async"
          />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-bris-muted sm:inline">Tienda online</span>
          <CartNavButton />
        </div>
      </div>
    </header>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-bris-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border focus:border-bris-border-strong focus:bg-bris-surface focus:px-3 focus:py-2 focus:text-sm focus:text-bris-ink focus:shadow-sm"
      >
        Ir al contenido
      </a>

      <AppHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-bris-border bg-bris-surface py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-bris-ink">
            © {new Date().getFullYear()} Brisley Moda
          </p>
          <a
            href="https://technodev.technorescue.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium uppercase tracking-wider text-bris-muted transition-colors hover:text-bris-accent"
          >
            Desarrollado por{' '}
            <span className="font-semibold normal-case text-bris-burgundy">TechnoDev</span>
          </a>
        </div>
      </footer>

      <FloatingDock />
      <GlobalCartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ToastProvider>
        <CartProvider>
          <CartDrawerProvider>
            <Shell>
              <Routes>
                <Route path="/" element={<Store />} />
                <Route path="/producto/:productId" element={<ProductPage />} />
                <Route
                  path="/tienda/:storeId/producto/:productId"
                  element={<LegacyProductRedirect />}
                />
                <Route path="/tienda/:id" element={<Navigate to="/" replace />} />
              </Routes>
            </Shell>
          </CartDrawerProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
