import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/download': { vi: '/tai-ve', en: '/download' },
    '/install/[os]': { vi: '/huong-dan-cai-dat/[os]', en: '/install/[os]' },
    '/how-it-works': { vi: '/quy-trinh', en: '/how-it-works' },
    '/ai-transparency': { vi: '/minh-bach-ai', en: '/ai-transparency' },
    '/contact': { vi: '/lien-he', en: '/contact' },
    '/privacy': { vi: '/chinh-sach-bao-mat', en: '/privacy' },
    // Trang chủ đề: slug = từ khoá chính của trang (bản đồ từ khoá ở lib/seo/brand.ts)
    '/decree-30-drafting': { vi: '/soan-thao-van-ban-nghi-dinh-30', en: '/decree-30-drafting' },
    '/legal-basis-review': { vi: '/ra-soat-can-cu-phap-ly', en: '/legal-basis-review' },
    '/ai-document-search': { vi: '/tra-cuu-van-ban-ai', en: '/ai-document-search' },
    '/ai-for-universities': { vi: '/chuyen-doi-so-van-thu-truong-dai-hoc', en: '/ai-for-universities' },
    '/ai-for-organizations': { vi: '/ai-van-ban-co-quan-doanh-nghiep', en: '/ai-for-organizations' },
    '/administrative-document-types': { vi: '/cac-loai-van-ban-hanh-chinh', en: '/administrative-document-types' },
    '/administrative-document-format': { vi: '/the-thuc-van-ban-hanh-chinh', en: '/administrative-document-format' },
  },
})

export type Locale = (typeof routing.locales)[number]
export type PageKey = keyof typeof routing.pathnames
