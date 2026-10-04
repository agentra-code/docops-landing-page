import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { CONTENT_UPDATED } from '@/content/dates'
import { GUIDE_OS } from '@/content/install'
import { TOPIC_IDS, TOPIC_META, TOPICS } from '@/content/topics'
import { routing, type Locale } from '@/i18n/routing'
import { brand } from '@/lib/seo/brand'
import en from '@/messages/en.json'
import vi from '@/messages/vi.json'

/* Kiểm tra copy SEO lúc build: tiêu đề ≤ 60 ký tự kể cả hậu tố, mô tả 110–160, mỗi URL một từ khoá chính. */
const SUFFIX = ' · Agentra DocOps'
const len = (s: string) => [...s].length
const MESSAGES = { vi, en }
const LOCALES = routing.locales as readonly Locale[]

function expectTitle(where: string, title: string, absolute = false) {
  expect(len(absolute ? title : title + SUFFIX), `${where} title "${title}"`).toBeLessThanOrEqual(60)
}
function expectDescription(where: string, d: string) {
  expect(len(d), `${where} description (${len(d)}): ${d}`).toBeGreaterThanOrEqual(110)
  expect(len(d), `${where} description (${len(d)}): ${d}`).toBeLessThanOrEqual(160)
}

describe('brand', () => {
  test.each(LOCALES)('%s canonical description fits a meta description', (locale) => {
    expectDescription(`brand.${locale}`, brand.description[locale])
    expect(brand.description[locale].startsWith(brand.name)).toBe(true)
  })
})

describe('page metadata in messages', () => {
  test.each(LOCALES)('%s titles and descriptions', (locale) => {
    const m = MESSAGES[locale]
    expectTitle(`${locale} home`, m.home.meta.title, true)
    const pages = {
      download: m.download.meta,
      howItWorks: m.howItWorks.meta,
      transparency: m.transparency.meta,
      contact: m.contact.meta,
      ...Object.fromEntries(GUIDE_OS.map((os) => [`install.${os}`, m.install.meta[os]])),
    }
    for (const [key, meta] of Object.entries(pages)) {
      expectTitle(`${locale} ${key}`, meta.title)
      expect(len(meta.description), `${locale} ${key} description`).toBeLessThanOrEqual(160)
    }
  })
})

describe('topic pages', () => {
  for (const locale of LOCALES) {
    for (const id of TOPIC_IDS) {
      test(`${locale}/${id} search copy`, () => {
        const c = TOPICS[locale][id]
        expectTitle(`${locale}/${id}`, c.metaTitle)
        expectDescription(`${locale}/${id}`, c.description)
        expect(c.keywords.length).toBeGreaterThan(0)
        // Từ khoá chính phải có trong tiêu đề hoặc h1 (không phân biệt hoa thường)
        const primary = c.keywords[0].toLowerCase()
        expect(`${c.metaTitle} ${c.h1}`.toLowerCase(), `${locale}/${id} primary keyword`).toContain(primary)
        expect(c.faq.length).toBeGreaterThanOrEqual(4)
        expect(len(c.share.title), `${locale}/${id} share title`).toBeLessThanOrEqual(26)
        expect(c.blocks.length).toBeGreaterThanOrEqual(3)
      })
    }
    test(`${locale}: one primary keyword per URL`, () => {
      const primaries = TOPIC_IDS.map((id) => TOPICS[locale][id].keywords[0].toLowerCase())
      primaries.push(brand.keywords[locale][0].toLowerCase())
      expect(new Set(primaries).size).toBe(primaries.length)
    })
  }

  test('updated dates are real ISO dates, not in the future', () => {
    for (const id of TOPIC_IDS) {
      const d = TOPIC_META[id].updated
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(new Date(d).getTime()).toBeLessThanOrEqual(Date.now())
    }
  })

  test('slugs are lowercase kebab-case', () => {
    for (const entry of Object.values(routing.pathnames)) {
      const paths = typeof entry === 'string' ? [entry] : Object.values(entry)
      for (const p of paths) expect(p).toMatch(/^\/([a-z0-9]+(-[a-z0-9]+)*|\[\w+\])?(\/([a-z0-9]+(-[a-z0-9]+)*|\[\w+\]))*$/)
    }
  })
})

describe('content dates match the MDX sources', () => {
  test.each(LOCALES)('%s', (locale) => {
    const updated = (file: string) => readFileSync(file, 'utf8').match(/updated: '([\d-]+)'/)?.[1]
    for (const os of GUIDE_OS) expect(updated(`content/install/${locale}/${os}.mdx`)).toBe(CONTENT_UPDATED.install[os])
    expect(updated(`content/privacy/${locale}.mdx`)).toBe(CONTENT_UPDATED.privacy)
  })
})
