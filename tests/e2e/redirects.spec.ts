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
  expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(16)
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap: ')
  const home = await request.get('/')
  expect(home.headers()['x-content-type-options']).toBe('nosniff')
  expect(home.headers()['x-frame-options']).toBe('DENY')
  const og = await request.get('/opengraph-image')
  expect(og.headers()['content-type']).toContain('image/png')
})
