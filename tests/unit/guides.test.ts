import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { GUIDE_SECTION_IDS } from '@/content/guide'
import { GUIDE_OS, isGuideOs } from '@/content/install'

for (const locale of ['vi', 'en']) {
  for (const os of GUIDE_OS) {
    test(`${locale}/${os} guide exports meta, has no internal notes and carries the key facts`, () => {
      const src = readFileSync(`content/install/${locale}/${os}.mdx`, 'utf8')
      expect(src).toMatch(/export const meta = \{/)
      expect(src).toMatch(/toc: \[/)
      expect(src).not.toMatch(/nội bộ|internal note|người gửi/i)
      expect(src).toContain('DOCOPS-XXXX-XXXX-XXXX')
      if (os === 'macos') expect(src).toContain('xattr -dr com.apple.quarantine /Applications/DocOps.app')
      if (os === 'windows') expect(src).toMatch(/Run anyway/)
    })
  }
}

test('isGuideOs', () => {
  expect(isGuideOs('macos')).toBe(true)
  expect(isGuideOs('linux')).toBe(false)
})

/* ── Hướng dẫn sử dụng (spec Dự án 2 §5, §7.3 W1, §7.4 X1) ───────────────────────────────────────
 * Vitest không biên dịch MDX, nên các test đọc NGUỒN như test cài đặt phía trên. */

const LOCALES = ['vi', 'en'] as const
const guideSource = (locale: (typeof LOCALES)[number]) => readFileSync(`content/guide/${locale}.mdx`, 'utf8')
/** `meta.toc` ids, in order. */
const tocIds = (src: string) => {
  const block = src.match(/toc: \[([\s\S]*?)\n  \]/)?.[1] ?? ''
  return [...block.matchAll(/\{ id: '([^']+)'/g)].map((m) => m[1])
}
/** The ids the page really renders (`<Step n={…} id="…">` draws the `<h2 id>` the toc links to), in order. */
const renderedIds = (src: string) => [...src.matchAll(/<Step n=\{\d+\} id="([^"]+)"/g)].map((m) => m[1])
/** One line of the source holding both phrases, either order: the paid warning sits next to the action it is about. */
const sameLine = (a: string, b: string) => new RegExp(`${a}[^\\n]*${b}|${b}[^\\n]*${a}`)

describe('user guide', () => {
  test('X1: the twelve section ids are the same literal the desktop app pins', () => {
    // Desktop: `GUIDE_SECTIONS` (contracts/ipc.ts) và test/guideSections.test.ts ghim CÙNG chuỗi này (spec §7.4).
    expect(GUIDE_SECTION_IDS.join(',')).toBe(
      'bat-dau,nap-van-ban,kho-van-ban,tra-cuu,hoi-ai,ra-soat,do-thi,soan-thao,cai-dat,sao-luu,ket-noi-agent,cau-hoi-thuong-gap',
    )
  })

  for (const locale of LOCALES) {
    test(`${locale}: exports meta whose toc is exactly the twelve ids, in order`, () => {
      const src = guideSource(locale)
      expect(src).toMatch(/export const meta = \{/)
      expect(tocIds(src)).toEqual([...GUIDE_SECTION_IDS])
    })

    test(`${locale}: every toc entry is a heading the page renders, same order, numbered 1–12`, () => {
      const src = guideSource(locale)
      expect(renderedIds(src)).toEqual([...GUIDE_SECTION_IDS])
      const numbers = [...src.matchAll(/<Step n=\{(\d+)\} id="/g)].map((m) => Number(m[1]))
      expect(numbers).toEqual(GUIDE_SECTION_IDS.map((_, i) => i + 1))
    })

    test(`${locale}: no internal notes`, () => {
      expect(guideSource(locale)).not.toMatch(/nội bộ|internal note|người gửi/i)
    })

    test(`${locale}: does not promise search by meaning (not shipped yet)`, () => {
      expect(guideSource(locale)).not.toMatch(
        /cách nói khác|diễn đạt khác|gần nghĩa|theo nghĩa|đồng nghĩa|semantic|by meaning|different wording|similar meaning|synonym/i,
      )
    })

    test(`${locale}: screenshots point at /images/guide/<section>.webp and carry an alt`, () => {
      const tags = [...guideSource(locale).matchAll(/<img [^>]*\/>/g)].map((m) => m[0])
      expect(tags.length).toBeGreaterThan(0)
      for (const tag of tags) {
        const id = tag.match(/src="\/images\/guide\/([a-z-]+)\.webp"/)?.[1]
        expect(GUIDE_SECTION_IDS as readonly (string | undefined)[], tag).toContain(id)
        expect(tag).toMatch(/alt="[^"]{12,}"/)
      }
    })
  }

  test('vi: names the real buttons of the app, verbatim', () => {
    const src = guideSource('vi')
    for (const label of [
      'Nạp văn bản', 'Gửi yêu cầu tới quản trị', 'Sửa thông tin', 'Thay tệp…', 'Thay văn bản cũ bằng bản này',
      'Đọc lại bằng OCR', 'Đọc lại chữ (miễn phí)', 'Sửa metadata rồi chốt', 'Bản thảo đã lưu', 'Nhập nội dung có sẵn',
      'Xem lại hướng dẫn nhanh', 'Trợ giúp & phản hồi', '/huongdan', 'Sao lưu ngay', 'Khôi phục…',
      'Cho phép agent trên máy này điều khiển DocOps',
    ]) expect(src, label).toContain(label)
  })

  test('both: paid actions are said to be paid, free ones free', () => {
    const vi = guideSource('vi')
    expect(vi).toMatch(sameLine('Đọc lại bằng OCR', 'tốn phí'))
    expect(vi).toMatch(sameLine('Thay tệp', 'bản quét[^\\n]*tốn phí'))
    expect(vi).toMatch(sameLine('Nhờ AI trình bày lại', 'tốn phí'))
    const en = guideSource('en')
    expect(en).toMatch(sameLine('Đọc lại bằng OCR', 'billed'))
    expect(en).toMatch(sameLine('Thay tệp', 'scan[^\\n]*billed'))
    expect(en).toMatch(sameLine('Nhờ AI trình bày lại', 'billed'))
    expect(en).toMatch(sameLine('Đọc lại chữ \\(miễn phí\\)', 'free'))
  })

  test('en: every screenshot is captioned "The app interface is in Vietnamese."', () => {
    const src = guideSource('en')
    const images = [...src.matchAll(/<img /g)].length
    expect(images).toBeGreaterThan(0)
    expect([...src.matchAll(/The app interface is in Vietnamese\./g)].length).toBe(images)
  })

  test('vi and en carry the same screenshots, in the same order', () => {
    const srcs = (locale: (typeof LOCALES)[number]) => [...guideSource(locale).matchAll(/<img src="([^"]+)"/g)].map((m) => m[1])
    expect(srcs('en')).toEqual(srcs('vi'))
  })

  // W1 phần ảnh — Task 2 bỏ todo: mỗi id có ít nhất một <img> có alt, VÀ tệp public/images/guide/<id>.webp tồn tại.
  test.todo('W1: every section has a screenshot whose file exists in public/images/guide/')
})
