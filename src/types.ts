export type Business = {
  id: string
  name: string
  tagline: string
  /** Solo dígitos, con código de país, sin + ni espacios (ej: 5491112345678) */
  whatsapp: string
  currency: string
  productsFile: string
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  /** Talles disponibles (ej. S, M, L). Si falta en JSON se usa ["Única"]. */
  sizes: string[]
}

export type CartLine = {
  lineKey: string
  product: Product
  size: string
  qty: number
}
