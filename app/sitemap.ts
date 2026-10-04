import type { MetadataRoute } from 'next'
import { CONTENT_UPDATED } from '@/content/dates'
import { GUIDE_OS } from '@/content/install'
import { TOPIC_IDS, TOPIC_META, topicPage } from '@/content/topics'
import { routing, type PageKey } from '@/i18n/routing'
import { getReleases, latestRelease } from '@/lib/releases'
import { absoluteUrl } from '@/lib/seo/urls'

/**
 * Mọi trang × 2 ngôn ngữ, kèm hreflang (spec §9). `lastModified` chỉ khi có ngày nội dung đổi thật
 * (ngày phát hành, `content/dates.ts`, `TOPIC_META.updated`); không có thì bỏ trống, không ghi giờ build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { assets } = await getReleases()
  const released = latestRelease(assets)?.releaseDate
  const entries: MetadataRoute.Sitemap = []
  const push = (page: PageKey, params?: Record<string, string>, updated?: string) => {
    const vi = absoluteUrl('vi', page, params)
    const en = absoluteUrl('en', page, params)
    for (const locale of routing.locales) {
      entries.push({
        url: locale === 'vi' ? vi : en,
        ...(updated ? { lastModified: new Date(updated) } : {}),
        alternates: { languages: { vi, en, 'x-default': vi } },
      })
    }
  }
  push('/')
  for (const id of TOPIC_IDS) push(topicPage(id), undefined, TOPIC_META[id].updated)
  push('/download', undefined, released)
  for (const os of GUIDE_OS) push('/install/[os]', { os }, CONTENT_UPDATED.install[os])
  push('/how-it-works')
  push('/ai-transparency', undefined, CONTENT_UPDATED.aiTransparency)
  push('/contact')
  push('/privacy', undefined, CONTENT_UPDATED.privacy)
  return entries
}
