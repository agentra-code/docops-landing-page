import { expect, test } from '@playwright/test'

// Build với NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST (xem ci.yml) để có gì đó mà gate.
test('GA4 loads only after consent; Vercel analytics is independent', async ({ page }) => {
  const gtm: string[] = []
  page.on('request', (r) => r.url().includes('googletagmanager.com') && gtm.push(r.url()))
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Đồng ý' })).toBeVisible()
  await page.waitForTimeout(800)
  expect(gtm).toHaveLength(0)
  await page.getByRole('button', { name: 'Đồng ý' }).click()
  await expect(page.getByRole('button', { name: 'Đồng ý' })).toHaveCount(0)
  await expect.poll(() => gtm.length, { timeout: 10_000 }).toBeGreaterThan(0)
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('docops.consent') ?? '{}'))
  expect(stored.value).toBe('granted')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Đồng ý' })).toHaveCount(0)
})

test('declining hides the bar and keeps GA off', async ({ page }) => {
  const gtm: string[] = []
  page.on('request', (r) => r.url().includes('googletagmanager.com') && gtm.push(r.url()))
  await page.goto('/en')
  await page.getByRole('button', { name: 'Decline' }).click()
  await page.waitForTimeout(800)
  expect(gtm).toHaveLength(0)
  await expect(page.getByRole('button', { name: 'Decline' })).toHaveCount(0)
})

// Build với NEXT_PUBLIC_CLARITY_PROJECT_ID=clarity-test (xem ci.yml). Thẻ thật bị thay bằng tệp rỗng: không phiên nào tới Microsoft,
// và hàng đợi của stub Clarity giữ nguyên các lệnh để đọc lại.
test('Microsoft Clarity loads only after consent and is told analytics storage is granted', async ({ page }) => {
  const clarity: string[] = []
  await page.route('https://www.clarity.ms/**', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }))
  page.on('request', (r) => r.url().includes('clarity.ms') && clarity.push(r.url()))
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Đồng ý' })).toBeVisible()
  await page.waitForTimeout(800)
  expect(clarity).toHaveLength(0)
  await page.getByRole('button', { name: 'Đồng ý' }).click()
  await expect.poll(() => clarity, { timeout: 10_000 }).toContain('https://www.clarity.ms/tag/clarity-test')
  const queue = await page.evaluate(() => (window as unknown as { clarity?: { q?: unknown[][] } }).clarity?.q?.map((args) => [...args]))
  expect(queue).toContainEqual(['consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' }])
})

test('declining keeps Microsoft Clarity off', async ({ page }) => {
  const clarity: string[] = []
  await page.route('https://www.clarity.ms/**', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }))
  page.on('request', (r) => r.url().includes('clarity.ms') && clarity.push(r.url()))
  await page.goto('/en')
  await page.getByRole('button', { name: 'Decline' }).click()
  await page.waitForTimeout(1500)
  expect(clarity).toHaveLength(0)
  expect(await page.evaluate(() => 'clarity' in window)).toBe(false)
})
