/** Vite config of the guide-capture harness. The driver (`../capture-guide-images.mjs`) copies this folder to a temp dir,
 * symlinks the DESKTOP package's `node_modules` into it (so React/Vite/zod are the desktop's own copies, not the site's) and
 * starts Vite from there with `DOCOPS_DESKTOP` pointing at the desktop checkout. Nothing is written inside that checkout. */
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const DESKTOP = process.env.DOCOPS_DESKTOP
if (!DESKTOP) throw new Error('DOCOPS_DESKTOP chưa đặt: đường dẫn tới packages/desktop của repo docops-application')

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: path.join(import.meta.dirname, '.vite-cache'),
  plugins: [react()],
  resolve: {
    alias: {
      '@renderer': `${DESKTOP}/src/renderer`,
      '@contracts': `${DESKTOP}/src/contracts`,
      '@testutils': `${DESKTOP}/test/testUtils`,
    },
  },
  server: { fs: { allow: [path.resolve(DESKTOP, '../..'), import.meta.dirname] } },
})
