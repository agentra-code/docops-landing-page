import { expect, test } from '@playwright/test'

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
