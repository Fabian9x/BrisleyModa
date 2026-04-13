import { BRISLEY_WHATSAPP_DIGITS } from '../config/contact'
import { buildWhatsAppUrl } from '../lib/money'
import { WhatsAppIcon } from './icons/WhatsAppIcon'

const defaultMessage =
  'Hola! Me gustaría consultar sobre Brisley Moda.'

export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(BRISLEY_WHATSAPP_DIGITS, defaultMessage)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-bris-canvas"
      aria-label="Escribinos por WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
