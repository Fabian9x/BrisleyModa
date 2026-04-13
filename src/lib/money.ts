export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

export function buildWhatsAppUrl(phoneDigits: string, text: string) {
  const clean = phoneDigits.replace(/\D/g, '')
  // encodeURIComponent preserva UTF-8 (emojis); URLSearchParams a veces usa '+' y falla en wa.me
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
}
