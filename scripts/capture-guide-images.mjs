// Ảnh chụp giao diện cho trang Hướng dẫn sử dụng → public/images/guide/<id>.webp (một ảnh cho mỗi mục chính).
//
// Dùng:  node scripts/capture-guide-images.mjs [<thư mục packages/desktop>] [--only id,id]
//        (mặc định lấy DOCOPS_DESKTOP, rồi docops-application/packages/desktop nằm cạnh repo website; trong git worktree thì truyền đường dẫn)
//        Chạy từ thư mục nào cũng được: đường dẫn ra/vào đều tính từ vị trí của script này.
//
// Ảnh chụp từ renderer THẬT của app desktop (cùng React, cùng CSS, cùng màn hình), dựng trong Chromium KHÔNG có Electron, KHÔNG có
// máy chủ, KHÔNG có key, KHÔNG gọi AI: `scripts/guide-capture/fake.ts` thay `window.docops` bằng dữ liệu mẫu bịa (một trường đại học
// tưởng tượng, không người thật, không mã cán bộ), đúng hình dạng hợp đồng IPC (mỗi câu trả lời đi qua `IPC_CONTRACT` của desktop,
// sai hình dạng là script dừng). Spec Dự án 2 §5.3: giao diện Cổ điển, theme sáng, rộng 1600 px, đồng hồ cố định.
//
// COUPLING TO THE DESKTOP (what to re-check when the desktop moves): the bridge `fake.ts` answers against `src/contracts/ipc.ts`
// (`IPC_CONTRACT`: command names and strict input/output shapes), builds the Soạn thảo body with `src/contracts/docBody.ts`
// (`docBodyOfPlainText`) and builds the confirmation-tray replies with `test/testUtils/gateFixtures.ts` (`inboxItem`, `journeyDocument`,
// `inboxByDocumentReply`). A renamed command or a widened output makes this script stop with a `[fake] …` line instead of photographing
// an error screen; the images already committed are not touched.
//
// SAMPLE DATA IS INVENTED ON PURPOSE (world.ts): "Trường Đại học Mẫu" and the made-up issuers "Sở Mẫu" (…-SMẪU) and "Bộ Mẫu" (…-BMẪU).
// Never put a real ministry document number or a real validity date in it — the page is public and the "replaced / expired" relations
// shown in the images would read as legal statements. tests/unit/guides.test.ts fails on any document number that does not end in an invented issuer.
//
// WHY A SCRIPT IN THIS REPO AND NOT A THROWAWAY FOLDER: the guide has to be re-shot whenever the desktop UI moves, and the sample
// store is the site's business (it is public copy), so both live next to `capture-product-images.mjs`. Nothing is written inside the
// desktop checkout: the harness is copied to a temp dir, the desktop's `node_modules` is symlinked into it (so React/Vite/zod are the
// desktop's own copies, not the site's React 19), Vite runs from there with its cache in the temp dir, and the folder is removed at the end.
import { spawn } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const args = process.argv.slice(2)
const only = (args.find((a) => a.startsWith('--only='))?.slice(7) ?? '').split(',').filter(Boolean)
const positional = args.filter((a) => !a.startsWith('--'))
// Everything is anchored on this file, not on the current directory: `node scripts/capture-guide-images.mjs` and
// `cd scripts && node capture-guide-images.mjs` write the same files.
const siteRoot = resolve(import.meta.dirname, '..')
const desktop = resolve(positional[0] ?? process.env.DOCOPS_DESKTOP ?? join(siteRoot, '..', 'docops-application', 'packages', 'desktop'))
const outDir = join(siteRoot, 'public', 'images', 'guide')
const harness = join(import.meta.dirname, 'guide-capture')
const WIDTH = 1600
/** The one moment every shot is taken at — the sample store's own "today" (world.ts), 09:42 in Vietnam, as a UTC INSTANT so a machine in
 * another zone does not drift; the browser context is pinned to the same zone below. */
const NOW = new Date('2026-10-18T02:42:00Z')
const TIMEZONE = 'Asia/Ho_Chi_Minh'

const viteBin = join(desktop, 'node_modules', '.bin', 'vite')
if (!existsSync(viteBin) || !existsSync(join(desktop, 'src', 'renderer', 'App.tsx'))) {
  console.error(`Không thấy desktop đã cài ở ${desktop} (cần node_modules/.bin/vite và src/renderer). Truyền đường dẫn packages/desktop.`)
  process.exit(1)
}

// ── One shot = how to reach the screen + what to photograph ─────────────────────────────────────────────────────────
const sidebar = (page, name) => page.getByRole('button', { name: new RegExp(`^${name}`) }).first().click()
const settle = (page, ms = 700) => page.waitForTimeout(ms)
async function openSettings(page) {
  await sidebar(page, 'Cài đặt')
  await page.getByText('Hoạt động gần đây của agent').waitFor()
  await settle(page, 900)
}
const card = (page, title) => page.locator('section', { has: page.getByRole('heading', { name: title, exact: true }) })

