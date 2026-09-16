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

test('unknown paths give a localized 404', async ({ page }) => {
  const vi = await page.goto('/khong-co-trang-nay')
  expect(vi?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText('Không tìm thấy trang')
  const en = await page.goto('/en/no-such-page')
  expect(en?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText('Page not found')
})
