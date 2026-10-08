import { expect, test } from '@playwright/test'

test('mobile menu opens with the four nav links and a download button', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Mở menu' })
  await expect(toggle).toBeVisible()
  await toggle.click()
  const nav = page.locator('#mobile-nav')
  await expect(nav.locator('nav').getByRole('link')).toHaveCount(4)
  await expect(nav.getByRole('link', { name: 'Tải DocOps' })).toBeVisible()
  await nav.getByRole('link', { name: 'Tải về' }).click()
  await expect(page).toHaveURL(/\/tai-ve$/)
  await expect(page.locator('#mobile-nav')).toHaveCount(0)
})

// toBeVisible vẫn qua khi panel bị cắt còn vài chục px hoặc bị thanh cookie đè: đo khung và bấm thử điểm giữa nút.
test('open mobile menu fills the screen below the header, above the consent bar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Đồng ý' })).toBeVisible()
  await page.getByRole('button', { name: 'Mở menu' }).click()
  const layout = await page.evaluate(() => {
    const panel = document.getElementById('mobile-nav')!.getBoundingClientRect()
    const header = document.querySelector('header')!.getBoundingClientRect()
    const cta = [...document.querySelectorAll('#mobile-nav a')].find((a) => a.textContent?.includes('Tải DocOps'))!
    const box = cta.getBoundingClientRect()
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
    return { top: panel.top, bottom: panel.bottom, headerBottom: header.bottom, vh: window.innerHeight, ctaOnTop: cta.contains(hit) }
  })
  expect(layout.top).toBeLessThanOrEqual(layout.headerBottom)
  expect(layout.bottom).toBe(layout.vh)
  expect(layout.ctaOnTop).toBe(true)
})

test('no horizontal overflow on the home page', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('the 29-type table scrolls inside its box, not the page', async ({ page }) => {
  await page.goto('/cac-loai-van-ban-hanh-chinh')
  await expect(page.locator('table tbody tr')).toHaveCount(29)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
