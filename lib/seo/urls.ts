import { getPathname } from '@/i18n/navigation'
import type { Locale, PageKey } from '@/i18n/routing'
import { site } from '@/lib/site'

type Href = Parameters<typeof getPathname>[0]['href']

/** URL tuyệt đối của một trang theo locale (slug dịch, tiền tố /en khi cần). */
export function absoluteUrl(locale: Locale, page: PageKey, params?: Record<string, string>): string {
  const href = (params ? { pathname: page, params } : page) as Href
  return `${site.siteUrl()}${getPathname({ locale, href })}`
}
