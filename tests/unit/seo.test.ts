import { beforeAll, expect, test, vi } from 'vitest'

vi.mock('@/lib/releases/feed', () => ({ fetchFeed: async () => null }))

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://docops.agentra.io.vn'
})

test('absoluteUrl localizes slugs and prefixes', async () => {
  const { absoluteUrl } = await import('@/lib/seo/urls')
  expect(absoluteUrl('vi', '/')).toBe('https://docops.agentra.io.vn')
  expect(absoluteUrl('en', '/')).toBe('https://docops.agentra.io.vn/en')
  expect(absoluteUrl('vi', '/download')).toBe('https://docops.agentra.io.vn/tai-ve')
  expect(absoluteUrl('en', '/install/[os]', { os: 'macos' })).toBe('https://docops.agentra.io.vn/en/install/macos')
  expect(absoluteUrl('vi', '/install/[os]', { os: 'windows' })).toBe('https://docops.agentra.io.vn/huong-dan-cai-dat/windows')
  expect(absoluteUrl('vi', '/legal-basis-review')).toBe('https://docops.agentra.io.vn/ra-soat-can-cu-phap-ly')
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

test('share images: own image for download and topic pages, shared image elsewhere', async () => {
  const { ogImageUrl } = await import('@/lib/seo/metadata')
  expect(ogImageUrl('vi', '/')).toBe('https://docops.agentra.io.vn/opengraph-image')
  expect(ogImageUrl('en', '/contact')).toBe('https://docops.agentra.io.vn/en/opengraph-image')
  expect(ogImageUrl('vi', '/download')).toBe('https://docops.agentra.io.vn/download/opengraph-image')
  expect(ogImageUrl('en', '/decree-30-drafting')).toBe('https://docops.agentra.io.vn/en/decree-30-drafting/opengraph-image')
})

test('sitemap lists every page in both locales, lastmod only from real dates', async () => {
  const { default: sitemap } = await import('@/app/sitemap')
  const { routing } = await import('@/i18n/routing')
  const entries = await sitemap()
  // 11 trang (cài đặt có 2 hệ điều hành) × 2 ngôn ngữ
  const pageCount = Object.keys(routing.pathnames).length + 1
  expect(entries).toHaveLength(pageCount * 2)
  const urls = entries.map((e) => e.url)
  expect(new Set(urls).size).toBe(urls.length)
  expect(urls).toContain('https://docops.agentra.io.vn')
  expect(urls).toContain('https://docops.agentra.io.vn/en/install/windows')
  expect(urls).toContain('https://docops.agentra.io.vn/soan-thao-van-ban-nghi-dinh-30')
  expect(urls).toContain('https://docops.agentra.io.vn/en/ai-for-universities')
  const dl = entries.find((e) => e.url.endsWith('/tai-ve'))!
  expect(dl.alternates?.languages).toMatchObject({ en: 'https://docops.agentra.io.vn/en/download', 'x-default': 'https://docops.agentra.io.vn/tai-ve' })
  const { releaseSnapshot } = await import('@/lib/releases/snapshot')
  const { parseFeeds } = await import('@/lib/releases/parse')
  const { latestRelease } = await import('@/lib/releases')
  const released = latestRelease(parseFeeds({ windows: releaseSnapshot.windows, mac: releaseSnapshot.mac }, 'https://x/'))!.releaseDate
  expect((dl.lastModified as Date).toISOString()).toBe(new Date(released).toISOString())
  // Không có ngày nội dung thật thì không ghi lastmod (không dùng giờ build)
  expect(entries.find((e) => e.url === 'https://docops.agentra.io.vn')).not.toHaveProperty('lastModified')
  expect(entries.find((e) => e.url.endsWith('/lien-he'))).not.toHaveProperty('lastModified')
  expect((entries.find((e) => e.url.endsWith('/ra-soat-can-cu-phap-ly'))!.lastModified as Date).toISOString().slice(0, 10)).toBe('2026-10-08')
})

test('robots allows everyone and names the AI crawlers', async () => {
  const { default: robots, AI_BOTS } = await import('@/app/robots')
  const r = robots()
  expect(r.sitemap).toBe('https://docops.agentra.io.vn/sitemap.xml')
  expect(r.rules).toEqual([
    { userAgent: '*', allow: '/' },
    { userAgent: AI_BOTS, allow: '/' },
  ])
  for (const bot of ['OAI-SearchBot', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended']) expect(AI_BOTS).toContain(bot)
})
