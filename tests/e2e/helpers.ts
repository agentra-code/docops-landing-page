import type { Page } from '@playwright/test'

/**
 * Mở `url` (có `#id`) rồi đợi tới khi trình duyệt cuộn xong và vị trí đứng yên.
 * Site cuộn mượt (`scroll-behavior: smooth`, globals.css), nên đo ngay sau khi tải sẽ ra một vị trí giữa chừng; `reducedMotion` làm cuộn tức thì,
 * và đợi `scrollY` không đổi trong 10 khung hình liên tiếp để lazy-image phía trên không kịp đẩy bố cục sau lần đo.
 */
export async function openAtAnchor(page: Page, url: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(url)
  await page.waitForFunction(() => window.scrollY > 0)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let last = -1
        let still = 0
        const tick = () => {
          still = window.scrollY === last ? still + 1 : 0
          last = window.scrollY
          if (still >= 10) resolve()
          else requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }),
  )
}
