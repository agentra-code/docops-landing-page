import { beforeAll, expect, test, vi } from 'vitest'

vi.mock('@/lib/releases/feed', () => ({ fetchFeed: async () => null }))

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://docops.agentra.io.vn'
})

test('absoluteUrl localizes slugs and prefixes', async () => {
  const { absoluteUrl } = await import('@/lib/seo/urls')
  expect(absoluteUrl('vi', '/')).toBe('https://docops.agentra.io.vn/')
  expect(absoluteUrl('en', '/')).toBe('https://docops.agentra.io.vn/en')
  expect(absoluteUrl('vi', '/download')).toBe('https://docops.agentra.io.vn/tai-ve')
  expect(absoluteUrl('en', '/install/[os]', { os: 'macos' })).toBe('https://docops.agentra.io.vn/en/install/macos')
  expect(absoluteUrl('vi', '/install/[os]', { os: 'windows' })).toBe('https://docops.agentra.io.vn/huong-dan-cai-dat/windows')
})

test('buildMetadata emits canonical + hreflang with x-default = vi', async () => {
  const { buildMetadata } = await import('@/lib/seo/metadata')
  const m = buildMetadata({ locale: 'en', page: '/contact', title: 'Contact', description: 'd' })
  expect(m.alternates?.canonical).toBe('https://docops.agentra.io.vn/en/contact')
  expect(m.alternates?.languages).toEqual({
    vi: 'https://docops.agentra.io.vn/lien-he',
    en: 'https://docops.agentra.io.vn/en/contact',
    'x-default': 'https://docops.agentra.io.vn/lien-he',
  })
  expect(m.openGraph).toMatchObject({ locale: 'en_US', siteName: 'Agentra DocOps', url: 'https://docops.agentra.io.vn/en/contact' })
  const home = buildMetadata({ locale: 'vi', page: '/', title: 'T', description: 'd', absoluteTitle: true })
  expect(home.title).toEqual({ absolute: 'T' })
})

test('sitemap lists 16 urls with alternates and feed-based lastModified for the download page', async () => {
  const { default: sitemap } = await import('@/app/sitemap')
  const entries = await sitemap()
  expect(entries).toHaveLength(16)
  const urls = entries.map((e) => e.url)
  expect(urls).toContain('https://docops.agentra.io.vn/')
  expect(urls).toContain('https://docops.agentra.io.vn/en/install/windows')
  const dl = entries.find((e) => e.url.endsWith('/tai-ve'))!
  expect(dl.alternates?.languages).toMatchObject({ en: 'https://docops.agentra.io.vn/en/download', 'x-default': 'https://docops.agentra.io.vn/tai-ve' })
  expect((dl.lastModified as Date).toISOString().startsWith('2026-09-15')).toBe(true)
})
