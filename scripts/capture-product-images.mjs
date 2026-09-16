// Chụp màn hình app từ artboard thiết kế desktop (docops-application/docs/thiet-ke/*.dc.html) → WebP cho site.
// Dùng: node scripts/capture-product-images.mjs [<thư mục artboard>]   (mặc định: ../docops-application/docs/thiet-ke)
// Artboard là Design Component có <sc-for> và lỗ {{...}} do renderVals() cấp; shim dưới đây khai triển đủ để chụp tĩnh.
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const srcDir = resolve(process.argv[2] ?? '../docops-application/docs/thiet-ke')
const outDir = 'public/images/product'
const SHOTS = [
  { artboard: 'RaSoat', out: 'rasoat', width: 2000, quality: 78 },
  { artboard: 'KhoVanBan', out: 'khovanban', width: 1520, quality: 76 },
  { artboard: 'TraCuu', out: 'tracuu', width: 1520, quality: 76 },
  { artboard: 'SoanThao', out: 'soanthao', width: 1520, quality: 76 },
  { artboard: 'DoThi', out: 'dothi', width: 1520, quality: 76 },
]

const tmp = await mkdtemp(join(tmpdir(), 'docops-shots-'))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.addInitScript(() => {
  window.DCLogic = class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {} }
    setState() {}
    forceUpdate() {}
  }
})
for (const shot of SHOTS) {
  await page.goto(`file://${join(srcDir, `${shot.artboard}.dc.html`)}`, { waitUntil: 'load' })
  await page.evaluate(() => {
    const vals = typeof Component === 'function' ? (new Component({}).renderVals?.() ?? {}) : {}
    const lookup = (scope, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope)
    const fill = (html, scope) => html.replace(/\{\{\s*([\w$.]+)\s*\}\}/g, (m, p) => { const v = lookup(scope, p); return v === undefined ? m : String(v) })
    const outermost = (root) => Array.from(root.querySelectorAll('sc-for')).filter((n) => !n.parentElement?.closest('sc-for'))
    const renderFor = (el, scope) => {
      const list = lookup(scope, (el.getAttribute('list') || '').replace(/[{}\s]/g, '')) || []
      const alias = el.getAttribute('as') || 'item'
      return list.map((item, i) => {
        const s = Object.assign({}, scope, { [alias]: item, $index: i })
        const tmpEl = document.createElement('div')
        tmpEl.innerHTML = el.innerHTML
        for (const n of outermost(tmpEl)) n.outerHTML = renderFor(n, s)
        return fill(tmpEl.innerHTML, s)
      }).join('')
    }
    for (const n of outermost(document.body)) n.outerHTML = renderFor(n, vals)
    for (const n of Array.from(document.querySelectorAll('sc-if'))) n.outerHTML = n.innerHTML
    document.body.innerHTML = fill(document.body.innerHTML, vals)
  })
  await page.waitForTimeout(400)
  const png = join(tmp, `${shot.out}.png`)
  await page.screenshot({ path: png, type: 'png' })
  const out = join(outDir, `${shot.out}.webp`)
  const info = await sharp(png).resize({ width: shot.width }).webp({ quality: shot.quality }).toFile(out)
  console.log(`${out}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`)
}
await browser.close()
