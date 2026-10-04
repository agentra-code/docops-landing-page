import type { Locale } from '@/i18n/routing'
import { productName } from '@/lib/releases/codename'
import type { ReleaseAsset } from '@/lib/releases/types'
import { site } from '@/lib/site'
import { brand } from './brand'
import { absoluteUrl } from './urls'

type JsonLd = Record<string, unknown>
const CONTEXT = 'https://schema.org'

/**
 * `@id` ổn định nối các thực thể của mọi trang thành một đồ thị (Google, AI đọc DocOps, Agentra và site là một).
 * Tổ chức lấy id trên site của công ty vì agentra.io.vn là trang chính thức của Agentra JSC.
 */
export const ids = {
  organization: () => `${site.companyUrl}/#organization`,
  website: () => `${site.siteUrl()}/#website`,
  software: () => `${site.siteUrl()}/#software`,
}

/** Logo vuông PNG (Google không nhận SVG làm logo). File convention app/apple-icon.png, 180×180. */
const logo = () => ({ '@type': 'ImageObject', url: `${site.siteUrl()}/apple-icon.png`, width: 180, height: 180 })

/** Tổ chức ghi đủ tên (validator chỉ đọc một trang, không theo được `@id` về trang chủ). */
function publisher(): JsonLd {
  return { '@type': 'Organization', '@id': ids.organization(), name: site.company, url: site.companyUrl, logo: logo() }
}

export function organization(locale: Locale): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': ids.organization(),
    name: site.company,
    alternateName: 'Agentra',
    url: site.companyUrl,
    logo: logo(),
    description: brand.organization[locale],
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Đà Nẵng', addressCountry: 'VN' },
    contactPoint: [{ '@type': 'ContactPoint', email: site.email, contactType: 'customer support', availableLanguage: ['vi', 'en'] }],
    // sameAs: thêm khi Agentra có hồ sơ thật (LinkedIn, Facebook, YouTube…), dùng nguyên văn brand.description ở đó.
  }
}

export function website(locale: Locale): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': ids.website(),
    url: absoluteUrl('vi', '/'),
    name: brand.name,
    alternateName: brand.alternateName,
    description: brand.description[locale],
    inLanguage: ['vi', 'en'],
    publisher: { '@id': ids.organization() },
  }
}

/**
 * Ứng dụng: phiên bản và ngày lấy từ feed. Không có `offers`/`aggregateRating`: giá chưa công khai (tải miễn phí,
 * chi phí sử dụng theo báo giá) và chưa có đánh giá thật. Giao diện ứng dụng là tiếng Việt nên `inLanguage` luôn 'vi'.
 */
export function softwareApplication(assets: ReleaseAsset[], locale: Locale): JsonLd {
  const newest = [...assets].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0]
  const shot = (name: string) => `${site.siteUrl()}/images/product/${name}.webp`
  return {
    '@context': CONTEXT,
    '@type': 'SoftwareApplication',
    '@id': ids.software(),
    name: brand.name,
    alternateName: newest ? [brand.alternateName, productName(newest.version)] : brand.alternateName,
    url: absoluteUrl(locale, '/'),
    description: brand.description[locale],
    disambiguatingDescription: brand.disambiguation[locale],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: brand.category[locale],
    operatingSystem: 'Windows 10, Windows 11, macOS 13+',
    inLanguage: 'vi',
    featureList: brand.features[locale],
    audience: { '@type': 'Audience', audienceType: brand.audience[locale] },
    keywords: brand.keywords[locale].join(', '),
    image: shot('rasoat'),
    screenshot: ['rasoat', 'tracuu', 'dothi', 'soanthao', 'khovanban'].map(shot),
    downloadUrl: absoluteUrl(locale, '/download'),
    softwareHelp: { '@type': 'CreativeWork', url: absoluteUrl(locale, '/install/[os]', { os: 'windows' }) },
    publisher: publisher(),
    ...(newest ? { softwareVersion: newest.version, datePublished: newest.releaseDate.slice(0, 10) } : {}),
  }
}

/** Trang chủ đề: WebPage nói rõ chủ đề (`about`), sản phẩm được nhắc tới và thuộc site nào. */
export function webPage(input: {
  url: string
  name: string
  description: string
  locale: Locale
  about: string
  keywords: string[]
  image: string
  dateModified: string
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: input.locale,
    about: { '@type': 'Thing', name: input.about },
    keywords: input.keywords.join(', '),
    primaryImageOfPage: { '@type': 'ImageObject', url: input.image },
    dateModified: input.dateModified,
    isPartOf: { '@type': 'WebSite', '@id': ids.website(), name: brand.name, url: absoluteUrl('vi', '/') },
    mentions: { '@type': 'SoftwareApplication', '@id': ids.software(), name: brand.name, url: absoluteUrl(input.locale, '/') },
    publisher: publisher(),
  }
}

export function faqPage(items: Array<{ q: string; a: string }>): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

export function breadcrumb(items: Array<{ name: string; url: string }>): JsonLd & { itemListElement: unknown[] } {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

export function howTo(input: { name: string; description: string; steps: Array<{ name: string; text: string }> }): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })),
  }
}
