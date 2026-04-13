import type { CartLine } from '../types'
import { formatMoney } from './money'

type Params = {
  businessName: string
  currency: string
  lines: CartLine[]
  subtotal: number
  note: string
}

function isTalleUnico(line: CartLine): boolean {
  return line.product.sizes.length === 1 && line.product.sizes[0] === 'Única'
}

/**
 * Texto para wa.me: sin emojis (WhatsApp suele corromper astrales U+1xxxx en URLs prefijadas).
 * Solo negritas *...* y guiones ASCII para que se vea igual en Web y app.
 */
export function buildWhatsAppPedidoText({
  businessName,
  currency,
  lines,
  subtotal,
  note,
}: Params): string {
  const money = (n: number) => formatMoney(n, currency)

  const itemBlocks = lines.map((l, i) => {
    const n = lines.length > 1 ? ` (${i + 1}/${lines.length})` : ''
    const parts: string[] = [`*Producto${n}:* ${l.product.name}`]
    if (!isTalleUnico(l)) {
      parts.push(`*Talle:* ${l.size}`)
    }
    parts.push(`*Cantidad:* ${l.qty}`)
    parts.push(`*Precio:* ${money(l.product.price * l.qty)}`)
    return parts.join('\n')
  })

  const header = `*Pedido - ${businessName}*`
  const divider = '\n' + '-'.repeat(28) + '\n'
  const items = itemBlocks.join(divider)
  const total = `${divider}*Total a pagar:* *${money(subtotal)}*`
  const notes = note.trim() ? `\n\n*Notas:*\n${note.trim()}` : ''
  const footer = `\n\n_Pedido enviado desde nuestro catálogo digital._`

  return `${header}\n\n${items}${total}${notes}${footer}`
}
