import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { GUIDE_OS } from '@/content/install'
import { routing, type Locale, type PageKey } from '@/i18n/routing'
import { localizedPath } from '@/lib/seo/urls'
import en from '@/messages/en.json'
import vi from '@/messages/vi.json'

/*
 * Link nội bộ của trang Hướng dẫn sử dụng (spec Dự án 2 §5.4, W4) và của mọi trang MDX.
 *
 * MDX viết link bằng chuỗi (`](/minh-bach-ai)`), không qua `<Link>` của next-intl, nên không có kiểu nào bắt slug gõ sai hay link
 * tiếng Anh nằm trong trang tiếng Việt. Vitest không biên dịch MDX: các test đọc NGUỒN, như guides.test.ts.
 */

const LOCALES = routing.locales as readonly Locale[]
const MESSAGES = { vi, en }
/** Từ khoá chính của URL /huong-dan-su-dung (brand.ts, bản đồ từ khoá): anchor text của mọi link nội bộ tới trang phải chứa nó. */
const KEYWORD = { vi: 'hướng dẫn sử dụng docops', en: 'docops user guide' } as const

/** Mọi đường dẫn công khai của một ngôn ngữ, tính thuần từ `routing.pathnames` (trang cài đặt nhân theo hệ điều hành). */
function publicPaths(locale: Locale): Set<string> {
  const out = new Set<string>()
  for (const page of Object.keys(routing.pathnames) as PageKey[]) {
    if (page.includes('[os]')) for (const os of GUIDE_OS) out.add(localizedPath(locale, page, { os }))
    else out.add(localizedPath(locale, page))
  }
  return out
}

/** Mọi tệp MDX của một ngôn ngữ: `content/<nhóm>/<locale>.mdx` hoặc `content/<nhóm>/<locale>/*.mdx`. */
function mdxFiles(locale: Locale): string[] {
  const files: string[] = []
  for (const group of readdirSync('content', { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const dir = `content/${group.name}`
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (f.isFile() && f.name === `${locale}.mdx`) files.push(`${dir}/${f.name}`)
      if (f.isDirectory() && f.name === locale) {
        for (const g of readdirSync(`${dir}/${f.name}`)) if (g.endsWith('.mdx')) files.push(`${dir}/${f.name}/${g}`)
      }
    }
  }
  return files.sort()
}

/** Link nội bộ trong nguồn MDX: `[chữ](/đường-dẫn)` (markdown) và `href="/đường-dẫn"` (JSX). Bỏ `#mục` và `?query`. */
function internalLinks(src: string): Array<{ text: string; path: string; raw: string }> {
  const out: Array<{ text: string; path: string; raw: string }> = []
  for (const m of src.matchAll(/\[([^\]]*)\]\((\/[^)\s]*)\)/g)) out.push({ text: m[1]!, path: m[2]!.split(/[#?]/)[0]!, raw: m[2]! })
  for (const m of src.matchAll(/href="(\/[^"]*)"/g)) out.push({ text: '', path: m[1]!.split(/[#?]/)[0]!, raw: m[1]! })
  return out
}

describe('internal links in MDX resolve to a real page of the SAME language', () => {
  test.each(LOCALES)('%s: the scan sees the guide, both install guides and the privacy page', (locale) => {
    expect(mdxFiles(locale)).toEqual([
      'content/guide/' + `${locale}.mdx`,
      `content/install/${locale}/macos.mdx`,
      `content/install/${locale}/windows.mdx`,
      'content/privacy/' + `${locale}.mdx`,
    ])
  })

  test.each(LOCALES)('%s: the guide links to the real install, transparency and contact pages', (locale) => {
    const paths = internalLinks(readFileSync(`content/guide/${locale}.mdx`, 'utf8')).map((l) => l.path)
    // Một cái regex hỏng sẽ không thấy link nào và test bên dưới xanh giả: chốt những link ĐÃ biết.
    expect(paths).toContain(localizedPath(locale, '/install/[os]', { os: 'macos' }))
    expect(paths).toContain(localizedPath(locale, '/ai-transparency'))
    expect(paths).toContain(localizedPath(locale, '/contact'))
  })

  for (const locale of LOCALES) {
    for (const file of mdxFiles(locale)) {
      test(`${file}`, () => {
        const valid = publicPaths(locale)
        for (const link of internalLinks(readFileSync(file, 'utf8'))) {
          expect(valid.has(link.path), `${link.raw} is not a ${locale} page (valid: ${[...valid].join(' ')})`).toBe(true)
        }
      })
    }
  }
})

describe('links to the user guide use its main keyword as anchor text', () => {
  test.each(LOCALES)('%s: the guide is reachable from both install guides, with the keyword as anchor', (locale) => {
    for (const os of GUIDE_OS) {
      const target = localizedPath(locale, '/user-guide')
      const links = internalLinks(readFileSync(`content/install/${locale}/${os}.mdx`, 'utf8')).filter((l) => l.path === target)
      expect(links.length, `content/install/${locale}/${os}.mdx links to ${target}`).toBeGreaterThanOrEqual(1)
      for (const l of links) expect(l.text.toLowerCase(), `${os}: "${l.text}"`).toContain(KEYWORD[locale])
    }
  })

  test.each(LOCALES)('%s: the navigation, footer and download-page labels carry the keyword', (locale) => {
    const m = MESSAGES[locale] as unknown as { nav: Record<string, string>; download: Record<string, string> }
    expect(m.nav.userGuide?.toLowerCase(), 'nav.userGuide (header and footer)').toContain(KEYWORD[locale])
    // Dòng "Cài xong? Xem hướng dẫn sử dụng DocOps": chữ của link nằm trong thẻ <link>…</link>.
    const anchor = m.download.afterInstall?.match(/<link>([^<]*)<\/link>/)?.[1]
    expect(anchor?.toLowerCase(), 'download.afterInstall <link>').toContain(KEYWORD[locale])
  })
})

describe('the activation step tells the truth about asking for a key', () => {
  // App (Activation.tsx): màn Kích hoạt chỉ có ô key và link "Gửi yêu cầu tới quản trị"; "Chưa có key (đăng ký mới)" là MỘT LÝ DO trong hộp
  // thoại mở ra từ link ấy (KeyHelpDialog.tsx, đã chọn sẵn), không phải lựa chọn ở màn kích hoạt.
  test.each(LOCALES)('%s: install guides send people to "Gửi yêu cầu tới quản trị", never to a choice on the activation screen', (locale) => {
    for (const os of GUIDE_OS) {
      const src = readFileSync(`content/install/${locale}/${os}.mdx`, 'utf8')
      expect(src, `${os}`).toContain('**Gửi yêu cầu tới quản trị**')
      expect(src, `${os}`).not.toMatch(/(?:chọn|choose)\s+\*\*(?:Chưa có key|No key yet)/i)
    }
  })

  test.each(LOCALES)('%s: the home FAQ and the contact page steps say the same', (locale) => {
    const m = MESSAGES[locale] as unknown as { home: { faq: { q1: { a: string } } }; contact: { key: { s2: { desc: string } } } }
    for (const text of [m.home.faq.q1.a, m.contact.key.s2.desc]) {
      expect(text).toContain('Gửi yêu cầu tới quản trị')
      expect(text).not.toMatch(/(?:chọn|choose)\s+\\?"(?:Chưa có key|No key yet)/i)
    }
  })
})
