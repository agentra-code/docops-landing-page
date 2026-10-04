import { beforeAll, expect, test } from 'vitest'
import { brand } from '@/lib/seo/brand'
import { breadcrumb, faqPage, howTo, ids, organization, softwareApplication, webPage, website } from '@/lib/seo/jsonld'

const asset = {
  platform: 'windows-x64' as const,
  version: '1.0.0',
  fileName: 'DocOps Setup 1.0.0.exe',
  url: 'https://download-docsopapp.agentra.io.vn/desktop/DocOps%20Setup%201.0.0.exe',
  sizeBytes: 157058273,
  sha512: 'abc',
  releaseDate: '2026-09-15T15:22:00.690Z',
}

const SITE = 'https://docops.agentra.io.vn'
const ORG_ID = 'https://agentra.io.vn/#organization'
const LOGO = { '@type': 'ImageObject', url: `${SITE}/apple-icon.png`, width: 180, height: 180 }
const PUBLISHER = { '@type': 'Organization', '@id': ORG_ID, name: 'Agentra JSC', url: 'https://agentra.io.vn', logo: LOGO }

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = SITE
})

test('stable @ids tie the entities into one graph', () => {
  expect(ids.organization()).toBe(ORG_ID)
  expect(ids.website()).toBe(`${SITE}/#website`)
  expect(ids.software()).toBe(`${SITE}/#software`)
})

test('organization: PNG logo, description, contact', () => {
  expect(organization('vi')).toEqual({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Agentra JSC',
    alternateName: 'Agentra',
    url: 'https://agentra.io.vn',
    logo: LOGO,
    description: brand.organization.vi,
    email: 'info@agentra.io.vn',
    address: { '@type': 'PostalAddress', addressLocality: 'Đà Nẵng', addressCountry: 'VN' },
    contactPoint: [{ '@type': 'ContactPoint', email: 'info@agentra.io.vn', contactType: 'customer support', availableLanguage: ['vi', 'en'] }],
  })
})

test('website uses the canonical description and points at the organization', () => {
  expect(website('en')).toEqual({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'Agentra DocOps',
    alternateName: 'DocOps',
    description: brand.description.en,
    inLanguage: ['vi', 'en'],
    publisher: { '@id': ORG_ID },
  })
})

test('softwareApplication: feed version, disambiguation, Vietnamese UI, no offers or ratings', () => {
  const shot = (n: string) => `${SITE}/images/product/${n}.webp`
  expect(softwareApplication([asset], 'en')).toEqual({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#software`,
    name: 'Agentra DocOps',
    alternateName: ['DocOps', 'DocOps Uranus'],
    url: `${SITE}/en`,
    description: brand.description.en,
    disambiguatingDescription: brand.disambiguation.en,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: brand.category.en,
    operatingSystem: 'Windows 10, Windows 11, macOS 13+',
    inLanguage: 'vi',
    featureList: brand.features.en,
    audience: { '@type': 'Audience', audienceType: brand.audience.en },
    keywords: brand.keywords.en.join(', '),
    image: shot('rasoat'),
    screenshot: ['rasoat', 'tracuu', 'dothi', 'soanthao', 'khovanban'].map(shot),
    downloadUrl: `${SITE}/en/download`,
    softwareHelp: { '@type': 'CreativeWork', url: `${SITE}/en/install/windows` },
    publisher: PUBLISHER,
    softwareVersion: '1.0.0',
    datePublished: '2026-09-15',
  })
  const empty = softwareApplication([], 'vi')
  expect(empty).not.toHaveProperty('softwareVersion')
  expect(empty.alternateName).toBe('DocOps')
  for (const key of ['offers', 'aggregateRating', 'review']) expect(empty).not.toHaveProperty(key)
})

test('webPage names the topic, the product and the site in full', () => {
  expect(
    webPage({
      url: `${SITE}/ra-soat-can-cu-phap-ly`,
      name: 'T',
      description: 'D',
      locale: 'vi',
      about: 'Rà soát căn cứ pháp lý',
      keywords: ['a', 'b'],
      image: `${SITE}/images/product/rasoat.webp`,
      dateModified: '2026-10-04',
    }),
  ).toEqual({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE}/ra-soat-can-cu-phap-ly#webpage`,
    url: `${SITE}/ra-soat-can-cu-phap-ly`,
    name: 'T',
    description: 'D',
    inLanguage: 'vi',
    about: { '@type': 'Thing', name: 'Rà soát căn cứ pháp lý' },
    keywords: 'a, b',
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/images/product/rasoat.webp` },
    dateModified: '2026-10-04',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'Agentra DocOps', url: SITE },
    mentions: { '@type': 'SoftwareApplication', '@id': `${SITE}/#software`, name: 'Agentra DocOps', url: SITE },
    publisher: PUBLISHER,
  })
})

test('faqPage, breadcrumb, howTo', () => {
  expect(faqPage([{ q: 'A?', a: 'B' }])).toEqual({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{ '@type': 'Question', name: 'A?', acceptedAnswer: { '@type': 'Answer', text: 'B' } }],
  })
  expect(breadcrumb([{ name: 'Home', url: 'https://x/' }, { name: 'Download', url: 'https://x/tai-ve' }]).itemListElement).toEqual([
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://x/' },
    { '@type': 'ListItem', position: 2, name: 'Download', item: 'https://x/tai-ve' },
  ])
  const h = howTo({ name: 'Install', description: 'd', steps: [{ name: 's1', text: 't1' }] })
  expect(h).toMatchObject({ '@type': 'HowTo', step: [{ '@type': 'HowToStep', name: 's1', text: 't1', position: 1 }] })
})
