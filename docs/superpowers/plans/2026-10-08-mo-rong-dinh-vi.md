# Mở rộng định vị + 4 trang mới: kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** DocOps được hiểu là phần mềm AI văn bản hành chính cho trường đại học, cơ quan, doanh nghiệp; thêm 4 trang chủ đề (cơ quan/doanh nghiệp, 29 loại văn bản, thể thức, DocOps và ChatGPT) với khối thẻ chia 3 nhóm.

**Architecture:** Mọi trang chủ đề sinh từ `content/topics` (một danh sách id → route, sitemap, footer, hub, llms.txt, JSON-LD). Thêm trường `group` vào `TOPIC_META` và hàm `topicsByGroup()`; mỗi trang mới = một id + bản copy vi/en + route mỏng. Câu mô tả thương hiệu đổi một chỗ trong `lib/seo/brand.ts`.

**Tech Stack:** Next.js 16.3 App Router, next-intl 4, TypeScript, Tailwind 4, Vitest 5, Playwright 1.63, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-08-mo-rong-dinh-vi-design.md`

## Global Constraints

- Khoá route = id chủ đề = slug en (quy ước repo); slug vi = từ khoá chính, kebab-case không dấu.
- `metaTitle` ≤ 43 ký tự (template nối " · Agentra DocOps" = 60); `description` 110–160 ký tự; `share.title` ≤ 26; `faq` ≥ 4; `blocks` ≥ 3; `keywords[0]` (từ khoá chính) nằm trong `metaTitle` hoặc `h1`, không trùng từ khoá chính của URL khác (`tests/unit/content.test.ts`).
- Mọi câu về app phải đúng mục 3 của spec. Không nhắc chứng từ như tính năng; không hứa hỗ trợ văn bản Đảng; không nói DocOps quản lý văn bản đi/đến.
- Mọi số liệu NĐ 30 lấy từ bảng "Dữ kiện đã kiểm chứng" dưới đây, không lấy từ trí nhớ.
- Copy tiếng Việt có dấu; code, id, commit scope tiếng Anh. Không dùng "—" thay dấu phẩy trong copy (giữ giọng hiện có).
- `TOPIC_META.updated` = ngày nội dung đổi thật (ngày thực hiện task, dạng `YYYY-MM-DD`).
- Làm trên nhánh `feat/mo-rong-dinh-vi`; không push, không merge vào `main` khi PO chưa bảo (push `main` = deploy production).

## Dữ kiện đã kiểm chứng (08/10/2026)

**NĐ 30/2020/NĐ-CP** (văn bản và phụ lục gốc, bản đăng tại vanban.vcci.com.vn):

- Điều 2: (1) "cơ quan, tổ chức nhà nước và doanh nghiệp nhà nước" áp dụng; (2) "Tổ chức chính trị, tổ chức chính trị - xã hội, tổ chức xã hội, tổ chức xã hội - nghề nghiệp căn cứ quy định của Nghị định này và các quy định của Đảng, của pháp luật có liên quan để áp dụng cho phù hợp."
- Điều 7, 29 loại theo thứ tự: Nghị quyết (cá biệt), Quyết định (cá biệt), Chỉ thị, Quy chế, Quy định, Thông cáo, Thông báo, Hướng dẫn, Chương trình, Kế hoạch, Phương án, Đề án, Dự án, Báo cáo, Biên bản, Tờ trình, Hợp đồng, Công văn, Công điện, Bản ghi nhớ, Bản thỏa thuận, Giấy ủy quyền, Giấy mời, Giấy giới thiệu, Giấy nghỉ phép, Phiếu gửi, Phiếu chuyển, Phiếu báo, Thư công.
- Phụ lục III mục I, chữ viết tắt (27 loại; **Công văn và Thư công không có**): NQ, QĐ, CT, QC, QyĐ, TC, TB, HD, CTr, KH, PA, ĐA, DA, BC, BB, TTr, HĐ, CĐ, BGN, BTT, GUQ, GM, GGT, GNP, PG, PC, PB. Bản sao: Bản sao y **SY**, Bản trích sao **TrS**, Bản sao lục **SL**.
- Phụ lục III mục II, mẫu: 1.1 Nghị quyết (cá biệt); 1.2 Quyết định (cá biệt) quy định trực tiếp; 1.3 Quyết định (cá biệt) quy định gián tiếp; 1.4 Văn bản có tên loại; 1.5 Công văn; 1.6 Công điện; 1.7 Giấy mời; 1.8 Giấy giới thiệu; 1.9 Biên bản; 1.10 Giấy nghỉ phép.
- Điều 8 khoản 1: "Thể thức văn bản là tập hợp các thành phần cấu thành văn bản, bao gồm những thành phần chính áp dụng đối với tất cả các loại văn bản và các thành phần bổ sung trong những trường hợp cụ thể hoặc đối với một số loại văn bản nhất định."
- Điều 8 khoản 2, 9 thành phần chính: a) Quốc hiệu và Tiêu ngữ; b) Tên cơ quan, tổ chức ban hành văn bản; c) Số, ký hiệu của văn bản; d) Địa danh và thời gian ban hành văn bản; đ) Tên loại và trích yếu nội dung văn bản; e) Nội dung văn bản; g) Chức vụ, họ tên và chữ ký của người có thẩm quyền; h) Dấu, chữ ký số của cơ quan, tổ chức; i) Nơi nhận.
- Điều 8 khoản 3, bổ sung: a) Phụ lục; b) Dấu chỉ độ mật, mức độ khẩn, các chỉ dẫn về phạm vi lưu hành; c) Ký hiệu người soạn thảo văn bản và số lượng bản phát hành; d) Địa chỉ cơ quan, tổ chức; thư điện tử; trang thông tin điện tử; số điện thoại; số Fax.
- Điều 9: kỹ thuật trình bày gồm khổ giấy, kiểu trình bày, định lề trang, phông chữ, cỡ chữ, kiểu chữ, vị trí trình bày các thành phần thể thức, số trang; theo Phụ lục I; viết hoa theo Phụ lục II; chữ viết tắt tên loại theo Phụ lục III.
- Phụ lục I, quy định chung: khổ A4 (210 mm x 297 mm); trình bày theo chiều dài A4 (bảng biểu không tách phụ lục được thì có thể theo chiều rộng); lề trên và dưới 20–25 mm, trái 30–35 mm, phải 15–20 mm; phông Times New Roman, bộ mã Unicode TCVN 6909:2001, màu đen; số trang từ 1, chữ số Ả Rập, cỡ 13–14, đứng, canh giữa trong lề trên, không hiển thị số trang thứ nhất.
- Phụ lục I, thành phần chính:
  - Quốc hiệu in hoa, cỡ 12–13, đứng, đậm, trên cùng bên phải trang đầu. Tiêu ngữ "Độc lập - Tự do - Hạnh phúc" in thường, cỡ 13–14, đứng, đậm, canh giữa dưới Quốc hiệu, gạch nối có cách chữ, kẻ ngang nét liền dài bằng dòng chữ.
  - Tên cơ quan ban hành: tên chính thức, đầy đủ + tên cơ quan chủ quản trực tiếp (nếu có). Tên cơ quan ban hành in hoa, cỡ 12–13, đứng, đậm, kẻ ngang dài 1/3–1/2 dòng chữ; tên cơ quan chủ quản in hoa, cỡ 12–13, đứng.
  - Số: số thứ tự trong năm đăng ký tại Văn thư, chữ số Ả Rập, số nhỏ hơn 10 ghi thêm 0. Ký hiệu = chữ viết tắt tên loại + chữ viết tắt tên cơ quan; công văn = chữ viết tắt tên cơ quan + chữ viết tắt đơn vị soạn thảo hoặc lĩnh vực. Chữ viết tắt tên cơ quan và đơn vị do người đứng đầu quy định. "Số" in thường cỡ 13, sau có dấu hai chấm; ký hiệu in hoa cỡ 13; giữa số và ký hiệu dấu gạch chéo (/), giữa các nhóm chữ viết tắt gạch nối (-), không cách chữ.
  - Địa danh và thời gian: in thường, cỡ 13–14, nghiêng, cùng dòng với số ký hiệu; ngày nhỏ hơn 10 và tháng 1, 2 ghi thêm 0; sau địa danh có dấu phẩy.
  - Tên loại in hoa, cỡ 13–14, đứng, đậm; trích yếu in thường, cỡ 13–14, đứng, đậm, ngay dưới tên loại, kẻ ngang 1/3–1/2. Công văn: trích yếu sau "V/v", in thường, cỡ 12–13, đứng.
  - Căn cứ: in thường, nghiêng, cỡ 13–14; mỗi căn cứ xuống dòng, cuối dòng chấm phẩy, dòng cuối dấu chấm. Lần viện dẫn đầu ghi đủ tên loại, số, ký hiệu, thời gian ban hành, cơ quan ban hành, trích yếu; lần sau chỉ tên loại và số, ký hiệu.
  - Nội dung: in thường, canh đều hai lề, đứng, cỡ 13–14; lùi đầu dòng 1 cm hoặc 1,27 cm; cách đoạn tối thiểu 6pt; cách dòng từ dòng đơn tới 1,5 lines.
  - Quyền hạn ký: TM. (thay mặt tập thể), Q. (quyền cấp trưởng), KT. (ký thay người đứng đầu), TL. (thừa lệnh), TUQ. (thừa ủy quyền). Quyền hạn, chức vụ in hoa, cỡ 13–14, đứng, đậm; họ tên in thường, cỡ 13–14, đứng, đậm. Không ghi học hàm, học vị, danh hiệu trước họ tên (trừ trường hợp người đứng đầu ngành quy định cho lực lượng vũ trang, tổ chức sự nghiệp giáo dục, y tế, khoa học).
  - Dấu, chữ ký số của cơ quan trên văn bản điện tử: hình ảnh dấu màu đỏ, kích thước thật, định dạng .png nền trong suốt, trùm khoảng 1/3 hình ảnh chữ ký số của người có thẩm quyền về bên trái.
  - Nơi nhận: tờ trình, báo cáo gửi cấp trên và công văn có phần "Kính gửi" (cỡ 13–14); "Nơi nhận:" cỡ 12, nghiêng, đậm; danh sách cỡ 11, đứng; dòng cuối "Lưu: VT, <đơn vị soạn thảo>, <số bản>."
  - Mức độ khẩn: hỏa tốc, thượng khẩn, khẩn. Độ mật: tuyệt mật, tối mật, mật. Phạm vi lưu hành ví dụ "XEM XONG TRẢ LẠI", "LƯU HÀNH NỘI BỘ".

**App DocOps v1.2.1** (`../docops-application`):

- 9 mục kiểm tra thể thức (`packages/contracts/src/s12.ts:12-22`): quốc hiệu, tiêu ngữ, tên cơ quan, số ký hiệu, địa danh và ngày, tên loại và trích yếu, nơi nhận, chữ ký, dấu. Tách quốc hiệu và tiêu ngữ, **không** chấm phần nội dung; trạng thái ok/missing/suspect (đạt/thiếu/cần xem); kết luận đạt/cần xem/không đạt; do AI chấm; prompt `s12.md` không nói gì về lề, phông, cỡ chữ.
- Màn Tra cứu có 4 thẻ: Kết quả, Ngưỡng & con số, Cổng chặn, Việc theo đơn vị (`Lookup.tsx:50-54`). Bảng nghĩa vụ ("Việc theo đơn vị") chỉ có dữ liệu từ bộ dữ liệu mẫu: **không** nhắc thẻ này như kết quả AI bóc.
- Mô hình: `anthropic` (mặc định, Claude) và `zai` (GLM), chọn theo đơn vị. Soạn thảo lọc căn cứ hết hiệu lực và sắp thay đổi trước khi gửi prompt (`main/drafting.ts:1-18`).
- Prompt phân loại `s04-v4.md:67-69` ghi bản trích sao là "TS" (NĐ 30 là "TrS"): báo team app, không phải việc của repo này.

**ChatGPT** (trang của OpenAI chặn tải tự động; nội dung lấy từ trích đoạn tìm kiếm ngày 08/10/2026, **mở lại bằng trình duyệt để đối chiếu trước khi viết**, mục Task 7 bước 1):

- help.openai.com/en/articles/7730893-data-controls-faq: "When Improve the model for everyone is off, your new conversations won't be used to train OpenAI models." Tuỳ chọn phụ thuộc gói và workspace.
- openai.com/business-data/: "By default, we do not use data from ChatGPT Enterprise, ChatGPT Business, ChatGPT Edu, ChatGPT for Healthcare, ChatGPT for Teachers, or our API platform—including inputs or outputs—for training or improving our models."
- help.openai.com/en/articles/10169521-projects-in-chatgpt: Projects có ở mọi gói; tệp tải lên dự án dùng được trong các cuộc trò chuyện của dự án; chia sẻ dự án chỉ ở Business, Enterprise, Edu.
- Giao diện ChatGPT hiện "ChatGPT can make mistakes. Check important info." (kiểm tra lại câu chữ khi mở trình duyệt).

## Review Focus

1. Trang chủ đề mới mà khoá route khác slug en → test `llms.test.ts` (`/en/${id}`) và hreflang hỏng: mọi id mới phải bằng slug en (Task 3–6 chạy `tests/unit/llms.test.ts`).
2. Câu hỏi đáp trang chủ thêm vào `vi.json` mà quên `en.json` hoặc quên danh sách khoá → FAQ hiển thị và FAQPage lệch nhau: Task 2 lấy khoá từ messages và thêm test vi/en cùng bộ khoá.
3. Một nhóm thẻ rỗng (vd. "Xem thêm" trên trang duy nhất của nhóm) → nhãn nhóm đứng một mình: `topicsByGroup` bỏ nhóm rỗng, test ở Task 1.
4. Bảng 29 dòng trên điện thoại 360px → tràn ngang trang: bảng nằm trong `overflow-x-auto`, test "no horizontal overflow" mở rộng sang trang 29 loại ở Task 8.
5. Link ngoài (OpenAI) trong thân bài → llms-full.txt in sai hoặc audit coi là link nội bộ hỏng: Task 1 thêm kiểu link `href` và test `linkText`.

---

### Task 0: Nhánh làm việc và commit phần đã làm

**Files:** (đã sửa trong phiên, chưa commit) `components/site/Header.tsx`, `components/site/ConsentBar.tsx`, `messages/vi.json`, `messages/en.json`, `tests/e2e/mobile.spec.ts`, `docs/superpowers/specs/2026-10-08-mo-rong-dinh-vi-design.md`, `docs/superpowers/plans/2026-10-08-mo-rong-dinh-vi.md`

- [ ] **Step 1: Tạo nhánh mang theo thay đổi chưa commit**

Run: `git switch -c feat/mo-rong-dinh-vi && git status --short`
Expected: 7 tệp trên ở trạng thái M hoặc ??.

- [ ] **Step 2: Commit sửa menu và câu cookie (đã có test e2e `mobile.spec.ts` pass)**

```bash
git add components/site/Header.tsx components/site/ConsentBar.tsx messages/vi.json messages/en.json tests/e2e/mobile.spec.ts
git commit -m "fix(mobile-nav): menu fills the screen above the consent bar; brand-voice cookie copy"
```

- [ ] **Step 3: Commit spec và plan**

```bash
git add docs/superpowers/specs/2026-10-08-mo-rong-dinh-vi-design.md docs/superpowers/plans/2026-10-08-mo-rong-dinh-vi.md
git commit -m "docs(spec): broaden positioning to agencies and companies, 4 new topic pages"
```

---

### Task 1: Nhóm chủ đề, link ngoài, hub và footer theo nhóm

**Files:**
- Modify: `content/topics/index.ts`
- Modify: `components/topic/TopicHub.tsx`
- Modify: `components/topic/TopicPage.tsx:31-45` (InlineLink)
- Modify: `components/site/Footer.tsx`
- Modify: `lib/seo/llms.ts:99-102` (linkText)
- Modify: `messages/vi.json`, `messages/en.json` (`topics.groups`, `footer.guides`)
- Create: `tests/unit/topics.test.ts`
- Modify: `tests/unit/llms.test.ts`

**Interfaces:**
- Produces: `TOPIC_GROUPS = ['feature', 'audience', 'guide'] as const`; `type TopicGroup`; `TOPIC_META[id].group: TopicGroup`; `topicsByGroup(exclude?: TopicId): Array<{ group: TopicGroup; ids: TopicId[] }>`; `TopicLink` thêm nhánh `{ href: \`https://${string}\`; label: string }`; `linkText` export từ `lib/seo/llms.ts`.

- [ ] **Step 1: Viết test hỏng**

`tests/unit/topics.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { TOPIC_GROUPS, TOPIC_IDS, TOPIC_META, topicsByGroup } from '@/content/topics'

describe('topicsByGroup', () => {
  test('lists every topic once, groups in TOPIC_GROUPS order', () => {
    const groups = topicsByGroup()
    const order = groups.map((g) => TOPIC_GROUPS.indexOf(g.group))
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(groups.flatMap((g) => g.ids).sort()).toEqual([...TOPIC_IDS].sort())
    for (const g of groups) for (const id of g.ids) expect(TOPIC_META[id].group).toBe(g.group)
  })

  test('exclude drops the page and never leaves an empty group', () => {
    const groups = topicsByGroup('ai-for-universities')
    expect(groups.flatMap((g) => g.ids)).not.toContain('ai-for-universities')
    expect(groups.every((g) => g.ids.length > 0)).toBe(true)
  })
})
```

Thêm vào `tests/unit/llms.test.ts`:

```ts
import { linkText } from '@/lib/seo/llms'

test('external links keep their own URL in llms-full.txt', () => {
  expect(linkText('vi', { href: 'https://help.openai.com/en/articles/7730893-data-controls-faq', label: 'Data Controls FAQ' })).toBe(
    'Data Controls FAQ (https://help.openai.com/en/articles/7730893-data-controls-faq)',
  )
})
```

- [ ] **Step 2: Chạy, xác nhận hỏng**

Run: `pnpm test -- tests/unit/topics.test.ts tests/unit/llms.test.ts`
Expected: FAIL, `topicsByGroup`/`TOPIC_GROUPS`/`linkText` không được export.

- [ ] **Step 3: Cài đặt `content/topics/index.ts`**

Thay khối `TOPIC_META` và `TopicLink`:

```ts
/** Nhóm thẻ trên hub và footer: tính năng, theo loại đơn vị, kiến thức văn thư (thứ tự hiển thị). */
export const TOPIC_GROUPS = ['feature', 'audience', 'guide'] as const
export type TopicGroup = (typeof TOPIC_GROUPS)[number]

/** Dữ liệu không đổi theo ngôn ngữ. `updated` là ngày nội dung đổi thật (sitemap, JSON-LD, dòng "Cập nhật"). */
export const TOPIC_META: Record<TopicId, { icon: IconName; image: string; updated: string; group: TopicGroup }> = {
  'legal-basis-review': { icon: 'graph', image: '/images/product/rasoat.webp', updated: '2026-10-04', group: 'feature' },
  'decree-30-drafting': { icon: 'pen', image: '/images/product/soanthao.webp', updated: '2026-10-04', group: 'feature' },
  'ai-document-search': { icon: 'search', image: '/images/product/tracuu.webp', updated: '2026-10-04', group: 'feature' },
  'ai-for-universities': { icon: 'book', image: '/images/product/khovanban.webp', updated: '2026-10-04', group: 'audience' },
}

/** Trang chủ đề theo nhóm, đúng thứ tự TOPIC_GROUPS rồi TOPIC_IDS; bỏ trang `exclude` và nhóm rỗng. */
export function topicsByGroup(exclude?: TopicId): Array<{ group: TopicGroup; ids: TopicId[] }> {
  return TOPIC_GROUPS.map((group) => ({ group, ids: TOPIC_IDS.filter((id) => id !== exclude && TOPIC_META[id].group === group) })).filter(
    (g) => g.ids.length > 0,
  )
}

/** Link trong thân bài: trang chủ đề khác (anchor = từ khoá chính của nó), trang sản phẩm, hoặc nguồn bên ngoài. */
export type TopicLink =
  | { topic: TopicId }
  | { page: Exclude<PageKey, '/install/[os]'>; label: string }
  | { href: `https://${string}`; label: string }
```

- [ ] **Step 4: `lib/seo/llms.ts` — export và xử lý link ngoài**

```ts
export function linkText(locale: Locale, link: TopicLink): string {
  if ('topic' in link) return `${topicCopy(locale, link.topic).name} (${absoluteUrl(locale, topicPage(link.topic))})`
  if ('href' in link) return `${link.label} (${link.href})`
  return `${link.label} (${absoluteUrl(locale, link.page)})`
}
```

- [ ] **Step 5: `components/topic/TopicPage.tsx` — InlineLink nhận link ngoài**

Thêm trước `return <Link href={link.page} …>`:

```tsx
  if ('href' in link) {
    return (
      <a href={link.href} className={cls} rel="noopener">
        {link.label}
      </a>
    )
  }
```

- [ ] **Step 6: Messages**

`messages/vi.json` trong `topics`: `"groups": { "feature": "Tính năng", "audience": "Theo loại đơn vị", "guide": "Kiến thức văn thư" }`; trong `footer`: `"guides": "Kiến thức văn thư"`.
`messages/en.json` trong `topics`: `"groups": { "feature": "Features", "audience": "By organization", "guide": "Records management guides" }`; trong `footer`: `"guides": "Guides"`.

- [ ] **Step 7: `components/topic/TopicHub.tsx` theo nhóm**

```tsx
import { useLocale, useTranslations } from 'next-intl'
import { SectionHead } from '@/components/home/SectionHead'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { TOPIC_META, topicCopy, topicPage, topicsByGroup, type TopicId } from '@/content/topics'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

/** Thẻ dẫn tới các trang chủ đề (hub → pillar), theo nhóm. Tên thẻ = từ khoá chính của trang đích, dùng làm anchor text.
 *  Nhãn nhóm là chữ thường, không phải heading: tên thẻ vẫn là h3 ngay dưới h2 của khối. */
export function TopicHub({
  exclude,
  eyebrow,
  title,
  lead,
  className,
}: {
  exclude?: TopicId
  eyebrow: string
  title: string
  lead?: string
  className?: string
}) {
  const locale = useLocale() as Locale
  const t = useTranslations('topics')
  return (
    <Section className={className}>
      <Container>
        <SectionHead eyebrow={eyebrow} title={title} lead={lead} />
        <div className="mt-8 flex flex-col gap-10 md:mt-12">
          {topicsByGroup(exclude).map(({ group, ids }) => (
            <div key={group} className="flex flex-col gap-4">
              <p className="text-[13px] font-bold tracking-[0.6px] text-muted uppercase">{t(`groups.${group}`)}</p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                {ids.map((id) => (
                  <TopicCard key={id} id={id} locale={locale} more={t('more')} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function TopicCard({ id, locale, more }: { id: TopicId; locale: Locale; more: string }) {
  const c = topicCopy(locale, id)
  return (
    <Link
      href={topicPage(id)}
      className="group flex flex-col gap-3 rounded-xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:border-accent"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
        <Icon name={TOPIC_META[id].icon} size={22} />
      </span>
      <h3 className="text-lg leading-snug font-semibold">{c.name}</h3>
      <p className="text-[15px] leading-relaxed text-ink2">{c.card}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[14.5px] font-semibold text-accent-strong">
        {more}
        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
```

(`cn` không còn dùng: bỏ import.)

- [ ] **Step 8: `components/site/Footer.tsx` — cột Giải pháp (feature + audience) và cột Kiến thức (guide)**

Thay import `TOPIC_IDS` bằng `topicsByGroup`, thêm trước `return`:

```tsx
  const groups = topicsByGroup()
  const solutionIds = groups.filter((g) => g.group !== 'guide').flatMap((g) => g.ids)
  const guideIds = groups.find((g) => g.group === 'guide')?.ids ?? []
```

Lưới: `className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:grid-cols-[1.5fr_repeat(5,minmax(0,1fr))]"`; khối thương hiệu: `sm:col-span-2 md:col-span-3 lg:col-span-1`. Cột Giải pháp lặp `solutionIds`; ngay sau nó:

```tsx
          {guideIds.length > 0 ? (
            <FooterColumn title={t('guides')}>
              {guideIds.map((id) => (
                <Link key={id} href={topicPage(id)} className={linkClass}>
                  {topicCopy(locale, id).name}
                </Link>
              ))}
            </FooterColumn>
          ) : null}
```

- [ ] **Step 9: Chạy test**

Run: `pnpm verify`
Expected: typecheck, lint, toàn bộ unit PASS (gồm `topics.test.ts`, test link ngoài).

- [ ] **Step 10: Xem bằng mắt**

Run: `pnpm build && pnpm start -p 3457` rồi chụp `/` (1280px và 390px) bằng Playwright như ở phiên trước.
Expected: khối "DocOps giải quyết việc gì…" có nhãn "TÍNH NĂNG" (3 thẻ) và "THEO LOẠI ĐƠN VỊ" (1 thẻ); footer không có cột Kiến thức (nhóm còn rỗng).

- [ ] **Step 11: Commit**

```bash
git add content/topics/index.ts components/topic/TopicHub.tsx components/topic/TopicPage.tsx components/site/Footer.tsx lib/seo/llms.ts messages/vi.json messages/en.json tests/unit/topics.test.ts tests/unit/llms.test.ts
git commit -m "feat(topics): group topic pages (features, audience, guides) on hub and footer; external links in body"
```

---

### Task 2: Thương hiệu, trang chủ, chuỗi chung

**Files:**
- Modify: `lib/seo/brand.ts` (description, audience, keywords, comment bản đồ từ khoá)
- Modify: `components/home/FaqSection.tsx:9` (`FAQ_KEYS` lấy từ messages)
- Modify: `messages/vi.json`, `messages/en.json`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: Task 1 (`topics.groups`).
- Produces: `brand.description` mới (dùng ở Task 3–8 không đổi); `FAQ_KEYS` = khoá `q\d+` của `vi.home.faq`.

- [ ] **Step 1: Test hỏng** — thêm vào `tests/unit/content.test.ts`:

```ts
describe('home FAQ', () => {
  test('vi and en have the same questions', () => {
    const keys = (m: typeof vi) => Object.keys(m.home.faq).filter((k) => /^q\d+$/.test(k))
    expect(keys(en as typeof vi)).toEqual(keys(vi))
  })
  test('covers agencies and companies', () => {
    expect(Object.values(vi.home.faq).some((v) => typeof v === 'object' && v.q.includes('doanh nghiệp'))).toBe(true)
  })
})

describe('brand reaches beyond universities', () => {
  test.each(LOCALES)('%s description names agencies and companies', (locale) => {
    expect(brand.description[locale]).toMatch(locale === 'vi' ? /cơ quan.*doanh nghiệp/ : /agencies and companies/)
  })
})
```

- [ ] **Step 2: Chạy** — `pnpm test -- tests/unit/content.test.ts` → FAIL ở hai describe mới.

- [ ] **Step 3: `lib/seo/brand.ts`**

```ts
  description: {
    vi: 'Agentra DocOps là phần mềm AI cho văn bản hành chính trường đại học, cơ quan, doanh nghiệp: tra cứu có trích dẫn, rà soát căn cứ, soạn nháp theo Nghị định 30.',
    en: 'Agentra DocOps is AI software for administrative documents at universities, agencies and companies: cited search, legal basis checks, Decree 30 drafting.',
  },
```

`audience.vi`: `'Cán bộ văn thư, hành chính, đào tạo và pháp chế ở trường đại học, cao đẳng; văn thư, hành chính, pháp chế ở cơ quan, doanh nghiệp, tổ chức'`; `audience.en`: `'Clerical, administrative, academic affairs and legal staff at universities and colleges; clerical, administrative and legal staff at agencies, companies and organizations'`.
`keywords.vi` thêm cuối `'phần mềm AI văn bản hành chính cho doanh nghiệp'`; `keywords.en` thêm cuối `'administrative document AI for companies'`.
Comment bản đồ từ khoá: thêm bốn dòng (đúng thứ tự cột hiện có):

```
 *   /ai-van-ban-co-quan-doanh-nghiep        phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp, AI cho văn thư doanh nghiệp, đoàn thể
 *   /cac-loai-van-ban-hanh-chinh            các loại văn bản hành chính, 29 loại văn bản theo Nghị định 30, chữ viết tắt tên loại văn bản
 *   /the-thuc-van-ban-hanh-chinh            thể thức văn bản hành chính, cách trình bày văn bản theo Nghị định 30, kiểm tra thể thức
 *   /docops-va-chatgpt                      dùng ChatGPT cho văn bản hành chính, DocOps và ChatGPT
```

và dòng `/soan-thao-van-ban-nghi-dinh-30` bỏ "kiểm tra thể thức" (thay bằng "mẫu văn bản Nghị định 30").

- [ ] **Step 4: `components/home/FaqSection.tsx`**

```ts
import vi from '@/messages/vi.json'

/** Khoá câu hỏi lấy từ messages (vi và en cùng bộ khoá, tests/unit/content.test.ts): thêm câu hỏi chỉ cần sửa JSON. */
export const FAQ_KEYS = Object.keys(vi.home.faq).filter((k) => /^q\d+$/.test(k))
```

- [ ] **Step 5: Messages vi**

- `common.tagline`: `Phần mềm AI xử lý văn bản hành chính cho trường đại học, cơ quan, doanh nghiệp`
- `footer.tagline`: `Phần mềm AI xử lý văn bản hành chính cho trường đại học, cơ quan, doanh nghiệp. Một sản phẩm của Agentra.`
- `home.trust.t3.title`: `Không huấn luyện trên dữ liệu của đơn vị`
- `home.faq.q3.a`: "…dữ liệu của trường…" → "…dữ liệu của đơn vị…"
- `home.faq.q8`: `{ "q": "DocOps có dùng cho cơ quan, doanh nghiệp được không?", "a": "Có. Ngoài trường đại học, DocOps dùng được cho cơ quan nhà nước, doanh nghiệp, đoàn thể và hội trình bày văn bản theo Nghị định 30: đủ 29 loại văn bản hành chính, thông tư và nghị định làm căn cứ, tra cứu có trích dẫn và soạn nháp. DocOps chưa hỗ trợ văn bản của Đảng và không quản lý chứng từ kế toán." }`
- `topics.relatedH2`: `DocOps còn làm gì cho đơn vị của bạn`
- `topics.hub.h2`: `DocOps giải quyết việc gì cho trường đại học, cơ quan và doanh nghiệp`
- `topics.hub.lead`: `Từng tính năng, từng loại đơn vị và kiến thức văn thư theo Nghị định 30, mỗi chủ đề một trang hướng dẫn chi tiết.`

Messages en:

- `common.tagline`: `AI software for administrative documents at universities, agencies and companies`
- `footer.tagline`: `AI software for administrative documents at universities, agencies and companies. A product of Agentra.`
- `home.faq.q8`: `{ "q": "Can agencies and companies use DocOps?", "a": "Yes. Beyond universities, DocOps works for government agencies, companies, unions and associations that format documents under Decree 30: all 29 administrative document types, circulars and decrees tracked as legal bases, cited search and drafting. DocOps does not yet support Communist Party documents and does not manage accounting vouchers." }`
- `topics.relatedH2`: `More of what DocOps does for your organization`
- `topics.hub.h2`: `What DocOps solves for universities, agencies and companies`
- `topics.hub.lead`: `Each feature, each type of organization and the Decree 30 records basics, each with its own in-depth page.`

`home.meta.title`, `home.hero.h1`, `brand.category` giữ nguyên (spec §6, §9).

- [ ] **Step 6: Chạy** — `pnpm verify` → PASS (brand description 158 / 153 ký tự).

- [ ] **Step 7: Commit**

```bash
git add lib/seo/brand.ts components/home/FaqSection.tsx messages/vi.json messages/en.json tests/unit/content.test.ts
git commit -m "feat(brand): describe DocOps for universities, agencies and companies; home FAQ for organizations"
```

---

### Cấu trúc chung cho Task 3–6 (mỗi trang mới)

Mỗi task làm đủ 7 việc, theo đúng mẫu `legal-basis-review`:

1. `i18n/routing.ts` thêm khoá `'/<id>': { vi: '/<slug-vi>', en: '/<id>' }` dưới dòng comment "Trang chủ đề".
2. `content/topics/index.ts`: thêm `'<id>'` vào cuối `TOPIC_IDS`; thêm dòng `TOPIC_META` (icon, image, `updated` = ngày làm, group).
3. `content/topics/vi.ts`, `en.ts`: thêm khoá `'<id>': { … }` đủ trường `TopicCopy`. Trường SEO lấy nguyên văn bảng của task (đã đo độ dài).
4. `app/[locale]/<id>/page.tsx`:

```tsx
import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('<id>')

export default function Page() {
  return <TopicPage id="<id>" />
}
```

5. `app/[locale]/<id>/opengraph-image.tsx`: chép `app/[locale]/legal-basis-review/opengraph-image.tsx`, thay `'legal-basis-review'` bằng `'<id>'`.
6. `tests/e2e/pages.spec.ts`: thêm `['/<slug-vi>', 'vi'], ['/en/<id>', 'en'],` vào `PAGES`.
7. `imageAlt`: dùng đúng câu ghi trong task (ảnh đã xem ngày 08/10/2026); ảnh dùng chung với trang cũ thì dùng lại alt của trang đó (vi.ts:135, 228; en.ts:130, 221). EN của ảnh dothi: `DocOps graph screen: an expired circular, the decision that rests on it and the documents pulled along, coloured by validity`.

`<ngày làm>` = ngày thực hiện task (hôm nay 2026-10-08), không phải ngày tương lai.

Kiểm tra mỗi task (TDD: test copy là `content.test.ts` + `llms.test.ts` + `topics.test.ts`, tự áp cho id mới; chúng hỏng khi id có trong `TOPIC_IDS` mà copy chưa đủ hoặc sai độ dài):

- `pnpm verify` → PASS.
- `pnpm build && pnpm exec playwright test tests/e2e/pages.spec.ts --project=desktop -g "<slug-vi>|/en/<id>"` → 2 PASS.

---

### Task 3: Trang cơ quan, doanh nghiệp, tổ chức

**Files:** `i18n/routing.ts`, `content/topics/index.ts`, `content/topics/vi.ts`, `content/topics/en.ts`, Create `app/[locale]/ai-for-organizations/page.tsx`, `app/[locale]/ai-for-organizations/opengraph-image.tsx`, `tests/e2e/pages.spec.ts`

- id `ai-for-organizations`, slug vi `/ai-van-ban-co-quan-doanh-nghiep`, `TOPIC_META`: `{ icon: 'archive', image: '/images/product/dothi.webp', updated: '<ngày làm>', group: 'audience' }`.

- [ ] **Step 1: Thêm id vào `TOPIC_IDS` và `TOPIC_META` trước, chạy `pnpm typecheck`** → FAIL (thiếu khoá trong `TOPICS_VI`, `TOPICS_EN`): đây là test hỏng của task.

- [ ] **Step 2: Copy vi** (`content/topics/vi.ts`):

```ts
  'ai-for-organizations': {
    name: 'AI văn bản cho cơ quan, doanh nghiệp',
    metaTitle: 'AI văn bản cho cơ quan, doanh nghiệp',
    description:
      'DocOps đọc, phân loại, tra cứu có trích dẫn và soạn nháp văn bản theo Nghị định 30 cho cơ quan, doanh nghiệp, đoàn thể. Chạy song song với hệ thống e-Office.',
    keywords: [
      'phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp',
      'AI cho văn thư doanh nghiệp',
      'phần mềm AI văn bản cho đoàn thể, tổ chức',
      'tra cứu văn bản nội bộ doanh nghiệp',
      'kho tri thức văn bản nội bộ',
    ],
    eyebrow: 'Giải pháp cho cơ quan, doanh nghiệp',
    h1: 'Phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp và tổ chức',
    lead:
      'Văn bản nào của đơn vị đang dựa trên thông tư đã bị thay thế? Quy định nội bộ nói gì về việc này, ở Điều mấy? DocOps trả lời từ chính kho văn bản của bạn và soạn nháp đúng thể thức Nghị định 30, để văn thư, hành chính và pháp chế làm nhanh hơn mà vẫn tự duyệt.',
    card: 'Cho UBND, sở ngành, doanh nghiệp, đoàn thể và hội: kho văn bản riêng, tra cứu có trích dẫn, rà soát căn cứ, soạn theo Nghị định 30.',
    inShort:
      'DocOps dùng được cho mọi đơn vị trình bày văn bản theo Nghị định 30/2020/NĐ-CP, không riêng trường học. Đơn vị nạp văn bản PDF vào kho riêng trên máy, rồi tra cứu có trích dẫn, rà soát căn cứ hết hiệu lực và soạn nháp 29 loại văn bản hành chính. DocOps chạy song song với hệ thống quản lý văn bản đi – đến đang dùng.',
    definition: {
      h2: 'DocOps phục vụ những đơn vị nào',
      term: 'Agentra DocOps',
      rest: 'là phần mềm AI cho văn bản hành chính của trường đại học, cơ quan, doanh nghiệp và tổ chức trình bày văn bản theo Nghị định 30/2020/NĐ-CP về công tác văn thư.',
      paras: [
        'Theo Điều 2 của Nghị định, cơ quan, tổ chức nhà nước và doanh nghiệp nhà nước áp dụng trực tiếp; tổ chức chính trị, tổ chức chính trị - xã hội, tổ chức xã hội, tổ chức xã hội - nghề nghiệp căn cứ Nghị định cùng các quy định của Đảng, của pháp luật để áp dụng cho phù hợp. Doanh nghiệp ngoài nhà nước không thuộc đối tượng bắt buộc, nhưng có thể lấy thể thức này làm chuẩn cho văn bản nội bộ.',
        'Luật, nghị định và thông tư không phải văn bản hành chính, nhưng DocOps theo dõi chúng như căn cứ: văn bản nào dẫn văn bản nào, văn bản nào đã bị thay thế, bãi bỏ hoặc chưa có hiệu lực.',
      ],
    },
    imageAlt: 'Màn Đồ thị của DocOps: một thông tư hết hiệu lực, quyết định đang đứng trên nó và các văn bản bị kéo theo, tô màu theo hiệu lực',
    table: {
      h2: 'Việc văn thư hằng ngày: làm tay và với DocOps',
      caption: 'So sánh cách làm năm việc văn thư thường gặp ở cơ quan, doanh nghiệp, khi làm tay và khi dùng DocOps',
      head: ['Việc', 'Làm tay', 'Với DocOps'],
      rows: [
        ['Tìm quy định nội bộ về một việc', 'Mở từng thư mục, đọc lại từng văn bản', 'Hỏi bằng lời, câu trả lời dẫn số hiệu và Điều, bấm vào mở văn bản gốc'],
        ['Biết văn bản nào dựa trên thông tư đã bị thay thế', 'Nhớ hoặc dò lại bằng tay', 'Cảnh báo trên toàn kho: bị thay thế, bãi bỏ, chưa có hiệu lực'],
        ['Soạn thông báo, quyết định, tờ trình', 'Mở văn bản cũ làm mẫu, sửa từng chỗ', 'Viết một câu ý chính, nhận bản nháp đúng thể thức, xuất Word hoặc PDF'],
        ['Kiểm tra thể thức văn bản đến', 'Soát bằng mắt', 'Kiểm 9 mục thể thức, mỗi mục đạt, thiếu hoặc cần xem'],
        ['Giữ hiểu biết về văn bản khi cán bộ chuyển công tác', 'Nằm trong đầu người cũ', 'Kho có số hiệu, hiệu lực, quan hệ pháp lý, tích luỹ theo năm'],
      ],
    },
    blocks: [
      {
        h2: 'DocOps làm gì cho đơn vị của bạn',
        items: [
          { title: 'Nạp văn bản', text: 'PDF kể cả bản quét: nhận dạng từng trang, bóc số hiệu, ngày ký, cơ quan ban hành và trích yếu; cán bộ chốt từng văn bản vào kho.' },
          { title: 'Phân loại', text: 'xếp vào 29 loại văn bản hành chính của Nghị định 30, danh sách đầy đủ ở trang', link: { topic: 'administrative-document-types' } },
          { title: 'Tra cứu', text: 'tìm toàn văn không cần gõ dấu, hỏi bằng lời và nhận câu trả lời dẫn số hiệu, Điều, xem', link: { topic: 'ai-document-search' } },
          { title: 'Rà soát căn cứ', text: 'cảnh báo văn bản đang dựa trên căn cứ bị thay thế, bãi bỏ hoặc chưa có hiệu lực, xem', link: { topic: 'legal-basis-review' } },
          { title: 'Soạn nháp', text: 'quyết định, thông báo, tờ trình, kế hoạch, báo cáo… từ một câu ý chính, xem', link: { topic: 'decree-30-drafting' } },
          { title: 'Trường đại học', text: 'có thêm phần riêng cho phòng đào tạo và quy chế học vụ, xem', link: { topic: 'ai-for-universities' } },
        ],
      },
      {
        h2: 'Chạy cùng hệ thống quản lý văn bản đang dùng',
        paras: [
          'DocOps không xử lý luồng văn bản đi – đến, trình ký hay ký số. Hệ thống e-Office hoặc phần mềm quản lý văn bản điều hành của đơn vị vẫn giữ nguyên vai trò đó.',
          'DocOps làm việc trên nội dung văn bản: xây kho tri thức, tra cứu có trích dẫn, rà soát căn cứ và soạn nháp. Bản nháp xuất ra Word hoặc PDF để đưa vào quy trình ban hành hiện có.',
        ],
      },
      {
        h2: 'Dữ liệu của đơn vị ở đâu',
        items: [
          { text: 'Kho văn bản nằm trên máy (cơ sở dữ liệu SQLite); mỗi đơn vị một key và một kho riêng; sao lưu và khôi phục tại máy.' },
          { text: 'Các bước AI (nhận dạng trang quét, phân loại, hỏi đáp, soạn nháp) gửi nội dung qua máy chủ DocOps tới mô hình AI, mặc định là Claude của Anthropic. Máy chủ không lưu nội dung.' },
          { text: 'Chi tiết cách DocOps dùng AI và bảo vệ dữ liệu ở trang', link: { page: '/ai-transparency', label: 'Minh bạch AI' } },
        ],
      },
      {
        h2: 'Những gì DocOps chưa làm',
        items: [
          { text: 'Chỉ nạp tệp PDF; tệp Word dùng được khi soạn thảo (nhập .docx vào bản nháp).' },
          { text: 'Văn bản của Đảng và của tổ chức có hướng dẫn thể thức riêng (không dùng Quốc hiệu, Tiêu ngữ) chưa được hỗ trợ: khuôn soạn thảo luôn có Quốc hiệu, Tiêu ngữ và phần kiểm tra thể thức chấm theo Nghị định 30.' },
          { text: 'Không quản lý chứng từ kế toán như hoá đơn, phiếu thu, phiếu chi.' },
          { text: 'Giao diện ứng dụng bằng tiếng Việt.' },
        ],
      },
      {
        h2: 'Bắt đầu với DocOps',
        ordered: true,
        items: [
          { text: 'Tải và cài DocOps cho Windows hoặc macOS ở trang', link: { page: '/download', label: 'Tải về' } },
          { text: 'Xin key cho đơn vị ngay trong ứng dụng, hoặc qua trang', link: { page: '/contact', label: 'Liên hệ' } },
          { text: 'Điền Thông tin đơn vị (cơ quan chủ quản, cơ quan ban hành, địa danh, người ký) để bản nháp tự điền phần thể thức.' },
          { text: 'Nạp các văn bản đang dùng làm căn cứ và văn bản nội bộ, rồi chốt từng văn bản vào kho.' },
        ],
      },
    ],
    faq: [
      { q: 'Doanh nghiệp tư nhân dùng DocOps được không?', a: 'Được. Key không giới hạn loại đơn vị. Nghị định 30 không bắt buộc doanh nghiệp ngoài nhà nước, nhưng nếu đơn vị trình bày văn bản theo thể thức này thì DocOps phân loại, tra cứu, rà soát và soạn nháp được như với cơ quan nhà nước.' },
      { q: 'DocOps có thay e-Office hay phần mềm quản lý văn bản đi – đến không?', a: 'Không. DocOps không xử lý luồng văn bản đi – đến, trình ký hay ký số. DocOps làm việc trên nội dung văn bản và xuất bản nháp ra Word hoặc PDF để đưa vào quy trình đang dùng.' },
      { q: 'Văn bản của Đảng hoặc tổ chức có thể thức riêng có dùng được không?', a: 'Chưa. Những văn bản này không dùng Quốc hiệu và Tiêu ngữ, trong khi DocOps soạn và kiểm tra thể thức theo Nghị định 30, nên chúng sẽ bị đánh giá là thiếu thành phần.' },
      { q: 'DocOps có quản lý chứng từ kế toán không?', a: 'Không. DocOps làm việc với 29 loại văn bản hành chính của Nghị định 30 và văn bản pháp luật làm căn cứ. Hoá đơn, phiếu thu, phiếu chi và chứng từ kế toán khác không thuộc phạm vi.' },
      { q: 'Dữ liệu văn bản của đơn vị nằm ở đâu?', a: 'Trên máy của bạn. Máy chủ DocOps chỉ chuyển nội dung tới mô hình AI ở các bước cần AI và không lưu nội dung. Mỗi đơn vị có key và kho riêng.' },
    ],
    share: { title: 'Cho cơ quan, doanh nghiệp', subtitle: 'Kho văn bản riêng, tra cứu có trích dẫn, soạn theo Nghị định 30' },
  },
```

Lưu ý: hai link `administrative-document-types` (Task 4) chưa tồn tại ở task này. Viết item đó **không** có `link` ở Task 3 và thêm `link` ở Task 4 Step 5.

- [ ] **Step 3: Copy en** — dịch sát bản vi, trường SEO cố định:

| Trường | Giá trị |
|---|---|
| name, metaTitle | `Document AI for agencies and companies` |
| description | `DocOps reads, classifies, searches with citations and drafts Decree 30 documents for agencies, companies and associations, alongside your e-Office system.` |
| keywords[0] | `administrative document AI for agencies and companies` |
| h1 | `Administrative document AI for agencies and companies, under Decree 30` |
| share | `{ title: 'Agencies and companies', subtitle: 'Your own repository, cited search, Decree 30 drafting' }` |

"Đảng" → "Communist Party"; "đoàn thể" → "unions"; "hội" → "associations".

- [ ] **Step 4: Route, OG, e2e** theo mục "Cấu trúc chung" 4–6 (`['/ai-van-ban-co-quan-doanh-nghiep', 'vi'], ['/en/ai-for-organizations', 'en']`).

- [ ] **Step 5: Kiểm tra** theo mục "Cấu trúc chung" → PASS.

- [ ] **Step 6: Commit**

```bash
git add i18n/routing.ts content/topics app/\[locale\]/ai-for-organizations tests/e2e/pages.spec.ts
git commit -m "feat(topics): AI for agencies, companies and organizations page"
```

---

### Task 4: Trang 29 loại văn bản hành chính

**Files:** như Task 3, thư mục `app/[locale]/administrative-document-types/`.

- id `administrative-document-types`, slug vi `/cac-loai-van-ban-hanh-chinh`, `TOPIC_META`: `{ icon: 'file', image: '/images/product/soanthao.webp', updated: '<ngày làm>', group: 'guide' }`.

- [ ] **Step 1: Thêm id, `pnpm typecheck`** → FAIL (thiếu copy).

- [ ] **Step 2: Copy vi** — trường cố định:

```ts
  'administrative-document-types': {
    name: 'Các loại văn bản hành chính',
    metaTitle: '29 loại văn bản hành chính và chữ viết tắt',
    description:
      'Bảng đủ 29 loại văn bản hành chính theo Điều 7 Nghị định 30/2020/NĐ-CP, chữ viết tắt theo Phụ lục III, dùng khi nào và các cặp viết tắt hay nhầm.',
    keywords: ['các loại văn bản hành chính', '29 loại văn bản hành chính theo Nghị định 30', 'chữ viết tắt tên loại văn bản', 'ký hiệu văn bản hành chính', 'bản sao y, trích sao, sao lục'],
    eyebrow: 'Kiến thức văn thư',
    h1: 'Các loại văn bản hành chính theo Nghị định 30 và chữ viết tắt',
    lead: 'Nghị định 30/2020/NĐ-CP quy định 29 loại văn bản hành chính và chữ viết tắt của 27 loại trong số đó. Bảng dưới đây liệt kê đủ 29 loại, cách ghép số và ký hiệu, cùng ba loại bản sao.',
    card: 'Đủ 29 loại văn bản hành chính theo Nghị định 30, chữ viết tắt chính thức, cách ghi ký hiệu và các cặp hay nhầm.',
    inShort:
      'Điều 7 Nghị định 30/2020/NĐ-CP liệt kê 29 loại văn bản hành chính, từ nghị quyết (cá biệt), quyết định (cá biệt) tới công văn, giấy mời và thư công. Phụ lục III quy định chữ viết tắt cho 27 loại; công văn và thư công không có chữ viết tắt tên loại. Ký hiệu văn bản ghép chữ viết tắt tên loại với chữ viết tắt tên cơ quan, ví dụ 15/QĐ-ABC.',
    definition: {
      h2: 'Văn bản hành chính gồm những loại nào',
      term: 'Văn bản hành chính',
      rest: 'là nhóm văn bản mà Nghị định 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư điều chỉnh, gồm 29 loại liệt kê tại Điều 7. Nhóm này khác văn bản quy phạm pháp luật như luật, nghị định, thông tư.',
      paras: ['Chữ "cá biệt" sau nghị quyết và quyết định phân biệt chúng với nghị quyết, quyết định là văn bản quy phạm pháp luật.'],
    },
    imageAlt: 'Màn Soạn thảo của DocOps: bản nháp văn bản hành chính trên trang A4 và nhãn hiệu lực của từng dòng căn cứ',
    table: {
      h2: 'Bảng 29 loại văn bản hành chính và chữ viết tắt',
      caption: 'Tên loại theo Điều 7, chữ viết tắt theo Phụ lục III Nghị định 30/2020/NĐ-CP. ABC là chữ viết tắt tên cơ quan ban hành, VP là chữ viết tắt đơn vị soạn thảo.',
      head: ['Tên loại văn bản', 'Chữ viết tắt', 'Ví dụ số, ký hiệu'],
      rows: [
        ['Nghị quyết (cá biệt)', 'NQ', '15/NQ-ABC'],
        ['Quyết định (cá biệt)', 'QĐ', '15/QĐ-ABC'],
        ['Chỉ thị', 'CT', '15/CT-ABC'],
        ['Quy chế', 'QC', '15/QC-ABC'],
        ['Quy định', 'QyĐ', '15/QyĐ-ABC'],
        ['Thông cáo', 'TC', '15/TC-ABC'],
        ['Thông báo', 'TB', '15/TB-ABC'],
        ['Hướng dẫn', 'HD', '15/HD-ABC'],
        ['Chương trình', 'CTr', '15/CTr-ABC'],
        ['Kế hoạch', 'KH', '15/KH-ABC'],
        ['Phương án', 'PA', '15/PA-ABC'],
        ['Đề án', 'ĐA', '15/ĐA-ABC'],
        ['Dự án', 'DA', '15/DA-ABC'],
        ['Báo cáo', 'BC', '15/BC-ABC'],
        ['Biên bản', 'BB', '15/BB-ABC'],
        ['Tờ trình', 'TTr', '15/TTr-ABC'],
        ['Hợp đồng', 'HĐ', '15/HĐ-ABC'],
        ['Công văn', 'Không có', '15/ABC-VP'],
        ['Công điện', 'CĐ', '15/CĐ-ABC'],
        ['Bản ghi nhớ', 'BGN', '15/BGN-ABC'],
        ['Bản thỏa thuận', 'BTT', '15/BTT-ABC'],
        ['Giấy ủy quyền', 'GUQ', '15/GUQ-ABC'],
        ['Giấy mời', 'GM', '15/GM-ABC'],
        ['Giấy giới thiệu', 'GGT', '15/GGT-ABC'],
        ['Giấy nghỉ phép', 'GNP', '15/GNP-ABC'],
        ['Phiếu gửi', 'PG', '15/PG-ABC'],
        ['Phiếu chuyển', 'PC', '15/PC-ABC'],
        ['Phiếu báo', 'PB', '15/PB-ABC'],
        ['Thư công', 'Không có', 'Không quy định chữ viết tắt tên loại'],
      ],
    },
```

Blocks (đúng 5, theo thứ tự; nội dung lấy từ "Dữ kiện đã kiểm chứng"):

1. `h2: 'Cách ghi số và ký hiệu văn bản'`, `items` (không `ordered`): số là số thứ tự trong năm, đăng ký tại Văn thư, chữ số Ả Rập, số nhỏ hơn 10 ghi thêm 0 (05); ký hiệu = chữ viết tắt tên loại + chữ viết tắt tên cơ quan (15/QĐ-ABC); công văn = chữ viết tắt tên cơ quan + chữ viết tắt đơn vị soạn thảo hoặc lĩnh vực (15/ABC-VP); gạch chéo giữa số và ký hiệu, gạch nối giữa các nhóm chữ viết tắt, không cách chữ; chữ viết tắt tên cơ quan và đơn vị do người đứng đầu quy định.
2. `h2: 'Các cặp viết tắt hay nhầm'`, items có `title`: `QĐ và QyĐ` (quyết định / quy định); `ĐA và DA` (đề án / dự án); `HD và HĐ` (hướng dẫn / hợp đồng); `CT và CTr` (chỉ thị / chương trình); `TTr và TT` (tờ trình là văn bản hành chính; TT thường dùng cho thông tư, là văn bản quy phạm pháp luật, không có trong bảng này).
3. `h2: 'Ba loại bản sao văn bản'`, items có `title`: `Bản sao y: SY`, `Bản trích sao: TrS`, `Bản sao lục: SL` (Phụ lục III).
4. `h2: 'Mẫu trình bày trong Phụ lục III'`, `ordered: true`: 10 mẫu 1.1–1.10 đúng tên ở bảng dữ kiện; một item cuối: thể thức từng thành phần ở trang + `link: { topic: 'administrative-document-format' }` (thêm ở Task 5; Task 4 viết item này không có link).
5. `h2: 'DocOps dùng bảng này thế nào'`, items: lúc nạp, AI xếp văn bản vào một trong 29 loại, văn bản ngoài bảng (luật, nghị định, thông tư) xếp "Khác" và vẫn được theo dõi làm căn cứ, cán bộ chốt; khi soạn thảo, chọn một trong 29 loại, ký hiệu theo chữ viết tắt ở bảng trên, xem `link: { topic: 'decree-30-drafting' }`.

FAQ (5): "Có bao nhiêu loại văn bản hành chính?" → 29, Điều 7 NĐ 30/2020/NĐ-CP. "Công văn viết tắt là gì?" → không có chữ viết tắt tên loại; ký hiệu công văn = chữ viết tắt tên cơ quan + chữ viết tắt đơn vị soạn thảo, ví dụ 15/ABC-VP. "Quy định viết tắt là QĐ hay QyĐ?" → QyĐ; QĐ là quyết định. "Thông tư có phải văn bản hành chính không?" → không, là văn bản quy phạm pháp luật; DocOps theo dõi thông tư làm căn cứ. "Bản trích sao viết tắt là gì?" → TrS; bản sao y SY, bản sao lục SL.

`share: { title: '29 loại văn bản hành chính', subtitle: 'Chữ viết tắt theo Phụ lục III Nghị định 30 và cách ghi ký hiệu' }`

- [ ] **Step 3: Copy en** — dịch sát; trường cố định:

| Trường | Giá trị |
|---|---|
| name | `Administrative document types` |
| metaTitle | `29 administrative document types in Vietnam` |
| description | `All 29 administrative document types in Article 7 of Decree 30/2020/ND-CP, their official abbreviations from Appendix III, when to use each, and common mix-ups.` |
| keywords[0] | `types of administrative documents` |
| h1 | `Types of administrative documents under Decree 30 and their abbreviations` |
| share | `{ title: '29 document types', subtitle: 'Official Decree 30 abbreviations and how to write reference numbers' }` |

Cột "Tên loại" en: tên tiếng Anh kèm tên tiếng Việt trong ngoặc, ví dụ `Decision, individual (Quyết định cá biệt)`; chữ viết tắt và ví dụ giữ nguyên tiếng Việt.

- [ ] **Step 4: Route, OG, e2e** (`['/cac-loai-van-ban-hanh-chinh', 'vi'], ['/en/administrative-document-types', 'en']`).

- [ ] **Step 5: Link ngược** — thêm `link: { topic: 'administrative-document-types' }` vào item "Phân loại" của `ai-for-organizations` (vi, en).

- [ ] **Step 6: Kiểm tra** theo "Cấu trúc chung"; thêm vào `tests/e2e/mobile.spec.ts`:

```ts
test('the 29-type table scrolls inside its box, not the page', async ({ page }) => {
  await page.goto('/cac-loai-van-ban-hanh-chinh')
  await expect(page.locator('table tbody tr')).toHaveCount(29)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
```

Run: `pnpm exec playwright test --project=mobile` → PASS.

- [ ] **Step 7: Commit**

```bash
git add i18n/routing.ts content/topics app/\[locale\]/administrative-document-types tests/e2e/pages.spec.ts tests/e2e/mobile.spec.ts
git commit -m "feat(topics): 29 administrative document types and abbreviations page"
```

---

### Task 5: Trang thể thức văn bản hành chính

**Files:** như Task 3, thư mục `app/[locale]/administrative-document-format/`.

- id `administrative-document-format`, slug vi `/the-thuc-van-ban-hanh-chinh`, `TOPIC_META`: `{ icon: 'tag', image: '/images/product/soanthao.webp', updated: '<ngày làm>', group: 'guide' }`.

- [ ] **Step 1: Thêm id, `pnpm typecheck`** → FAIL.

- [ ] **Step 2: Copy vi** — trường cố định:

| Trường | Giá trị |
|---|---|
| name | `Thể thức văn bản hành chính` |
| metaTitle | `Thể thức văn bản hành chính theo NĐ 30` |
| description | `9 thành phần thể thức chính theo Điều 8 Nghị định 30/2020/NĐ-CP, khổ giấy, lề, phông và cỡ chữ theo Phụ lục I, kèm checklist trước khi trình ký.` |
| keywords | `['thể thức văn bản hành chính', 'cách trình bày văn bản theo Nghị định 30', 'kiểm tra thể thức văn bản', 'kỹ thuật trình bày văn bản hành chính', 'căn lề văn bản hành chính']` |
| eyebrow | `Kiến thức văn thư` |
| h1 | `Thể thức văn bản hành chính theo Nghị định 30: 9 thành phần và cách trình bày` |
| lead | `Thể thức là các thành phần một văn bản hành chính phải có; kỹ thuật trình bày là khổ giấy, lề, phông và cỡ chữ của từng thành phần. Trang này tóm tắt cả hai theo Nghị định 30/2020/NĐ-CP, kèm checklist soát trước khi trình ký.` |
| card | `9 thành phần thể thức chính, lề, phông, cỡ chữ theo Phụ lục I Nghị định 30 và checklist soát văn bản trước khi trình ký.` |
| inShort | `Theo Điều 8 Nghị định 30/2020/NĐ-CP, văn bản hành chính có 9 thành phần chính: Quốc hiệu và Tiêu ngữ; tên cơ quan, tổ chức ban hành; số, ký hiệu; địa danh và thời gian ban hành; tên loại và trích yếu; nội dung; chức vụ, họ tên và chữ ký người có thẩm quyền; dấu, chữ ký số của cơ quan; nơi nhận. Văn bản trình bày trên khổ A4, phông Times New Roman, lề trên và dưới 20–25 mm, trái 30–35 mm, phải 15–20 mm.` |
| definition | `{ h2: 'Thể thức văn bản là gì', term: 'Thể thức văn bản', rest: 'là tập hợp các thành phần cấu thành văn bản, gồm những thành phần chính áp dụng cho mọi loại văn bản và các thành phần bổ sung trong những trường hợp cụ thể (khoản 1 Điều 8 Nghị định 30/2020/NĐ-CP).', paras: ['Kỹ thuật trình bày gồm khổ giấy, kiểu trình bày, định lề trang, phông chữ, cỡ chữ, kiểu chữ, vị trí các thành phần và số trang (Điều 9). Chi tiết nằm ở Phụ lục I; viết hoa theo Phụ lục II; chữ viết tắt tên loại theo Phụ lục III.'] }` |
| share | `{ title: 'Thể thức văn bản NĐ 30', subtitle: '9 thành phần chính, lề, phông, cỡ chữ và checklist trước khi trình ký' }` |

Bảng: `h2: 'Kỹ thuật trình bày theo Phụ lục I'`, `caption: 'Quy định chung và cỡ chữ của các thành phần chính theo Phụ lục I Nghị định 30/2020/NĐ-CP'`, `head: ['Yếu tố', 'Quy định']`, rows (đúng thứ tự):

```ts
        ['Khổ giấy', 'A4 (210 mm x 297 mm), trình bày theo chiều dài'],
        ['Lề trên, lề dưới', '20–25 mm'],
        ['Lề trái', '30–35 mm'],
        ['Lề phải', '15–20 mm'],
        ['Phông chữ', 'Times New Roman, bộ mã Unicode TCVN 6909:2001, màu đen'],
        ['Quốc hiệu', 'In hoa, cỡ 12–13, đứng, đậm'],
        ['Tiêu ngữ', 'In thường, cỡ 13–14, đứng, đậm, kẻ ngang dài bằng dòng chữ'],
        ['Tên cơ quan ban hành', 'In hoa, cỡ 12–13, đứng, đậm, kẻ ngang dài 1/3–1/2 dòng chữ'],
        ['Số, ký hiệu', 'Cỡ 13; "Số" in thường, ký hiệu in hoa'],
        ['Địa danh, ngày tháng', 'In thường, cỡ 13–14, nghiêng'],
        ['Tên loại văn bản', 'In hoa, cỡ 13–14, đứng, đậm'],
        ['Trích yếu', 'In thường, cỡ 13–14, đứng, đậm; công văn ghi sau "V/v", cỡ 12–13'],
        ['Nội dung', 'In thường, cỡ 13–14, canh đều hai lề, lùi đầu dòng 1 cm hoặc 1,27 cm, cách đoạn tối thiểu 6pt, cách dòng từ đơn tới 1,5 lines'],
        ['Quyền hạn, chức vụ người ký', 'In hoa, cỡ 13–14, đứng, đậm'],
        ['Họ tên người ký', 'In thường, cỡ 13–14, đứng, đậm'],
        ['Nơi nhận', '"Nơi nhận:" cỡ 12, nghiêng, đậm; danh sách cỡ 11, đứng'],
        ['Số trang', 'Cỡ 13–14, canh giữa trong lề trên, không hiện ở trang đầu'],
```

Blocks (đúng 4):

1. `h2: '9 thành phần thể thức chính'`, `ordered: true`, 9 items có `title` = tên thành phần theo Điều 8 khoản 2 (a–i), `text` = quy tắc Phụ lục I trong bảng dữ kiện (một đến hai câu). Item "Số, ký hiệu" có `link: { topic: 'administrative-document-types' }`.
2. `h2: 'Thành phần bổ sung'`, items: 4 mục Điều 8 khoản 3 (a–d), mục b nêu hỏa tốc, thượng khẩn, khẩn; tuyệt mật, tối mật, mật; "XEM XONG TRẢ LẠI", "LƯU HÀNH NỘI BỘ".
3. `h2: 'Checklist trước khi trình ký'`, items (không `ordered`, mỗi dòng một việc kiểm được): Quốc hiệu và Tiêu ngữ đúng chữ, Tiêu ngữ có gạch nối; tên cơ quan chủ quản và cơ quan ban hành đúng tên chính thức; số do Văn thư cấp khi đăng ký, ký hiệu đúng chữ viết tắt tên loại; địa danh có dấu phẩy, ngày nhỏ hơn 10 và tháng 1, 2 có số 0 phía trước; trích yếu ngắn, phản ánh nội dung chính; căn cứ còn hiệu lực, lần dẫn đầu ghi đủ tên loại, số, ký hiệu, ngày, cơ quan, trích yếu (`link: { topic: 'legal-basis-review' }`); quyền hạn ký đúng (TM., Q., KT., TL., TUQ.); nơi nhận đủ, dòng cuối "Lưu: VT"; lề, phông, cỡ chữ đúng bảng trên.
4. `h2: 'DocOps kiểm tra thể thức thế nào'`, paras: một đoạn theo dữ kiện app (9 mục, tách Quốc hiệu và Tiêu ngữ, không chấm nội dung nên khác cách đếm của Điều 8; đạt/thiếu/cần xem; kết luận đạt/cần xem/không đạt; AI chấm, cán bộ xem lại; áp dụng cho văn bản đã nạp vào kho); một câu "DocOps không đo lề, phông hay cỡ chữ của tệp." Items: bản nháp DocOps soạn theo khuôn Nghị định 30 ở `link: { topic: 'decree-30-drafting' }`.

FAQ (5): "Văn bản hành chính có bao nhiêu thành phần thể thức?" (9 chính, 4 nhóm bổ sung, Điều 8). "Căn lề văn bản hành chính thế nào?" (trên, dưới 20–25 mm; trái 30–35 mm; phải 15–20 mm). "Văn bản hành chính dùng phông và cỡ chữ nào?" (Times New Roman TCVN 6909:2001 màu đen; nội dung cỡ 13–14; Quốc hiệu 12–13). "Trang đầu có đánh số trang không?" (không hiện số trang thứ nhất; số trang cỡ 13–14 canh giữa lề trên). "Ghi ngày tháng ban hành thế nào?" (ngày nhỏ hơn 10 và tháng 1, 2 thêm số 0, ví dụ "Hà Nội, ngày 05 tháng 02 năm 2026").

- [ ] **Step 3: Copy en** — dịch sát; trường cố định:

| Trường | Giá trị |
|---|---|
| name | `Administrative document format` |
| metaTitle | `Administrative document format, Decree 30` |
| description | `The nine main format parts in Article 8 of Decree 30/2020/ND-CP, plus paper size, margins, font and sizes from Appendix I, with a checklist before signing.` |
| keywords[0] | `administrative document format` |
| h1 | `Administrative document format under Decree 30: nine parts and layout rules` |
| share | `{ title: 'Decree 30 format', subtitle: 'Nine main parts, margins, font, sizes and a checklist before signing' }` |

Giữ nguyên chữ tiếng Việt bắt buộc (Quốc hiệu "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", "Độc lập - Tự do - Hạnh phúc", "V/v", "Nơi nhận:", "Lưu: VT").

- [ ] **Step 4: Route, OG, e2e** (`['/the-thuc-van-ban-hanh-chinh', 'vi'], ['/en/administrative-document-format', 'en']`).

- [ ] **Step 5: Link ngược** — thêm `link: { topic: 'administrative-document-format' }` vào item cuối block 4 của `administrative-document-types` (vi, en).

- [ ] **Step 6: Kiểm tra** theo "Cấu trúc chung" → PASS.

- [ ] **Step 7: Commit**

```bash
git add i18n/routing.ts content/topics app/\[locale\]/administrative-document-format tests/e2e/pages.spec.ts
git commit -m "feat(topics): Decree 30 administrative document format page"
```

---

### Task 6: Trang DocOps và ChatGPT

**Files:** như Task 3, thư mục `app/[locale]/docops-vs-chatgpt/`.

- id `docops-vs-chatgpt`, slug vi `/docops-va-chatgpt`, `TOPIC_META`: `{ icon: 'message', image: '/images/product/tracuu.webp', updated: '<ngày làm>', group: 'guide' }`.

- [ ] **Step 1: Đối chiếu nguồn OpenAI bằng trình duyệt** (Claude in Chrome: `tabs_create_mcp` + `get_page_text`) cho ba URL ở bảng dữ kiện. Ghi lại câu chữ thật. Câu nào không còn đúng → sửa copy theo trang, hoặc bỏ dòng đó. Không mở được trang → giữ câu theo trích đoạn và ghi "đối chiếu ngày 08/10/2026" (đã có trong copy).

- [ ] **Step 2: Thêm id, `pnpm typecheck`** → FAIL.

- [ ] **Step 3: Copy vi** — trường cố định:

| Trường | Giá trị |
|---|---|
| name | `DocOps và ChatGPT` |
| metaTitle | `DocOps và ChatGPT cho văn bản hành chính` |
| description | `So sánh DocOps và ChatGPT khi làm văn bản hành chính: nguồn câu trả lời, trích dẫn số hiệu và Điều, rà soát hiệu lực, thể thức Nghị định 30, dữ liệu đi đâu.` |
| keywords | `['dùng ChatGPT cho văn bản hành chính', 'DocOps và ChatGPT', 'ChatGPT soạn văn bản hành chính', 'so sánh AI cho văn thư', 'bảo mật dữ liệu khi dùng ChatGPT']` |
| eyebrow | `So sánh` |
| h1 | `Dùng ChatGPT cho văn bản hành chính hay DocOps? So sánh trung thực` |
| lead | `ChatGPT viết tốt và biết rộng. DocOps làm hẹp hơn: trả lời từ chính kho văn bản của đơn vị, dẫn số hiệu và Điều, biết căn cứ nào đã hết hiệu lực và soạn đúng thể thức Nghị định 30. Bảng dưới đây so sánh từng điểm, kể cả chỗ ChatGPT hợp hơn.` |
| card | `So sánh trung thực khi làm văn bản hành chính: nguồn câu trả lời, trích dẫn, hiệu lực căn cứ, thể thức và dữ liệu.` |
| inShort | `ChatGPT là trợ lý đa năng, trả lời từ kiến thức của mô hình, tìm kiếm web và tệp bạn tải lên. DocOps là ứng dụng desktop chỉ dành cho văn bản hành chính: câu trả lời chỉ lấy từ kho văn bản của đơn vị, dẫn số hiệu và Điều, căn cứ hết hiệu lực được cảnh báo và bản nháp theo khuôn Nghị định 30. Dùng ChatGPT cho việc viết chung; dùng DocOps khi câu trả lời phải dựa trên văn bản của đơn vị.` |
| definition | `{ h2: 'Khác nhau ở đâu', term: 'Khác biệt chính', rest: 'nằm ở nguồn câu trả lời: ChatGPT trả lời từ kiến thức chung và những gì bạn đưa vào cuộc trò chuyện, còn DocOps chỉ trả lời từ kho văn bản đơn vị đã nạp và loại bỏ văn bản không có trong kho.', paras: ['Thông tin về ChatGPT trên trang này lấy từ trang trợ giúp của OpenAI, đối chiếu ngày 08/10/2026. Tính năng và chính sách của ChatGPT có thể thay đổi; hãy xem trang gốc trước khi quyết định.'] }` |
| share | `{ title: 'DocOps và ChatGPT', subtitle: 'Nguồn câu trả lời, trích dẫn, hiệu lực căn cứ và dữ liệu' }` |

Bảng: `h2: 'So sánh từng điểm'`, `caption: 'So sánh ChatGPT và DocOps khi làm văn bản hành chính, theo trang của OpenAI và tài liệu DocOps, ngày 08/10/2026'`, `head: ['Tiêu chí', 'ChatGPT', 'DocOps']`, rows:

```ts
        ['Nguồn câu trả lời', 'Kiến thức của mô hình, tìm kiếm web và tệp bạn tải lên; tệp trong một dự án (Projects) dùng được cho các cuộc trò chuyện của dự án đó', 'Chỉ kho văn bản đơn vị đã nạp và cán bộ đã chốt'],
        ['Trích dẫn', 'Kèm link nguồn khi dùng tìm kiếm web', 'Mỗi câu trả lời dẫn số hiệu và Điều, bấm vào mở văn bản gốc'],
        ['Khi không có thông tin', 'Có thể trả lời từ kiến thức chung; OpenAI lưu ý ChatGPT có thể mắc lỗi và nên kiểm tra thông tin quan trọng', 'Nói rõ "Chưa tìm thấy trong kho"; văn bản AI nhắc tới mà không có trong kho bị loại và hiện cảnh báo'],
        ['Căn cứ hết hiệu lực', 'Không theo dõi quan hệ thay thế, bãi bỏ giữa các văn bản của đơn vị', 'Cảnh báo căn cứ bị thay thế, bãi bỏ, chưa có hiệu lực trên toàn kho, xem tại một ngày bất kỳ'],
        ['Soạn văn bản', 'Viết theo lời nhắc; thể thức phụ thuộc lời nhắc và người dùng tự soát', 'Khuôn 29 loại theo Nghị định 30, tự điền thông tin đơn vị, chỉ đề xuất căn cứ còn hiệu lực, xuất Word và PDF'],
        ['Dữ liệu và huấn luyện', 'Gói cá nhân: hội thoại có thể được dùng để huấn luyện mô hình, trừ khi tắt "Improve the model for everyone". Gói Business, Enterprise, Edu: mặc định không dùng để huấn luyện', 'Kho lưu tại máy; nội dung đi qua máy chủ DocOps tới mô hình AI để xử lý, máy chủ không lưu nội dung; Agentra không dùng dữ liệu của đơn vị để huấn luyện'],
        ['Cách dùng', 'Trên web, ứng dụng máy tính và điện thoại', 'Ứng dụng desktop Windows, macOS; kích hoạt bằng key của đơn vị'],
        ['Phạm vi', 'Đa năng: viết, dịch, tóm tắt và nhiều việc khác', 'Chỉ văn bản hành chính: nạp, phân loại, tra cứu, rà soát, soạn nháp'],
```

Blocks (đúng 4):

1. `h2: 'Khi nào ChatGPT hợp hơn'`, items: viết thư, bài phát biểu, nội dung truyền thông không cần căn cứ; hỏi kiến thức chung, giải thích khái niệm; dịch hoặc tóm tắt một tài liệu đơn lẻ; đơn vị chưa có kho văn bản và chỉ cần một bản nháp nhanh để tự sửa.
2. `h2: 'Khi nào DocOps hợp hơn'`, items: câu trả lời phải dẫn đúng văn bản đơn vị đang áp dụng (`link: { topic: 'ai-document-search' }`); cần biết văn bản nào dựa trên căn cứ đã bị thay thế (`link: { topic: 'legal-basis-review' }`); soạn quyết định, tờ trình, thông báo đúng thể thức với căn cứ còn hiệu lực (`link: { topic: 'decree-30-drafting' }`); muốn kho văn bản nằm tại máy và có nhật ký quyết định của cán bộ (`link: { page: '/ai-transparency', label: 'Minh bạch AI' }`).
3. `h2: 'Lưu ý khi đưa văn bản nội bộ vào ChatGPT'`, paras: `'Với tài khoản cá nhân, kiểm tra mục Data Controls và tắt "Improve the model for everyone" nếu không muốn hội thoại được dùng để huấn luyện. Văn bản mật hoặc có thông tin cá nhân phải theo quy định về bảo vệ bí mật nhà nước và dữ liệu cá nhân của đơn vị, dù dùng công cụ AI nào.'`; items có link ngoài: `{ text: 'Cài đặt huấn luyện của gói cá nhân:', link: { href: 'https://help.openai.com/en/articles/7730893-data-controls-faq', label: 'Data Controls FAQ (OpenAI)' } }`, `{ text: 'Chính sách dữ liệu của gói doanh nghiệp:', link: { href: 'https://openai.com/business-data/', label: 'Business data privacy (OpenAI)' } }`, `{ text: 'Cách tệp trong dự án được dùng:', link: { href: 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt', label: 'Projects in ChatGPT (OpenAI)' } }`.
4. `h2: 'Dùng cả hai'`, paras: `'Hai công cụ không loại trừ nhau. Một cách chia việc: ChatGPT cho phần viết tự do không dựa trên văn bản của đơn vị, DocOps cho mọi câu hỏi và bản nháp phải dựa trên kho văn bản và căn cứ còn hiệu lực.'`

FAQ (5):
- `DocOps có dùng ChatGPT bên trong không?` → `Không. Mô hình mặc định của DocOps là Claude của Anthropic; Agentra có thể cấu hình mô hình khác cho từng đơn vị, như GLM. Nội dung đi qua máy chủ DocOps tới nhà cung cấp mô hình, máy chủ không lưu nội dung.`
- `Tải văn bản của đơn vị lên ChatGPT có an toàn không?` → `Tuỳ gói và cài đặt. Theo OpenAI, hội thoại ở gói cá nhân có thể được dùng để huấn luyện trừ khi bạn tắt "Improve the model for everyone"; gói Business, Enterprise và Edu mặc định không dùng dữ liệu để huấn luyện. Văn bản mật không nên đưa vào dịch vụ AI trực tuyến nào nếu quy định của đơn vị không cho phép.`
- `ChatGPT có soạn được văn bản theo Nghị định 30 không?` → `Có thể soạn theo lời nhắc, nhưng ChatGPT không có sẵn thông tin đơn vị, không biết căn cứ nào trong kho còn hiệu lực, và thể thức cần người dùng tự soát. DocOps dùng khuôn 29 loại văn bản của Nghị định 30, tự điền thông tin đơn vị và chỉ đề xuất căn cứ còn hiệu lực trong kho.`
- `DocOps có miễn phí không?` → `Tải và cài DocOps miễn phí; chi phí sử dụng tính theo quy mô của đơn vị, liên hệ để nhận báo giá.`
- `Nên chọn DocOps hay ChatGPT?` → `Chọn theo nguồn câu trả lời bạn cần. Việc viết chung, không cần căn cứ: ChatGPT. Câu trả lời, bản nháp phải dựa trên văn bản đơn vị đang áp dụng và căn cứ còn hiệu lực: DocOps. Nhiều việc dùng được cả hai.`

- [ ] **Step 4: Copy en** — dịch sát; trường cố định:

| Trường | Giá trị |
|---|---|
| name | `DocOps vs ChatGPT` |
| metaTitle | `DocOps vs ChatGPT for official documents` |
| description | `DocOps vs ChatGPT for administrative documents: where answers come from, citations to number and article, validity checks, Decree 30 format and where data goes.` |
| keywords[0] | `ChatGPT for administrative documents` |
| h1 | `ChatGPT for administrative documents, or DocOps? An honest comparison` |
| share | `{ title: 'DocOps vs ChatGPT', subtitle: 'Answer sources, citations, validity checks and data' }` |

- [ ] **Step 5: Route, OG, e2e** (`['/docops-va-chatgpt', 'vi'], ['/en/docops-vs-chatgpt', 'en']`).

- [ ] **Step 6: Mọi nhóm đều có trang** — thêm vào `tests/unit/topics.test.ts`:

```ts
test('every group has at least one topic page', () => {
  expect(topicsByGroup().map((g) => g.group)).toEqual([...TOPIC_GROUPS])
})
```

- [ ] **Step 7: Kiểm tra** theo "Cấu trúc chung" + `pnpm test` → PASS.

- [ ] **Step 8: Commit**

```bash
git add i18n/routing.ts content/topics app/\[locale\]/docops-vs-chatgpt tests/e2e/pages.spec.ts tests/unit/topics.test.ts
git commit -m "feat(topics): honest DocOps vs ChatGPT comparison page"
```

---

### Task 7: Sửa nội dung trang chủ đề cũ

**Files:** `content/topics/vi.ts`, `content/topics/en.ts`, `content/topics/index.ts` (`updated` của 4 trang cũ)

- [ ] **Step 1: Test hỏng** — thêm vào `tests/unit/content.test.ts`:

```ts
describe('claims match the app', () => {
  const all = JSON.stringify(TOPICS)
  test('no four business layers and no unit-task tab', () => {
    expect(all).not.toMatch(/bốn lớp nghiệp vụ|four business layers|Việc theo đơn vị|Tasks by unit/)
  })
  test('feature pages speak to any organization', () => {
    for (const id of ['legal-basis-review', 'ai-document-search'] as const) {
      expect(`${TOPICS.vi[id].h1} ${TOPICS.vi[id].description}`).not.toMatch(/của trường/)
      expect(`${TOPICS.en[id].h1} ${TOPICS.en[id].description}`).not.toMatch(/universit/i)
    }
  })
})
```

Run: `pnpm test -- tests/unit/content.test.ts` → FAIL.

- [ ] **Step 2: `legal-basis-review` (vi)**

- `description`: "…trong văn bản của trường, …" → "…trong văn bản của đơn vị, …"
- `h1`: `Rà soát căn cứ pháp lý hết hiệu lực trong văn bản của đơn vị`
- `lead`: `Khi thông tư, nghị định mới được ban hành, quy chế và quyết định của đơn vị có thể đang đứng trên căn cứ đã bị thay thế. DocOps dò toàn bộ kho, chỉ ra văn bản nào cần sửa và vì sao, kèm câu gốc làm bằng chứng.`
- block "Bắt đầu rà soát kho văn bản của trường" → `Bắt đầu rà soát kho văn bản của đơn vị`; item "…thông tư, quyết định của Bộ và văn bản nội bộ của trường." → "…thông tư, quyết định của cơ quan cấp trên và văn bản nội bộ của đơn vị."
- đoạn bán kính ảnh hưởng (dòng 65): `Rà soát trả lời câu hỏi sau khi luật đã đổi. Bán kính ảnh hưởng trả lời câu hỏi trước khi đổi: một Điều đang gánh bao nhiêu con số chốt (số năm, tỉ lệ, mức thu, số tín chỉ), cổng chặn và ngưỡng trong kho.`
- item "Dùng AI" (dòng 72): `đọc văn bản, bóc các quan hệ dẫn chiếu và ba lớp nghiệp vụ (con số chốt, cổng chặn, ngưỡng) từ nội dung.`
- Giữ đoạn ví dụ trường đại học (dòng 28): giáo dục vẫn là ví dụ chính.

en tương ứng: `h1`: `Legal basis review: find documents that rest on expired references`; description bỏ "university"; dòng 60: `…how many key figures (years, ratios, fees, credits), hard gates and thresholds in the repository rest on a given article.`; dòng 67: `reading documents and extracting cross-references and three business layers (key figures, hard gates, thresholds) from their content.`

- [ ] **Step 3: `ai-document-search`**

vi: `description` "…kho văn bản của trường…" → "…kho văn bản của đơn vị…"; `lead` "…nắm hết quy chế của trường." → "…nắm hết quy chế, quy định của đơn vị."; `card` "…của trường…" → "…của đơn vị…"; `share.subtitle` → `Câu trả lời chỉ từ kho của đơn vị, trích dẫn số hiệu và Điều`; block "Tra theo lớp nghiệp vụ" đoạn: `Ngoài kết quả tìm kiếm, màn Tra cứu có thẻ Ngưỡng & con số và thẻ Cổng chặn. Đây là các dòng nghiệp vụ AI đã bóc từ văn bản lúc nạp, mỗi dòng ghi rõ lấy từ Điều nào của văn bản nào. Ở trường đại học, phòng đào tạo xem ngay mọi ngưỡng học vụ và con số chốt mà không phải mở từng quy chế.`
en: `lead` "…every regulation of your university." → "…every regulation of your organization."; `card` "…your university documents…" → "…your organization's documents…"; block "Search by business layer": `Besides search results, the Search screen has a Thresholds and figures tab and a Hard gates tab. These are business rows the AI extracted at ingestion, each naming the article and document it comes from. At a university, the academic affairs office sees every academic threshold and key figure without opening each regulation.`

- [ ] **Step 4: `decree-30-drafting`**

vi `keywords`: `['soạn thảo văn bản theo Nghị định 30', 'AI soạn thảo văn bản hành chính', 'mẫu văn bản Nghị định 30', 'soạn quyết định, tờ trình, thông báo bằng AI']`; block "Kiểm tra thể thức văn bản đến" thêm item: `{ text: 'Toàn bộ thành phần thể thức và kỹ thuật trình bày theo Nghị định 30 có ở trang', link: { topic: 'administrative-document-format' } }`. en tương ứng (`keywords` bỏ "format check").

- [ ] **Step 5: `ai-for-universities`** — block "Ai trong trường dùng DocOps" (vi dòng 339–342) thêm item: `{ title: 'Ngoài trường học', text: 'cơ quan, doanh nghiệp và tổ chức dùng cùng các tính năng này, xem', link: { topic: 'ai-for-organizations' } }`; en: `{ title: 'Beyond universities', text: 'agencies, companies and organizations use the same features, see', link: { topic: 'ai-for-organizations' } }`.

- [ ] **Step 6: `TOPIC_META.updated`** của 4 trang cũ = ngày làm.

- [ ] **Step 7: Chạy** — `pnpm verify` → PASS (độ dài, từ khoá chính, test claim).

- [ ] **Step 8: Commit**

```bash
git add content/topics tests/unit/content.test.ts
git commit -m "fix(copy): feature pages speak to any organization; three business layers, no unit-task tab"
```

---

### Task 8: Kiểm chứng toàn bộ

**Files:** Modify `tests/e2e/pages.spec.ts` (test hub theo nhóm)

- [ ] **Step 1: E2E hub** — thêm:

```ts
test('home topic hub lists every topic page in three groups', async ({ page }) => {
  await page.goto('/')
  for (const label of ['Tính năng', 'Theo loại đơn vị', 'Kiến thức văn thư']) await expect(page.locator('main').getByText(label, { exact: true }).first()).toBeVisible()
  for (const href of [
    '/ra-soat-can-cu-phap-ly', '/soan-thao-van-ban-nghi-dinh-30', '/tra-cuu-van-ban-ai', '/chuyen-doi-so-van-thu-truong-dai-hoc',
    '/ai-van-ban-co-quan-doanh-nghiep', '/cac-loai-van-ban-hanh-chinh', '/the-thuc-van-ban-hanh-chinh', '/docops-va-chatgpt',
  ]) await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible()
})
```

- [ ] **Step 2: Unit + e2e đầy đủ (build như CI)**

Run: `pnpm verify && NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST pnpm build && pnpm e2e`
Expected: mọi test PASS (desktop + mobile).

- [ ] **Step 3: Audit SEO bản production**

```bash
VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=https://docops.agentra.io.vn pnpm build
pnpm start -p 3457 &
until curl -sf -o /dev/null http://localhost:3457/; do sleep 1; done
node ~/.claude/skills/seo-master/scripts/seo-audit.mjs --base http://localhost:3457 --canonical https://docops.agentra.io.vn --next-manifest .next/prerender-manifest.json
```

Expected: `0 errors`, `sitemap 32 URLs`, `indexable self-canonical 32`. Cảnh báo `sitemap-lastmod-build-time` (nhiều URL cùng ngày sửa thật) được phép, ghi lý do.

- [ ] **Step 4: Kiểm tra tay**

- `curl -s http://localhost:3457/llms.txt | grep -c "docops.agentra.io.vn"` tăng so với 26 link trước đây; có 4 trang mới vi và en.
- `curl -sI http://localhost:3457/cac-loai-van-ban-hanh-chinh/opengraph-image` → `200`, `image/png`.
- Chụp màn hình 390px và 1280px: `/`, `/cac-loai-van-ban-hanh-chinh`, `/docops-va-chatgpt`. Xem bằng mắt: nhãn nhóm, bảng 29 dòng cuộn trong khung, footer 5 cột ở lg.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/pages.spec.ts
git commit -m "test(e2e): home hub shows all topic pages in three groups"
```

- [ ] **Step 6: Báo PO** — số liệu kiểm chứng; danh sách việc sau deploy: audit site live, Search Console URL Inspection + yêu cầu index 4 trang vi, cập nhật `sameAs`/hồ sơ ngoài bằng câu mô tả mới; việc cho team app (placeholder "HIỆU TRƯỞNG", "12/ĐHSP-ĐT", ví dụ sinh viên, bảng "Ngưỡng học vụ", dữ liệu mẫu, "TS" → "TrS" trong `s04-v4.md`). Hỏi PO merge `feat/mo-rong-dinh-vi` vào `main` (= deploy) hay chưa.
