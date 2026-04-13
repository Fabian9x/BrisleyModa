import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const index = join(dist, 'index.html')
const notFound = join(dist, '404.html')

if (existsSync(index)) {
  copyFileSync(index, notFound)
  console.log('GitHub Pages: dist/404.html copiado desde index.html')
} else {
  console.warn('No se encontró dist/index.html; omite 404.html')
}