/** Union of the boxes of some locators, grown by `pad` — the region a crop photographs. */
async function boxAround(locators, pad = 14) {
  const boxes = []
  for (const l of locators) boxes.push(await l.boundingBox())
  const x = Math.min(...boxes.map((b) => b.x)) - pad
  const y = Math.min(...boxes.map((b) => b.y)) - pad
  const right = Math.max(...boxes.map((b) => b.x + b.width)) + pad
  const bottom = Math.max(...boxes.map((b) => b.y + b.height)) + pad
  return { x: Math.max(0, x), y: Math.max(0, y), width: right - Math.max(0, x), height: bottom - Math.max(0, y) }
}

const SHOTS = [
  {
    id: 'bat-dau', height: 900, quality: 84,
    async go(page) { await page.getByText('Rủi ro cao nhất').waitFor(); await settle(page) },
  },
  {
    id: 'nap-van-ban', height: 1300, scale: 2, quality: 84,
    async go(page) {
      await page.getByText('Rủi ro cao nhất').waitFor()
      await page.evaluate(() => { window.__fake.ingest = 'running' })
      await page.evaluate(() => window.__emit('progress'))
      await page.getByRole('button', { name: /Nạp văn bản|Đang nạp/ }).first().click()
      await page.getByRole('dialog', { name: 'Nạp văn bản' }).waitFor()
      await page.getByText('CV-412-ke-hoach-giang-day.pdf').waitFor()
      // Photograph the window alone on a plain dim: the screen behind it would show as cut-off slivers either side of the crop.
      await page.evaluate(() => {
        let node = document.querySelector('[role="dialog"]')
        while (node && node.id !== 'goc') {
          for (const sib of node.parentElement.children) if (sib !== node) sib.style.visibility = 'hidden'
          node = node.parentElement
        }
      })
      await settle(page, 900)
    },
    clip: (page) => boxAround([page.getByRole('dialog', { name: 'Nạp văn bản' })], 24),
  },
  {
    id: 'kho-van-ban', height: 900, quality: 84,
    async go(page) {
      await sidebar(page, 'Kho văn bản')
      await page.getByRole('textbox', { name: /Lọc trong kho/ }).fill('tốt nghiệp')
      await page.getByText('khớp trong nội dung').first().waitFor()
      await page.getByText('QĐ 118/QĐ-ĐHM').first().click()
      await page.getByText('CHI TIẾT VĂN BẢN').waitFor()
      await page.getByText(/Trang 1\/8/).waitFor()
      await settle(page, 900)
    },
  },
  {
    id: 'tra-cuu', height: 900, quality: 84,
    async go(page) {
      await sidebar(page, 'Tra cứu')
      await page.getByRole('searchbox').fill('05/QĐ-SMẪU')
      await page.getByText('3 văn bản dẫn').waitFor()
      await page.getByText('Hỏi về kho văn bản của đơn vị').waitFor()
      await settle(page, 900)
    },
  },
  {
    id: 'hoi-ai', height: 900, quality: 84,
    async go(page) {
      await page.evaluate(() => { window.__fake.chat = 'answered' })
      await sidebar(page, 'Tra cứu')
      await page.getByRole('searchbox').fill('tốt nghiệp')
      await page.getByText('Điều kiện xét công nhận tốt nghiệp nằm ở').waitFor()
      await settle(page, 900)
    },
  },
  {
    id: 'ra-soat', height: 1560, quality: 84,
    async go(page) {
      await sidebar(page, 'Rà soát')
      await page.getByText('CĂN CỨ PHÁP LÝ').waitFor()
      await page.getByText(/Căn cứ Quyết định số 05\/QĐ-SMẪU/).first().click()
      await settle(page, 900)
    },
  },
  {
    id: 'do-thi', height: 900, quality: 84,
    async go(page) {
      await sidebar(page, 'Đồ thị')
      await page.getByText('QĐ 12/QĐ-ĐHM').first().waitFor()
      await settle(page, 1500)
      await page.mouse.move(740, 520)
      for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 200); await settle(page, 150) }
      await settle(page, 700)
      // Drag the background so the whole cluster sits inside the canvas.
      await page.mouse.move(1000, 750); await page.mouse.down(); await page.mouse.move(1185, 810, { steps: 8 }); await page.mouse.up()
      await settle(page, 500)
      await page.getByText('QĐ 12/QĐ-ĐHM').first().click()
      await page.getByText('KÉO THEO').waitFor()
      await settle(page, 700)
    },
  },
  {
    id: 'soan-thao', height: 1180, quality: 84,
    async go(page) {
      await sidebar(page, 'Soạn thảo')
      await page.getByText('Ý CHÍNH').waitFor()
      await settle(page, 1200)
    },
  },
  {
    id: 'cai-dat', height: 1700, quality: 84,
    async go(page) { await openSettings(page) },
    // The two column stacks, without the sidebar and the top bar (shown in the first shot), down to the lowest card.
    clip: async (page) => {
      const low = await boxAround([card(page, 'Phản hồi'), card(page, 'Kết nối agent')], 0)
      return { x: 216, y: 62, width: 1128, height: low.y + low.height + 22 - 62 }
    },
  },
  {
    id: 'sao-luu', height: 1700, scale: 2, quality: 84,
    async go(page) { await openSettings(page) },
    clip: (page) => boxAround([card(page, 'Sao lưu & khôi phục'), card(page, 'Dung lượng lưu trữ')], 8),
  },
  {
    id: 'ket-noi-agent', height: 1700, scale: 2, quality: 84,
    async go(page) { await openSettings(page) },
    clip: (page) => boxAround([card(page, 'Kết nối agent')], 8),
  },
  {
    id: 'cau-hoi-thuong-gap', height: 1700, scale: 2, quality: 84,
    async go(page) { await openSettings(page) },
    clip: (page) => boxAround([card(page, 'Key & thiết bị')], 8),
  },
]

