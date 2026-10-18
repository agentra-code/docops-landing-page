import { expect, test } from '@playwright/test'
import { openAtAnchor } from './helpers'

const PAGES: Array<[string, 'vi' | 'en']> = [
  ['/', 'vi'], ['/en', 'en'],
  ['/tai-ve', 'vi'], ['/en/download', 'en'],
  ['/huong-dan-cai-dat/macos', 'vi'], ['/huong-dan-cai-dat/windows', 'vi'],
  ['/en/install/macos', 'en'], ['/en/install/windows', 'en'],
  ['/quy-trinh', 'vi'], ['/en/how-it-works', 'en'],
  ['/minh-bach-ai', 'vi'], ['/en/ai-transparency', 'en'],
  ['/lien-he', 'vi'], ['/en/contact', 'en'],
  ['/chinh-sach-bao-mat', 'vi'], ['/en/privacy', 'en'],
  ['/ra-soat-can-cu-phap-ly', 'vi'], ['/en/legal-basis-review', 'en'],
  ['/ai-van-ban-co-quan-doanh-nghiep', 'vi'], ['/en/ai-for-organizations', 'en'],
  ['/soan-thao-van-ban-nghi-dinh-30', 'vi'], ['/en/decree-30-drafting', 'en'],
  ['/tra-cuu-van-ban-ai', 'vi'], ['/en/ai-document-search', 'en'],
  ['/chuyen-doi-so-van-thu-truong-dai-hoc', 'vi'], ['/en/ai-for-universities', 'en'],
  ['/cac-loai-van-ban-hanh-chinh', 'vi'], ['/en/administrative-document-types', 'en'],
  ['/the-thuc-van-ban-hanh-chinh', 'vi'], ['/en/administrative-document-format', 'en'],
  ['/docops-va-chatgpt', 'vi'], ['/en/docops-vs-chatgpt', 'en'],
  ['/huong-dan-su-dung', 'vi'], ['/en/user-guide', 'en'],
]

for (const [path, lang] of PAGES) {
  test(`${path} renders with SEO basics`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => m.type() === 'error' && !m.text().includes('/_vercel/') && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', lang)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(3)
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
    for (const s of await page.locator('script[type="application/ld+json"]').allTextContents()) JSON.parse(s)
    await expect(page.locator('main#main')).toHaveCount(1)
    expect(errors).toEqual([])
  })
}

test('locale switch keeps the current page', async ({ page }) => {
  await page.goto('/tai-ve')
  await page.locator('header').getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/download$/)
  await page.locator('header').getByRole('link', { name: 'VI', exact: true }).click()
  await expect(page).toHaveURL(/\/tai-ve$/)
})

test('locale switch keeps dynamic and topic pages', async ({ page }) => {
  await page.goto('/huong-dan-cai-dat/macos')
  await expect(page.locator('header').getByRole('link', { name: 'EN', exact: true })).toHaveAttribute('href', '/en/install/macos')
  await page.goto('/en/legal-basis-review')
  await expect(page.locator('header').getByRole('link', { name: 'VI', exact: true })).toHaveAttribute('href', '/ra-soat-can-cu-phap-ly')
})

test('topic page FAQ answers are in the DOM and match FAQPage JSON-LD', async ({ page }) => {
  await page.goto('/soan-thao-van-ban-nghi-dinh-30')
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((s) => JSON.parse(s))
  const faq = ld.find((d) => d['@type'] === 'FAQPage')
  expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4)
  for (const q of faq.mainEntity) {
    await expect(page.locator('details summary', { hasText: q.name })).toHaveCount(1)
    expect(await page.locator('details p').allTextContents()).toContain(q.acceptedAnswer.text)
  }
})

