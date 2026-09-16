import type { Metadata } from 'next'
import type { Locale, PageKey } from '@/i18n/routing'
import { site } from '@/lib/site'
import { absoluteUrl } from './urls'

/** Metadata chuẩn cho một trang: canonical, hreflang (x-default = vi), Open Graph, Twitter (spec §9). */
export function buildMetadata(opts: {
  locale: Locale
  page: PageKey
  params?: Record<string, string>
  title: string
  description: string
}): Metadata {
  const { locale, page, params, title, description } = opts
  const url = absoluteUrl(locale, page, params)
  const vi = absoluteUrl('vi', page, params)
  const en = absoluteUrl('en', page, params)
  return {
    title,
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
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
