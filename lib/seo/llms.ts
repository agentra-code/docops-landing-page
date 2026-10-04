import { CONTENT_UPDATED } from '@/content/dates'
import { GUIDE_OS } from '@/content/install'
import { TOPIC_IDS, TOPIC_META, topicCopy, topicPage, type TopicBlock, type TopicCopy, type TopicLink } from '@/content/topics'
import { routing, type Locale } from '@/i18n/routing'
import { releaseLabel } from '@/lib/releases/codename'
import { site } from '@/lib/site'
import en from '@/messages/en.json'
import vi from '@/messages/vi.json'
import { brand } from './brand'
import { absoluteUrl } from './urls'

/*
 * /llms.txt (bản đồ site cho mô hình AI, chuẩn llmstxt.org) và /llms-full.txt (toàn văn trang chủ đề + hỏi đáp).
 * Sinh từ đúng các module nội dung mà trang dùng, không viết tay: trang đổi thì hai tệp này đổi theo.
 */

const MESSAGES = { vi, en }
type PageMeta = { title: string; description: string }
export type LlmsInput = { release: { version: string; releaseDate: string } | null; privacy: Record<Locale, PageMeta> }

const L = {
  vi: { solutions: 'Giải pháp (tiếng Việt)', pages: 'Trang sản phẩm (tiếng Việt)', home: 'Trang chủ', faq: 'Hỏi đáp thường gặp (tiếng Việt)', updated: 'Cập nhật' },
  en: { solutions: 'Solutions (English)', pages: 'Product pages (English)', home: 'Home', faq: 'Frequently asked questions (English)', updated: 'Updated' },
} satisfies Record<Locale, Record<string, string>>

function productPages(locale: Locale, privacy: PageMeta): Array<{ title: string; url: string; description: string }> {
  const m = MESSAGES[locale]
  return [
    { title: `${brand.name}: ${L[locale].home}`, url: absoluteUrl(locale, '/'), description: brand.description[locale] },
    { title: m.download.meta.title, url: absoluteUrl(locale, '/download'), description: m.download.meta.description },
    ...GUIDE_OS.map((os) => ({
      title: m.install.meta[os].title,
      url: absoluteUrl(locale, '/install/[os]', { os }),
      description: m.install.meta[os].description,
    })),
    { title: m.howItWorks.meta.title, url: absoluteUrl(locale, '/how-it-works'), description: m.howItWorks.meta.description },
    { title: m.transparency.meta.title, url: absoluteUrl(locale, '/ai-transparency'), description: m.transparency.meta.description },
    { title: m.contact.meta.title, url: absoluteUrl(locale, '/contact'), description: m.contact.meta.description },
    { title: privacy.title, url: absoluteUrl(locale, '/privacy'), description: privacy.description },
  ]
}

/** Hỏi đáp trang chủ, đúng như trang hiển thị (q0 chèn câu mô tả chuẩn). */
export function homeFaq(locale: Locale): Array<{ q: string; a: string }> {
  const faq = MESSAGES[locale].home.faq as unknown as Record<string, { q: string; a: string }>
  return Object.keys(faq)
    .filter((k) => /^q\d+$/.test(k))
    .map((k) => ({ q: faq[k].q, a: faq[k].a.replace('{description}', brand.description[locale]) }))
}

function facts(input: LlmsInput): string[] {
  const r = input.release
  return [
    `- Danh mục / Category: ${brand.category.vi} / ${brand.category.en}`,
    `- Nhà phát triển / Developer: ${site.company}, Đà Nẵng, Việt Nam (${site.companyUrl}) · ${site.email}`,
    '- Nền tảng / Platforms: ứng dụng desktop / desktop app, Windows 10/11 64-bit, macOS 13+ (Apple Silicon, Intel)',
    ...(r ? [`- Phiên bản mới nhất / Latest version: ${releaseLabel(r.version)} (${r.releaseDate.slice(0, 10)})`] : []),
    '- Ngôn ngữ giao diện ứng dụng / App language: tiếng Việt / Vietnamese',
    `- Đối tượng / Audience: ${brand.audience.vi} / ${brand.audience.en}`,
    '- Giá / Pricing: tải miễn phí, kích hoạt bằng key của đơn vị; chi phí sử dụng theo quy mô, liên hệ để báo giá / free to download, activated with an institution key; usage priced by scale, contact for a quote',
  ]
}

