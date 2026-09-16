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
  },
})

export type Locale = (typeof routing.locales)[number]
export type PageKey = keyof typeof routing.pathnames