test('unknown paths give a localized 404', async ({ page }) => {
  const vi = await page.goto('/khong-co-trang-nay')
  expect(vi?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText('Không tìm thấy trang')
  const en = await page.goto('/en/no-such-page')
  expect(en?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText('Page not found')
})

test('home topic hub lists every topic page in three groups', async ({ page }) => {
  await page.goto('/')
  for (const label of ['Tính năng', 'Theo loại đơn vị', 'Kiến thức văn thư']) await expect(page.locator('main').getByText(label, { exact: true }).first()).toBeVisible()
  for (const href of [
    '/ra-soat-can-cu-phap-ly', '/soan-thao-van-ban-nghi-dinh-30', '/tra-cuu-van-ban-ai', '/chuyen-doi-so-van-thu-truong-dai-hoc',
    '/ai-van-ban-co-quan-doanh-nghiep', '/cac-loai-van-ban-hanh-chinh', '/the-thuc-van-ban-hanh-chinh', '/docops-va-chatgpt',
  ]) await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible()
})

// ── Hướng dẫn sử dụng (spec Dự án 2 §5.4, §7.3 W3–W4) ─────────────────────────────────────────────────────────────────────────────────
// Mười hai id này là CHÍNH chuỗi mà app desktop ghim (X1, tests/unit/guides.test.ts): app mở trang kèm `#<id>`.
const GUIDE_IDS = ['bat-dau', 'nap-van-ban', 'kho-van-ban', 'tra-cuu', 'hoi-ai', 'ra-soat', 'do-thi', 'soan-thao', 'cai-dat', 'sao-luu', 'ket-noi-agent', 'cau-hoi-thuong-gap']
const GUIDES = [
  { path: '/huong-dan-su-dung', lang: 'vi', keyword: /hướng dẫn sử dụng DocOps/i, bar: /^HDSD$/, download: '/tai-ve', install: ['/huong-dan-cai-dat/macos', '/huong-dan-cai-dat/windows'] },
  { path: '/en/user-guide', lang: 'en', keyword: /DocOps user guide/i, bar: /DocOps user guide/i, download: '/en/download', install: ['/en/install/macos', '/en/install/windows'] },
] as const

for (const g of GUIDES) {
  // Ảnh: tests/e2e/guide-images.spec.ts (cuộn tới từng ảnh vì loading="lazy", rồi đo naturalWidth).
  test(`${g.path}: the twelve section headings carry the ids the app opens, in order`, async ({ page }) => {
    await page.goto(g.path)
    const ids = await page.locator('main#main article h2[id]').evaluateAll((hs) => hs.map((h) => h.id))
    expect(ids).toEqual(GUIDE_IDS)
    // Mục lục bên trái trỏ đúng vào những id ấy.
    const toc = await page.locator('main#main aside a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    expect(toc).toEqual(GUIDE_IDS.map((id) => `#${id}`))
  })

  // Link `#id` trong trang (mục lục và hai câu tham chiếu chéo `#ra-soat`, `#sao-luu`) phải trỏ vào phần tử có thật, và id không trùng.
  test(`${g.path}: every in-page #link points at exactly one element`, async ({ page }) => {
    await page.goto(g.path, { waitUntil: 'domcontentloaded' })
    const hashes = await page.locator('main#main a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!.slice(1)))
    expect(hashes, 'the in-text cross references are found').toEqual(expect.arrayContaining(['ra-soat', 'sao-luu']))
    expect(hashes.length, 'toc (12) + cross references').toBeGreaterThanOrEqual(14)
    for (const id of new Set(hashes)) expect(await page.locator(`[id="${id}"]`).count(), `#${id}`).toBe(1)
  })

  // Header dính (72 px) không được che tiêu đề mục khi app mở trang kèm #id.
  for (const id of ['tra-cuu', 'cau-hoi-thuong-gap']) {
    test(`${g.path}#${id}: the section heading lands in the viewport, below the sticky header`, async ({ page }) => {
      await openAtAnchor(page, `${g.path}#${id}`)
      const header = (await page.locator('header').boundingBox())!
      const h = (await page.locator(`h2#${id}`).boundingBox())!
      const vh = page.viewportSize()!.height
      expect(h.y, 'heading top is below the header').toBeGreaterThanOrEqual(header.y + header.height)
      expect(h.y + h.height, 'heading bottom is inside the viewport').toBeLessThanOrEqual(vh)
    })
  }

  test(`${g.path}: every internal link in the article resolves`, async ({ page }) => {
    await page.goto(g.path)
    const hrefs = await page.locator('main#main a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!.split(/[#?]/)[0]!))])
    // Những link ĐÃ biết: một bộ chọn hỏng sẽ không thấy link nào và vòng lặp bên dưới xanh giả.
    expect(hrefs.length).toBeGreaterThanOrEqual(4)
    for (const href of hrefs) {
      const res = await page.request.get(href)
      expect(res.status(), href).toBe(200)
    }
  })

  test(`${g.path}: the header, footer, download page and both install guides link to it with the keyword as anchor`, async ({ page }) => {
    const link = (scope: string) => page.locator(`${scope} a[href="${g.path}"]`)
    // Chỉ cần HTML dựng sẵn (link nằm trong SSR), nên không đợi sự kiện load: trang tải kéo theo script/phông ngoài, một lần mạng chậm sẽ làm cả bài chậm theo.
    const goto = (url: string) => page.goto(url, { waitUntil: 'domcontentloaded' })
    const home = g.lang === 'vi' ? '/' : '/en'
    await goto(home)
    await expect(link('header nav')).toBeVisible() // khung desktop của dự án là 1280 px, đúng ngưỡng xl
    await expect(link('header nav')).toHaveText(g.bar) // thanh tiếng Việt viết tắt "HDSD" (PO 18/10); nhãn đầy đủ ở title
    await expect(link('header nav')).toHaveAttribute('title', g.keyword)
    await expect(link('footer')).toHaveCount(1)
    await expect(link('footer')).toHaveText(g.keyword)
    for (const from of [g.download, ...g.install]) {
      await goto(from)
      await expect(link('main#main'), from).toHaveCount(1)
      await expect(link('main#main'), from).toHaveText(g.keyword)
    }
  })

  // Nhãn là từ khoá chính nên dài (~170 px): thanh ngang chỉ đủ chỗ từ 1280 px. Hẹp hơn thì thanh giữ bốn mục như trước và không tràn ngang.
  test(`${g.path}: below 1280 px the header bar keeps its four items and does not overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 })
    await page.goto(g.lang === 'vi' ? '/' : '/en', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('header nav a:visible')).toHaveCount(4)
    await expect(page.locator(`header nav a[href="${g.path}"]`)).toBeHidden()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.locator('header nav a:visible')).toHaveCount(5)
  })

  test(`${g.path}: the footer link opens the guide and the header marks it as the current page`, async ({ page }) => {
    await page.goto(g.lang === 'vi' ? '/' : '/en')
    await page.locator(`footer a[href="${g.path}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${g.path}$`))
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('header nav a[aria-current="page"]')).toHaveAttribute('href', g.path)
  })
}

// ── Thanh điều hướng ở khổ desktop ───────────────────────────────────────────────────────────────────────────────────────────────────
// Container rộng tối đa 1200 px (nội dung 1136 px) nên MỌI khung ≥ 1200 px có cùng chỗ cho thanh. Chiều rộng cần của thanh với nhãn từ khoá chính
// "DocOps user guide" suýt vượt chỗ ấy: flex co các mục lại và nhãn bẻ làm hai dòng (cao 59 thay vì 37 px), logo cũng bẻ — mà không tràn ngang trang,
// nên chỉ đo `scrollWidth` thì không thấy. Phải ĐẾM DÒNG chữ của từng nhãn.
for (const width of [1100, 1280, 1366, 1920]) {
  for (const [path, lang] of [['/', 'vi'], ['/en', 'en']] as const) {
    test(`${path} at ${width}px: every header nav link and the logo text are on one line, and nothing overflows`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      await page.evaluate(() => document.fonts.ready) // phông chữ web đổi bề rộng chữ: đo sau khi nạp xong
      const m = await page.evaluate(() => {
        const lines = (el: Element) => {
          const r = document.createRange()
          r.selectNodeContents(el)
          return new Set([...r.getClientRects()].filter((q) => q.width > 0).map((q) => Math.round(q.top))).size
        }
        const header = document.querySelector('header')!
        const links = [...header.querySelectorAll('nav a')].filter((a) => (a as HTMLElement).offsetParent !== null)
        const logo = header.querySelector('a[href="/"], a[href="/en"]')!.querySelector('span:last-child')!
        const bar = header.firstElementChild as HTMLElement
        return {
          labels: links.map((a) => a.textContent),
          lines: links.map(lines),
          heights: links.map((a) => Math.round(a.getBoundingClientRect().height)),
          logoLines: lines(logo),
          // Mép phải của phần tử cuối so với mép phải vùng nội dung của container (trừ padding 32 px): `scrollWidth` không thấy chỗ tràn ≤ padding.
          // Âm = còn chỗ trống; dương = nội dung lấn ra padding (nhãn không bẻ dòng thì chỗ tràn lộ ở đây thay vì ở số dòng).
          spill: Math.round([...bar.children].filter((k) => (k as HTMLElement).offsetParent !== null).pop()!.getBoundingClientRect().right - (bar.getBoundingClientRect().right - parseFloat(getComputedStyle(bar).paddingRight))),
          pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
        }
      })
      expect(m.labels.length, `${lang} nav items at ${width}px: ${m.labels.join(' | ')}`).toBe(width >= 1280 ? 5 : 4)
      expect(m.lines, `lines per label: ${m.labels.join(' | ')}`).toEqual(m.labels.map(() => 1))
      expect(new Set(m.heights).size, `label heights ${m.heights}`).toBe(1)
      expect(m.logoLines, 'logo text lines').toBe(1)
      expect(m.spill, 'header content spills out of its container (px)').toBeLessThanOrEqual(0)
      expect(m.pageOverflow, 'page scrolls sideways').toBeLessThanOrEqual(0)
    })
  }
}
