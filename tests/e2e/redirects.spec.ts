import { expect, test } from '@playwright/test'

test('old web-app paths redirect permanently', async ({ request }) => {
  const key = await request.get('/xin-key', { maxRedirects: 0 })
  expect([301, 308]).toContain(key.status())
  expect(key.headers()['location']).toBe('/lien-he')
  const login = await request.get('/login', { maxRedirects: 0 })
  expect([301, 308]).toContain(login.status())
  expect(login.headers()['location']).toBe('/')
})

test('metadata routes and security headers', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  // 17 trang (cài đặt có 2 hệ điều hành) × 2 ngôn ngữ = 34; Hướng dẫn sử dụng là 2 trong số đó (17/10)
  expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(34)
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap: ')
  const home = await request.get('/')
  expect(home.headers()['x-content-type-options']).toBe('nosniff')
  expect(home.headers()['x-frame-options']).toBe('DENY')
  const og = await request.get('/opengraph-image')
  expect(og.headers()['content-type']).toContain('image/png')
})

test('llms.txt exists and unknown dotted paths are 404, not 500', async ({ request }) => {
  const llms = await request.get('/llms.txt')
  expect(llms.status()).toBe(200)
  expect(llms.headers()['content-type']).toContain('text/plain')
  expect(await llms.text()).toMatch(/^# Agentra DocOps/)
  for (const path of ['/khong-ton-tai.txt', '/wp-login.php', '/vi.json']) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(404)
  }
})
