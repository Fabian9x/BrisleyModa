/** Orden típico de talles ropa; el resto va alfabético / numérico al final */
const SIZE_RANK: Record<string, number> = {
  xxs: 0,
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
  xxl: 6,
  xxxl: 7,
  unico: 8,
  única: 8,
  u: 8,
}

export function sortSizes(a: string, b: string): number {
  const ra = SIZE_RANK[a.trim().toLowerCase()]
  const rb = SIZE_RANK[b.trim().toLowerCase()]
  if (ra !== undefined || rb !== undefined) {
    if (ra === undefined) return 1
    if (rb === undefined) return -1
    return ra - rb
  }
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'es', { numeric: true })
}

export function uniqueSortedSizes(sizes: Iterable<string>): string[] {
  return [...new Set(sizes)].sort(sortSizes)
}

export function cartLineKey(productId: string, size: string): string {
  return `${productId}::${encodeURIComponent(size)}`
}
