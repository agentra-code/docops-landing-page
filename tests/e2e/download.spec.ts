import { expect, test } from '@playwright/test'

const FEED = /^https:\/\/download-docsopapp\.agentra\.io\.vn\/desktop\/.+\.(exe|dmg)$/

test('download page lists the three installers from the feed', async ({ page }) => {
  await page.goto('/tai-ve')
  const links = page.locator('main a[download]')
  await expect(links).toHaveCount(3)
  const hrefs = await links.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))
  for (const href of hrefs) expect(href).toMatch(FEED)
  expect(hrefs.some((h) => h.includes('DocOps%20Setup'))).toBe(true)
  expect(hrefs.some((h) => h.endsWith('-arm64.dmg'))).toBe(true)
  // SHA-512 ẩn mặc định sau dòng gập; mở một thẻ mới thấy hash và nút sao chép.
  const toggles = page.locator('main details > summary')
  await expect(toggles).toHaveCount(3)
  await expect(page.locator('main details code')).toHaveCount(3)
  await expect(page.locator('main details code').first()).toBeHidden()
  await toggles.first().click()
  await expect(page.locator('main details code').first()).toBeVisible()
})

test('home page download block links the same three installers', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#tai-ve a[download]')).toHaveCount(3)
})
