import { expect, test } from '@playwright/test'

test('mobile menu opens with the four nav links and a download button', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Mở menu' })
  await expect(toggle).toBeVisible()
  await toggle.click()
  const nav = page.locator('#mobile-nav')
  await expect(nav.getByRole('link')).toHaveCount(5)
  await nav.getByRole('link', { name: 'Tải về' }).click()
  await expect(page).toHaveURL(/\/tai-ve$/)
  await expect(page.locator('#mobile-nav')).toHaveCount(0)
})

test('no horizontal overflow on the home page', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
