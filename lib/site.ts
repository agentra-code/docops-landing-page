import type { Locale } from '@/i18n/routing'

/** Thông tin công ty tập trung một chỗ (spec §11). Điện thoại, Zalo, địa chỉ để trống thì thẻ tương ứng tự ẩn. */
export const site = {
  name: 'Agentra DocOps',
  shortName: 'DocOps',
  company: 'Agentra JSC',
  email: 'info@agentra.io.vn',
  city: { vi: 'Đà Nẵng', en: 'Da Nang' } satisfies Record<Locale, string>,
  country: { vi: 'Việt Nam', en: 'Vietnam' } satisfies Record<Locale, string>,
  companyUrl: 'https://agentra.io.vn',
  phone: '',
  zalo: '',
  address: '',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Agentra+JSC+%C4%90%C3%A0+N%E1%BA%B5ng',
  siteUrl(): string {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docops.agentra.io.vn').replace(/\/+$/, '')
  },
  feedUrl(): string {
    const url = process.env.DOWNLOAD_FEED_URL || 'https://download-docsopapp.agentra.io.vn/desktop/'
    return url.endsWith('/') ? url : `${url}/`
  },
}
