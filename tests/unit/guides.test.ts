import { existsSync, readFileSync, statSync } from 'node:fs'
import sharp from 'sharp'
import { describe, expect, test } from 'vitest'
import { GUIDE_SECTION_IDS } from '@/content/guide'
import { GUIDE_OS, isGuideOs } from '@/content/install'
import { localizedPath } from '@/lib/seo/urls'

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

// Thẻ cuối cột trái Cài đặt của app đã đổi tên từ "Phản hồi" thành "Trợ giúp & phản hồi" (Dự án 2 Task 8). Trang cài đặt và trang liên hệ
// chỉ người dùng tới thẻ ấy, nên phải gọi đúng tên mới (tên nút "Gửi phản hồi" và mục menu Trợ giúp → Gửi phản hồi thì giữ).
for (const locale of ['vi', 'en']) {
  for (const os of GUIDE_OS) {
    test(`${locale}/${os} install page points at the Settings card by its current name`, () => {
      const src = readFileSync(`content/install/${locale}/${os}.mdx`, 'utf8')
      expect(src).toContain('**Trợ giúp & phản hồi**')
      expect(src).not.toMatch(/\*\*(Phản hồi|Feedback)\*\*/)
    })
  }
  test(`${locale} contact page names the same card`, () => {
    const box = (JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8')) as { contact: { support: { boxBody: string } } }).contact.support.boxBody
    expect(box).toContain('Trợ giúp & phản hồi')
    expect(box).not.toMatch(/mục Phản hồi|Feedback inside/)
  })
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

  // App chỉ có tiếng Việt: bản tiếng Anh cũng phải gọi nút bằng đúng chữ trên màn hình (kèm lời dịch), không thì người đọc không tìm ra nút.
  for (const locale of LOCALES) {
    test(`${locale}: names the real buttons of the app, verbatim`, () => {
      const src = guideSource(locale)
      for (const label of [
        'Nạp văn bản', 'Gửi yêu cầu tới quản trị', 'Sửa thông tin', 'Thay tệp…', 'Thay văn bản cũ bằng bản này',
        'Đọc lại bằng OCR', 'Đọc lại chữ (miễn phí)', 'Sửa metadata rồi chốt', 'Bản thảo đã lưu', 'Nhập nội dung có sẵn',
        'Xem lại hướng dẫn nhanh', 'Trợ giúp & phản hồi', '/huongdan', 'Sao lưu ngay', 'Khôi phục…',
        'Cho phép agent trên máy này điều khiển DocOps',
      ]) expect(src, label).toContain(label)
    })
  }

  test('both: paid actions are said to be paid', () => {
    const vi = guideSource('vi')
    expect(vi).toMatch(sameLine('Đọc lại bằng OCR', 'tốn phí'))
    expect(vi).toMatch(sameLine('Thay tệp', 'bản quét[^\\n]*tốn phí'))
    expect(vi).toMatch(sameLine('Nhờ AI trình bày lại', 'tốn phí'))
    expect(vi).toMatch(sameLine('Nạp lại quan hệ', 'tốn phí'))
    const en = guideSource('en')
    expect(en).toMatch(sameLine('Đọc lại bằng OCR', 'billed'))
    expect(en).toMatch(sameLine('Thay tệp', 'scan[^\\n]*billed'))
    expect(en).toMatch(sameLine('Nhờ AI trình bày lại', 'billed'))
    expect(en).toMatch(sameLine('Nạp lại quan hệ', 'billed'))
  })

  // Nút tốn phí của app (lệnh trong PAID_COMMANDS của desktop) phải có trong danh sách "tính phí" của câu hỏi thường gặp,
  // ở NỬA trả phí của câu, trước chỗ câu chuyển sang việc miễn phí.
  test.each([
    ['vi', /^Việc nào gọi AI.*$/m, 'Việc chạy trên máy'],
    ['en', /^Anything that calls the AI.*$/m, 'Anything that runs'],
  ] as const)('%s: the FAQ list of billed actions names every paid button', (locale, line, freeHalf) => {
    const paid = (guideSource(locale).match(line)?.[0] ?? '').split(freeHalf)[0]
    for (const label of ['Nhờ AI trình bày lại', 'Đọc lại bằng OCR', 'Chạy lại xử lý', 'Nạp lại quan hệ', 'Thay tệp']) {
      expect(paid, label).toContain(label)
    }
  })

  for (const locale of LOCALES) {
    test(`${locale}: "cannot reach the server" points to the real contact page, not to in-app feedback with attachments`, () => {
      const src = guideSource(locale)
      // Hộp Gửi phản hồi chỉ có ô chữ và cũng gửi qua chính máy chủ đang không với tới (/v1/feedback).
      expect(src).not.toMatch(/gửi phản hồi kèm|phản hồi kèm ảnh|send feedback with|feedback with a screenshot|attach a screenshot/i)
      const faq = src.slice(src.indexOf('id="cau-hoi-thuong-gap"'))
      expect(faq).toContain(`](${localizedPath(locale, '/contact')})`)
    })

    test(`${locale}: every section opens with a short paragraph`, () => {
      const firsts = [...guideSource(locale).matchAll(/<Step n=\{\d+\} id="([^"]+)"[^>]*>\n\n([^\n]+)/g)]
      expect(firsts).toHaveLength(GUIDE_SECTION_IDS.length)
      for (const [, id, line] of firsts) expect(line, id).toMatch(/^[^<#\-\d\s|`]/)
    })

    test(`${locale}: does not tell people to save a draft by hand (drafts auto-save, there is no save button)`, () => {
      expect(guideSource(locale)).not.toMatch(/Lưu bản thảo đang soạn|Save the draft you are working on/)
    })
  }

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

  // W1 phần ảnh (spec §5.3, Task 2) — ảnh chụp từ renderer desktop bằng `scripts/capture-guide-images.mjs`.
  const IMAGE_DIR = 'public/images/guide'
  const imgTags = (locale: (typeof LOCALES)[number]) => [...guideSource(locale).matchAll(/<img [^>]*\/>/g)].map((m) => m[0])
  const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
  const imageFile = (id: string) => `${IMAGE_DIR}/${id}.webp`

  for (const locale of LOCALES) {
    test.each(GUIDE_SECTION_IDS)(`${locale}: section "%s" has a screenshot with an alt, and the file is in public/images/guide/`, (id) => {
      const mine = imgTags(locale).filter((tag) => attr(tag, 'src') === `/images/guide/${id}.webp`)
      expect(mine.length, `no <img> for ${id}`).toBeGreaterThanOrEqual(1)
      for (const tag of mine) expect((attr(tag, 'alt') ?? '').trim(), tag).not.toBe('')
      expect(existsSync(imageFile(id)), imageFile(id)).toBe(true)
    })

    // Chiều rộng/cao khai trong thẻ giữ chỗ cho ảnh trước khi tải (không nhảy bố cục): phải là kích thước THẬT của tệp, nên chụp lại ảnh mà quên sửa thẻ thì đỏ.
    test(`${locale}: every <img> declares the real width and height of its file, and the file is a webp`, async () => {
      for (const tag of imgTags(locale)) {
        const id = attr(tag, 'src')!.match(/\/images\/guide\/([a-z-]+)\.webp$/)![1]!
        const meta = await sharp(imageFile(id)).metadata()
        expect(meta.format, id).toBe('webp')
        expect([attr(tag, 'width'), attr(tag, 'height')], id).toEqual([String(meta.width), String(meta.height)])
      }
    })
  }

  // Ngân sách của spec §5.3 / brief Task 2: mỗi ảnh ≤ 250 KB, cả mười hai ≤ 2 MB (trang tải trên mạng di động).
  test('the twelve screenshots stay within budget: each ≤ 250 KB, all together ≤ 2 MB', () => {
    const sizes = GUIDE_SECTION_IDS.map((id) => [id, statSync(imageFile(id)).size] as const)
    for (const [id, bytes] of sizes) expect(bytes, `${id}: ${Math.round(bytes / 1024)} KB`).toBeLessThanOrEqual(250 * 1024)
    expect(sizes.reduce((sum, [, bytes]) => sum + bytes, 0)).toBeLessThanOrEqual(2 * 1024 * 1024)
  })

  // Trang công khai, nên mọi số hiệu trong ảnh phải BỊA: ảnh mà ghi "TT 08/2021/TT-BGDĐT bị thay bằng …" thì người đọc hiểu là một khẳng định
  // về luật thật. Chặn bằng danh sách cho phép (số hiệu phải kết thúc bằng mã cơ quan bịa: ĐHM = Trường Đại học Mẫu, SMẪU = Sở Mẫu,
  // BMẪU = Bộ Mẫu) thay vì danh sách cấm, để một hậu tố thật lạ (…-BYT, …-BTC) cũng đỏ.
  test('the screenshot harness invents every document number: each ends in a made-up issuer code', () => {
    const FICTIONAL = /(?:^|-)(?:ĐHM|SMẪU|BMẪU)(?:-|$)/u
    const numbers = ['world.ts', 'fake.ts'].flatMap((file) =>
      [...readFileSync(`scripts/guide-capture/${file}`, 'utf8').matchAll(/(?<![\w/])\d{1,4}\/(?:\d{4}\/)?(\p{Lu}[\p{L}-]*)/gu)].map((m) => [file, m[0], m[1]!] as const))
    expect(numbers.length, 'the pattern must still see the document numbers').toBeGreaterThan(30)
    for (const [file, whole, code] of numbers) expect(FICTIONAL.test(code), `${file}: "${whole}"`).toBe(true)
    // Và không còn chữ chỉ cơ quan thật, kể cả khi số hiệu viết kiểu khác.
    const all = ['world.ts', 'fake.ts'].map((file) => readFileSync(`scripts/guide-capture/${file}`, 'utf8')).join('\n')
    expect(all).not.toMatch(/BGDĐT|NĐ-CP|NQ-CP|QĐ-TTg|CT-TTg|\/QH\d|UBND|Bộ Giáo dục|Chính phủ|Luật |ĐHSP/u)
  })

  // Câu báo "ảnh là dữ liệu mẫu" phải đứng TRƯỚC ảnh đầu tiên, cả hai ngôn ngữ.
  test.each([
    ['vi', 'Ảnh minh hoạ dùng dữ liệu mẫu của một trường giả định; số hiệu, quan hệ và ngày trong ảnh chỉ để minh hoạ.'],
    ['en', 'The screenshots use sample data from a fictional university; the document numbers, relations and dates in them are for illustration only.'],
  ] as const)('%s: the sample-data notice stands before the first screenshot', (locale, sentence) => {
    const src = guideSource(locale)
    expect(src.indexOf(sentence), 'notice missing').toBeGreaterThan(-1)
    expect(src.indexOf(sentence)).toBeLessThan(src.indexOf('<img '))
  })

  // Mẫu ảnh không lọt tên người thật hay mã cán bộ: nguồn dữ liệu mẫu của bộ chụp là một trường tưởng tượng.
  test('the screenshot harness carries only the invented unit, no real signer', () => {
    const world = readFileSync('scripts/guide-capture/world.ts', 'utf8')
    expect(world).toContain("export const UNIT = 'Trường Đại học Mẫu'")
    expect(readFileSync('scripts/guide-capture/fake.ts', 'utf8')).not.toMatch(/signerName: '[^']+'|signer: '[^']+'/)
  })
})
