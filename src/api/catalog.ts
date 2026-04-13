import type { Business, Product } from '../types'

/** BASE_URL de Vite termina en `/` */
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

type ProductJson = Omit<Product, 'sizes'> & { sizes?: string[] }

function normalizeProduct(p: ProductJson): Product {
  const raw = p.sizes?.map((s) => String(s).trim()).filter(Boolean) ?? []
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    sizes: raw.length > 0 ? raw : ['Única'],
  }
}

export async function fetchBusiness(): Promise<Business> {
  const res = await fetch(asset('data/business.json'))
  if (!res.ok) throw new Error('No se pudo cargar el negocio')
  const data = (await res.json()) as { business: Business }
  return data.business
}

export async function fetchProducts(file: string): Promise<Product[]> {
  const res = await fetch(asset(`data/products/${file}.json`))
  if (!res.ok) throw new Error('No se pudieron cargar los productos')
  const data = (await res.json()) as { products: ProductJson[] }
  return data.products.map(normalizeProduct)
}
