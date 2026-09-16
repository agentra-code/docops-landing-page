import { routing, type Locale, type PageKey } from '@/i18n/routing'
import { site } from '@/lib/site'

/**
 * Đường dẫn đã dịch của một trang theo locale, tính thuần từ `routing.pathnames` (không phụ thuộc runtime
 * của next-intl để dùng được trong sitemap, metadata và test). Cùng quy tắc `localePrefix: 'as-needed'`.
 */
export function localizedPath(locale: Locale, page: PageKey, params?: Record<string, string>): string {
  const entry = routing.pathnames[page]
  const template: string = typeof entry === 'string' ? entry : entry[locale]
  const path = template.replace(/\[(\w+)\]/g, (_, key: string) => encodeURIComponent(params?.[key] ?? ''))
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  if (path === '/') return prefix || '/'
  return `${prefix}${path}`
}

/** URL tuyệt đối của một trang theo locale. */
export function absoluteUrl(locale: Locale, page: PageKey, params?: Record<string, string>): string {
  return `${site.siteUrl()}${localizedPath(locale, page, params)}`
}
