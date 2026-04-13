import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * GitHub Pages (repo de proyecto): assets con ruta absoluta al repo.
 * Si cambiás el nombre del repo en GitHub, actualizá también `ghRepo`.
 */
const ghRepo = 'BrisleyModa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === 'production' ? `/${ghRepo}/` : '/',
}))