function header(input: LlmsInput): string[] {
  return [`# ${brand.name}`, '', `> ${brand.description.vi}`, '', brand.description.en, '', brand.disambiguation.vi, brand.disambiguation.en, '', ...facts(input)]
}

export function llmsTxt(input: LlmsInput): string {
  const lines = [
    ...header(input),
    '',
    '## Tính năng / Features',
    '',
    ...brand.features.vi.map((f) => `- ${f}`),
    '',
    ...brand.features.en.map((f) => `- ${f}`),
  ]
  for (const locale of routing.locales) {
    lines.push('', `## ${L[locale].solutions}`, '')
    for (const id of TOPIC_IDS) {
      const c = topicCopy(locale, id)
      lines.push(`- [${c.name}](${absoluteUrl(locale, topicPage(id))}): ${c.description}`)
    }
  }
  for (const locale of routing.locales) {
    lines.push('', `## ${L[locale].pages}`, '')
    for (const p of productPages(locale, input.privacy[locale])) lines.push(`- [${p.title}](${p.url}): ${p.description}`)
  }
  lines.push(
    '',
    '## Optional',
    '',
    `- [Toàn văn cho mô hình AI / Full text for AI models](${site.siteUrl()}/llms-full.txt): nội dung đầy đủ các trang giải pháp và hỏi đáp / full solution pages and FAQ`,
    `- [Sitemap](${site.siteUrl()}/sitemap.xml)`,
  )
  return `${lines.join('\n')}\n`
}

function linkText(locale: Locale, link: TopicLink): string {
  if ('topic' in link) return `${topicCopy(locale, link.topic).name} (${absoluteUrl(locale, topicPage(link.topic))})`
  return `${link.label} (${absoluteUrl(locale, link.page)})`
}

function blockMd(locale: Locale, b: TopicBlock): string[] {
  const out = [`### ${b.h2}`, '', ...(b.paras ?? []).flatMap((p) => [p, ''])]
  b.items?.forEach((it, i) => {
    const bullet = b.ordered ? `${i + 1}.` : '-'
    const title = it.title ? `**${it.title}**: ` : ''
    out.push(`${bullet} ${title}${it.text}${it.link ? ` ${linkText(locale, it.link)}` : ''}`)
  })
  if (b.items) out.push('')
  return out
}

function topicMd(locale: Locale, id: (typeof TOPIC_IDS)[number], c: TopicCopy): string[] {
  const out = [
    `## ${c.h1}`,
    '',
    `URL: ${absoluteUrl(locale, topicPage(id))} · ${L[locale].updated}: ${TOPIC_META[id].updated}`,
    '',
    c.lead,
    '',
    c.inShort,
    '',
    `### ${c.definition.h2}`,
    '',
    `**${c.definition.term}** ${c.definition.rest}`,
    '',
    ...(c.definition.paras ?? []).flatMap((p) => [p, '']),
  ]
  if (c.table) {
    out.push(`### ${c.table.h2}`, '', `| ${c.table.head.join(' | ')} |`, `| ${c.table.head.map(() => '---').join(' | ')} |`)
    for (const row of c.table.rows) out.push(`| ${row.join(' | ')} |`)
    out.push('')
  }
  for (const b of c.blocks) out.push(...blockMd(locale, b))
  out.push(`### ${MESSAGES[locale].topics.faqH2}`, '')
  for (const f of c.faq) out.push(`**${f.q}**`, f.a, '')
  return out
}

export function llmsFullTxt(input: LlmsInput): string {
  const lines = [...header(input), '']
  for (const locale of routing.locales) {
    lines.push(`## ${L[locale].faq}`, '', `URL: ${absoluteUrl(locale, '/')}`, '')
    for (const f of homeFaq(locale)) lines.push(`**${f.q}**`, f.a, '')
    for (const id of TOPIC_IDS) lines.push(...topicMd(locale, id, topicCopy(locale, id)))
  }
  lines.push(`Chính sách minh bạch AI / AI transparency: ${absoluteUrl('vi', '/ai-transparency')} (${CONTENT_UPDATED.aiTransparency})`)
  return `${lines.join('\n')}\n`
}
