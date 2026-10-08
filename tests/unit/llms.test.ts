import { beforeAll, expect, test } from 'vitest'
import { TOPIC_IDS, TOPICS } from '@/content/topics'
import { brand } from '@/lib/seo/brand'
import { homeFaq, linkText, llmsFullTxt, llmsTxt, type LlmsInput } from '@/lib/seo/llms'

const SITE = 'https://docops.agentra.io.vn'
const input: LlmsInput = {
  release: { version: '1.2.1', releaseDate: '2026-10-01T08:00:00.000Z' },
  privacy: { vi: { title: 'Chính sách bảo mật', description: 'vi' }, en: { title: 'Privacy policy', description: 'en' } },
}

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = SITE
})

test('llms.txt opens with the canonical description and disambiguation', () => {
  const txt = llmsTxt(input)
  expect(txt.startsWith(`# Agentra DocOps\n\n> ${brand.description.vi}\n\n${brand.description.en}\n`)).toBe(true)
  expect(txt).toContain(brand.disambiguation.vi)
  expect(txt).toContain(brand.disambiguation.en)
  expect(txt).toContain('DocOps Uranus 1.2.1 (2026-10-01)')
})

test('llms.txt links every topic and page on the canonical origin', () => {
  const txt = llmsTxt(input)
  for (const id of TOPIC_IDS) {
    expect(txt).toContain(`](${SITE}/en/${id}): ${TOPICS.en[id].description}`)
    expect(txt).toContain(TOPICS.vi[id].description)
  }
  for (const path of ['/tai-ve', '/en/download', '/huong-dan-cai-dat/macos', '/en/privacy', '/llms-full.txt', '/sitemap.xml']) expect(txt).toContain(`${SITE}${path}`)
  const links = [...txt.matchAll(/\]\((https?:[^)]+)\)/g)].map((m) => m[1])
  expect(links.length).toBeGreaterThan(20)
  for (const l of links) expect(l.startsWith(SITE)).toBe(true)
  expect(txt).not.toMatch(/localhost|vercel\.app/)
})

test('llms-full.txt carries the topic pages and the home FAQ as rendered', () => {
  const full = llmsFullTxt(input)
  for (const id of TOPIC_IDS) {
    for (const locale of ['vi', 'en'] as const) {
      const c = TOPICS[locale][id]
      expect(full).toContain(`## ${c.h1}`)
      expect(full).toContain(`**${c.definition.term}** ${c.definition.rest}`)
      for (const f of c.faq) expect(full).toContain(f.a)
    }
  }
  const [q0] = homeFaq('vi')
  expect(q0.a.startsWith(brand.description.vi)).toBe(true)
  expect(full).not.toContain('{description}')
})

test('external links keep their own URL in llms-full.txt', () => {
  expect(linkText('vi', { href: 'https://help.openai.com/en/articles/7730893-data-controls-faq', label: 'Data Controls FAQ' })).toBe(
    'Data Controls FAQ (https://help.openai.com/en/articles/7730893-data-controls-faq)',
  )
})
