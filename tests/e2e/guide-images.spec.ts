import { expect, test } from '@playwright/test'

// Hướng dẫn sử dụng: mười hai ảnh chụp giao diện phải TẢI ĐƯỢC trong trình duyệt (tệp có mặt, đúng định dạng, đường dẫn đúng) —
// tests/unit/guides.test.ts chỉ canh nguồn MDX và tệp trên đĩa, không canh việc máy chủ thật sự phát ảnh ra.
for (const path of ['/huong-dan-su-dung', '/en/user-guide']) {
  test(`${path}: all twelve screenshots load and keep the shape their width/height declare`, async ({ page }) => {
    await page.goto(path)
    const images = page.locator('main#main img[src^="/images/guide/"]')
    await expect(images).toHaveCount(12)
    for (let i = 0; i < 12; i++) {
      const img = images.nth(i)
      await img.scrollIntoViewIfNeeded() // `loading="lazy"` — the browser only fetches what comes near the viewport
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { message: await img.getAttribute('src') ?? '' }).toBe(true)
      const [natural, declared] = await img.evaluate((el: HTMLImageElement) => [
        [el.naturalWidth, el.naturalHeight], [Number(el.getAttribute('width')), Number(el.getAttribute('height'))],
      ])
      expect(natural).toEqual(declared)
    }
  })
}