// ── Plumbing ────────────────────────────────────────────────────────────────────────────────────────────────────────
const freePort = () => new Promise((res) => {
  const s = createServer().listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => { res(port) }) })
})
async function waitFor200(url, ms) {
  const until = Date.now() + ms
  for (;;) {
    try { if ((await fetch(url)).ok) return } catch { /* not up yet */ }
    if (Date.now() > until) throw new Error(`Vite không lên sau ${ms / 1000}s`)
    await new Promise((r) => { setTimeout(r, 300) })
  }
}

const work = mkdtempSync(join(tmpdir(), 'docops-guide-capture-'))
let vite = null
let browser = null
const problems = []
try {
  cpSync(harness, work, { recursive: true })
  symlinkSync(join(desktop, 'node_modules'), join(work, 'node_modules'))
  const port = await freePort()
  vite = spawn(viteBin, ['--config', join(work, 'vite.config.ts'), '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: desktop, env: { ...process.env, DOCOPS_DESKTOP: desktop }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  vite.stderr.on('data', (d) => { const t = String(d); if (/error/i.test(t)) console.error(t) })
  const url = `http://127.0.0.1:${port}/`
  await waitFor200(url, 60_000)

  mkdirSync(outDir, { recursive: true })
  browser = await chromium.launch()
  let total = 0
  for (const shot of SHOTS) {
    if (only.length > 0 && !only.includes(shot.id)) continue
    const context = await browser.newContext({ viewport: { width: WIDTH, height: shot.height }, deviceScaleFactor: shot.scale ?? 1, locale: 'vi-VN', timezoneId: TIMEZONE })
    await context.clock.setFixedTime(NOW)
    await context.addInitScript(() => { try { localStorage.setItem('uiMode', 'classic'); localStorage.setItem('theme', 'light') } catch { /* private mode */ } })
    const page = await context.newPage()
    page.on('console', (m) => { if (/\[fake\] (NO HANDLER|CONTRACT|BAD INPUT)/.test(m.text())) problems.push(`${shot.id}: ${m.text().slice(0, 300)}`) })
    page.on('pageerror', (e) => { problems.push(`${shot.id}: pageerror ${String(e).slice(0, 300)}`) })
    const before = problems.length
    await page.goto(url)
    await shot.go(page)
    // A screen that quietly drew its error or EMPTY face is a wrong photograph, not a missing one.
    const face = await page.evaluate(() => document.getElementById('goc')?.textContent ?? '')
    const bad = face.match(/Chưa có văn bản nào|Kho còn trống|Không có lệnh này|Phản hồi sai hợp đồng|Không mở được|Mã lỗi:|Đang mở DocOps/)
    if (bad !== null) problems.push(`${shot.id}: màn đang hiện mặt rỗng/lỗi ("${bad[0]}")`)
    const clip = shot.clip === undefined ? undefined : await shot.clip(page)
    const png = await page.screenshot({ type: 'png', ...(clip === undefined ? {} : { clip }) })
    if (problems.length > before) {
      console.error(`${shot.id.padEnd(20)} BỎ QUA — không ghi đè ảnh cũ bằng một màn sai`)
      await context.close()
      continue
    }
    const file = join(outDir, `${shot.id}.webp`)
    const info = await sharp(png).webp({ quality: shot.quality ?? 78, effort: 6 }).toFile(file)
    total += info.size
    console.log(`${shot.id.padEnd(20)} ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`)
    await context.close()
  }
  console.log(`tổng ${Math.round(total / 1024)} KB`)
  if (problems.length > 0) {
    console.error('\nẢNH CHỤP CÓ THỂ SAI (lệnh giả chưa đúng hợp đồng IPC, hoặc màn đang hiện mặt rỗng/lỗi):\n' + problems.join('\n'))
    process.exitCode = 1
  }
} finally {
  if (browser !== null) await browser.close()
  if (vite !== null) vite.kill('SIGTERM')
  rmSync(work, { recursive: true, force: true })
}
