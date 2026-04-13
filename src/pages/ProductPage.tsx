import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchBusiness, fetchProducts } from '../api/catalog'
import { useCart } from '../context/useCart'
import { formatMoney } from '../lib/money'
import type { Business, Product } from '../types'

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>()
  const { setBusiness, businessId, add } = useCart()
  const [business, setBiz] = useState<Business | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setErr(null)

    ;(async () => {
      try {
        const b = await fetchBusiness()
        if (!alive) return
        setBiz(b)
        const prods = await fetchProducts(b.productsFile)
        if (!alive) return
        const p = productId ? prods.find((x) => x.id === productId) ?? null : null
        if (!p) {
          setProduct(null)
          setErr('Este producto no existe.')
          setLoading(false)
          return
        }
        setProduct(p)
        setSelectedSize(p.sizes[0] ?? 'Única')
      } catch {
        if (alive) setErr('Error al cargar datos.')
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [productId])

  useEffect(() => {
    if (!business) return
    if (business.id !== businessId) {
      setBusiness(business)
    }
  }, [business, businessId, setBusiness])

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} · ${business?.name ?? 'Brisley Moda'}`
    }
    return () => {
      document.title = 'Brisley Moda'
    }
  }, [product?.name, business?.name])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-5">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-bris-border border-t-bris-accent"
          aria-hidden
        />
        <p className="text-sm text-bris-muted">Cargando…</p>
      </div>
    )
  }

  if (err || !business || !product) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="text-base font-medium text-bris-ink">{err ?? 'No encontrado.'}</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-bris-accent underline decoration-bris-border-strong underline-offset-4 hover:decoration-bris-accent"
        >
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const multiSize = product.sizes.length > 1

  return (
    <div className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="store-content">
        <nav className="text-sm text-bris-muted">
          <Link to="/" className="hover:text-bris-accent">
            Catálogo
          </Link>
          <span className="mx-2 text-bris-border-strong">/</span>
          <span className="text-bris-ink">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
          <div className="overflow-hidden rounded-lg border border-bris-border bg-bris-soft">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover sm:aspect-[4/3] lg:aspect-square"
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-bris-ink sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-bris-muted">{product.description}</p>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-bris-muted">
                Talles disponibles
              </p>
              {multiSize ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-h-10 min-w-10 rounded-md border px-3 py-2 text-sm font-medium tabular-nums transition-colors ${
                        selectedSize === s
                          ? 'border-bris-accent bg-bris-accent text-white'
                          : 'border-bris-border bg-bris-surface text-bris-ink hover:border-bris-border-strong'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-bris-ink">
                  <span className="text-bris-muted">Talle: </span>
                  {product.sizes[0]}
                </p>
              )}
            </div>

            <p className="mt-8 text-2xl font-semibold tabular-nums text-bris-burgundy">
              {formatMoney(product.price, business.currency)}
            </p>
            <button
              type="button"
              onClick={() => add(product, selectedSize)}
              className="mt-8 w-full rounded-md bg-bris-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-bris-accent-hover sm:w-auto sm:px-8"
            >
              Añadir al carrito
              {multiSize ? ` (${selectedSize})` : ''}
            </button>
            <p className="mt-6 text-xs text-bris-muted">
              Podés seguir comprando y cerrar el pedido desde el carrito con WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
