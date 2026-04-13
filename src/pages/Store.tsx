import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBusiness, fetchProducts } from '../api/catalog'
import { useCart } from '../context/useCart'
import { formatMoney } from '../lib/money'
import { uniqueSortedSizes } from '../lib/sizes'
import type { Business, Product } from '../types'

function SizeBadges({ sizes }: { sizes: string[] }) {
  if (sizes.length === 1 && sizes[0] === 'Única') {
    return (
      <p className="mt-2 text-xs text-bris-muted">
        Talle: <span className="font-medium text-bris-ink">Única</span>
      </p>
    )
  }
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sizes.map((s) => (
        <span
          key={s}
          className="inline-flex min-h-[1.375rem] items-center rounded border border-bris-border-strong bg-bris-soft px-2 py-0.5 text-[11px] font-medium tabular-nums text-bris-ink"
        >
          {s}
        </span>
      ))}
    </div>
  )
}

function StoreProductCard({
  business,
  product,
  onAdd,
}: {
  business: Business
  product: Product
  onAdd: (p: Product, size: string) => void
}) {
  const [size, setSize] = useState(() => product.sizes[0] ?? 'Única')

  const multi = product.sizes.length > 1

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-bris-border bg-bris-surface shadow-sm">
      <Link
        to={`/producto/${product.id}`}
        className="block min-h-0 flex-1 outline-none ring-inset ring-bris-accent focus-visible:ring-2"
      >
        <div className="aspect-square overflow-hidden bg-bris-soft">
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-4 pb-3">
          <h2 className="font-medium text-bris-ink hover:underline">{product.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-bris-muted">
            {product.description}
          </p>
          <SizeBadges sizes={product.sizes} />
        </div>
      </Link>
      <div className="mt-auto space-y-2 border-t border-bris-line px-4 pb-4 pt-3">
        {multi && (
          <label className="block">
            <span className="sr-only">Talle</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-md border border-bris-border bg-bris-surface px-2 py-1.5 text-sm text-bris-ink focus:border-bris-border-strong focus:outline-none focus:ring-1 focus:ring-bris-accent"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  Talle {s}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-base font-semibold tabular-nums text-bris-burgundy">
            {formatMoney(product.price, business.currency)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product, size)}
            className="rounded-md bg-bris-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-bris-accent-hover"
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}

export function Store() {
  const { setBusiness, businessId, add } = useCart()
  const [business, setBiz] = useState<Business | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sizeFilter, setSizeFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
        setProducts(prods)
      } catch {
        if (alive) setErr('Error al cargar datos.')
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!business) return
    if (business.id !== businessId) {
      setBusiness(business)
    }
  }, [business, businessId, setBusiness])

  const filterOptions = useMemo(
    () => uniqueSortedSizes(products.flatMap((p) => p.sizes)),
    [products],
  )

  const productsAfterSize = useMemo(() => {
    if (!sizeFilter) return products
    return products.filter((p) => p.sizes.includes(sizeFilter))
  }, [products, sizeFilter])

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return productsAfterSize
    return productsAfterSize.filter((p) => {
      const hay = [p.name, p.description, p.sizes.join(' ')].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [productsAfterSize, searchQuery])

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

  if (err || !business) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="text-base font-medium text-bris-ink">{err ?? 'No encontrado.'}</p>
        <p className="mt-4 text-sm text-bris-muted">Recargá la página o probá más tarde.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="store-content">
        <div className="border-b border-bris-border pb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-bris-ink sm:text-3xl">
            {business.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bris-muted sm:text-base">
            {business.tagline}
          </p>
          <p className="mt-4 text-xs text-bris-muted">
            {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'}
            {sizeFilter ? ` · talle ${sizeFilter}` : ''}
            {searchQuery.trim() ? ` · búsqueda activa` : ''}
          </p>
        </div>

        <div className="mt-8">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar en el catálogo
          </label>
          <div className="relative max-w-xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bris-muted" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, descripción o talle…"
              autoComplete="off"
              className={`w-full rounded-lg border border-bris-border bg-bris-surface py-2.5 pl-10 text-sm text-bris-ink placeholder:text-bris-border-strong focus:border-bris-border-strong focus:outline-none focus:ring-2 focus:ring-bris-accent ${searchQuery ? 'pr-20' : 'pr-3'}`}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-bris-muted hover:bg-bris-soft hover:text-bris-ink"
                aria-label="Limpiar búsqueda"
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>

        {filterOptions.length > 0 &&
          !(filterOptions.length === 1 && filterOptions[0] === 'Única') && (
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-bris-muted">
                Filtrar por talle
              </p>
              <div
                className="mt-3 flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrar catálogo por talle"
              >
                <button
                  type="button"
                  onClick={() => setSizeFilter(null)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    sizeFilter === null
                      ? 'border-bris-accent bg-bris-accent text-white'
                      : 'border-bris-border bg-bris-surface text-bris-ink hover:border-bris-border-strong'
                  }`}
                >
                  Todas
                </button>
                {filterOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeFilter(s)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium tabular-nums transition-colors ${
                      sizeFilter === s
                        ? 'border-bris-accent bg-bris-accent text-white'
                        : 'border-bris-border bg-bris-surface text-bris-ink hover:border-bris-border-strong'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

        {filteredProducts.length === 0 ? (
          <p className="mt-12 text-center text-sm text-bris-muted">
            {searchQuery.trim()
              ? 'No hay resultados para tu búsqueda. Probá otras palabras o limpiá el filtro.'
              : sizeFilter
                ? 'No hay productos con el talle seleccionado. Probá con otra talla o mostrá todas.'
                : 'No hay productos para mostrar.'}
          </p>
        ) : (
          <ul className="store-product-grid mt-10">
            {filteredProducts.map((p) => (
              <li key={p.id}>
                <StoreProductCard business={business} product={p} onAdd={add} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
