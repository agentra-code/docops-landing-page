import type { Metadata } from 'next'
import { isTopicPage } from '@/content/topics'
import type { Locale, PageKey } from '@/i18n/routing'
import { site } from '@/lib/site'
import { absoluteUrl, localizedPath } from './urls'

/** Trang có ảnh OG riêng (file convention `opengraph-image.tsx` trong thư mục của trang); còn lại dùng ảnh chung. */
const hasOwnOgImage = (page: PageKey) => page === '/download' || isTopicPage(page)

/** URL tuyệt đối của ảnh chia sẻ 1200×630. Đường dẫn theo khoá nội bộ: không tiền tố với vi, /en với en. */
export function ogImageUrl(locale: Locale, page: PageKey): string {
  const prefix = localizedPath(locale, '/') === '/' ? '' : localizedPath(locale, '/')
  return `${site.siteUrl()}${prefix}${hasOwnOgImage(page) ? page : ''}/opengraph-image`
}

/** Metadata chuẩn cho một trang: canonical, hreflang (x-default = vi), Open Graph, Twitter (spec §9). */
export function buildMetadata(opts: {
  locale: Locale
  page: PageKey
  params?: Record<string, string>
  title: string
  description: string
  /** Trang chủ: không nối template '· Agentra DocOps'. */
  absoluteTitle?: boolean
}): Metadata {
  const { locale, page, params, title, description, absoluteTitle } = opts
  const url = absoluteUrl(locale, page, params)
  const vi = absoluteUrl('vi', page, params)
  const en = absoluteUrl('en', page, params)
  const ogImage = { url: ogImageUrl(locale, page), width: 1200, height: 630, alt: title }
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: { vi, en, 'x-default': vi } },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? 'en_US' : 'vi_VN',
      type: 'website',
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
  }
}
