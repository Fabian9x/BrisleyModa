import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Nombre del repositorio en GitHub (sin barras). Solo afecta al build de producción. */
const ghRepo = 'BrisleyModa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === 'production' ? `/${ghRepo}/` : '/',
}))
