# Thiết kế: Landing page Agentra DocOps

Ngày: 16/09/2026 · Trạng thái: chờ PO duyệt · Repo: `docops-landing-page`

## 1. Mục tiêu và bối cảnh

Trang web marketing cho **Agentra DocOps**, phần mềm desktop (Windows, macOS) dùng AI xử lý văn bản
hành chính trường đại học: nhập và phân loại, tra cứu có trích dẫn, dò tác động pháp lý, soạn thảo
theo Nghị định 30/2020, cán bộ duyệt cuối. Trang web thay thế site hiện tại tại
`https://docops.agentra.io.vn` (Next.js, chỉ tiếng Việt, gắn với web app cũ) bằng một site tĩnh hai
ngôn ngữ, chuẩn SEO Google, deploy Vercel, cho người dùng **tải bộ cài desktop** kèm hướng dẫn cài
đặt, và trang liên hệ.

Nguồn tham chiếu:

- Nội dung và định vị: site cũ (hero, quy trình 6 bước, ba luồng lõi, bốn lợi ích, trang "Quy
  trình", trang "Minh bạch AI" mười nguyên tắc).
- Hướng dẫn cài đặt: `docops-application/docs/huong-dan/cai-dat-tester.md` và
  `cai-dat-tester-windows.md`.
- Hệ token màu và logo: `docops-application/packages/ui/src/tokens.css`, `Logo.tsx`,
  `docs/thiet-ke/README.md`; `logo-mark.svg` (gradient) lấy từ site cũ.
- Bộ cài và feed cập nhật: `docops-application/packages/desktop/package.json` (`build.publish`
  provider `generic`, url `https://download-docsopapp.agentra.io.vn/desktop/`), các tệp `latest.yml`,
  `latest-mac.yml` trong thư mục `release/`.

## 2. Phạm vi

Trong phạm vi:

- 8 trang × 2 ngôn ngữ (vi mặc định, en), sinh tĩnh lúc build.
- Trang Tải về tự cập nhật từ feed phát hành trên VPS (ISR 10 phút) với snapshot dự phòng.
- Hai hướng dẫn cài đặt (macOS, Windows) dạng MDX theo ngôn ngữ.
- SEO: metadata, hreflang, canonical, sitemap, robots, JSON-LD, ảnh Open Graph, redirect từ URL cũ.
- Analytics: Vercel Analytics, Speed Insights, GA4 với sự kiện tuỳ chỉnh và thanh đồng ý cookie.
- Trang Liên hệ không form: email, địa chỉ, hướng dẫn nhận key, báo lỗi.
- Kiểm thử đơn vị, e2e, Lighthouse CI; cấu hình deploy Vercel; tài liệu vận hành.
- Canvas thiết kế (Claude Design) làm chuẩn hình ảnh trước khi code.

Ngoài phạm vi (không làm ở V1):

- Web app cũ: bỏ hoàn toàn, không có link "Mở workspace", không giữ `/login`, `/api`, `/admin`.
- Form liên hệ, form xin key, gửi email, CMS, blog, trang bảng giá, dark mode, bản Linux, ký số bộ
  cài, ngôn ngữ thứ ba.

## 3. Quyết định đã chốt với PO

| # | Quyết định | Chọn |
|---|---|---|
| 1 | Nơi host bộ cài (150–192 MB/tệp) | VPS download hiện có, trang web chỉ dẫn link; đọc `latest*.yml` |
| 2 | Domain | Thay thế `docops.agentra.io.vn`; web app cũ bỏ hoàn toàn |
| 3 | Tracking | Vercel Analytics + Speed Insights, Google Analytics 4 |
| 4 | Form | Không form; chỉ email `info@agentra.io.vn` và địa chỉ Đà Nẵng; chỗ trống cho điện thoại/Zalo |
| 5 | Hướng tiếp cận | Next.js App Router tĩnh là chính, ISR cho feed, snapshot dự phòng |
| 6 | Thanh đồng ý cookie | Có; GA4 chỉ nạp sau khi đồng ý |

## 4. Kiến trúc tổng thể

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, pnpm, Tailwind CSS 4,
next-intl 4, `@next/mdx` + `remark-gfm`, `yaml`, `@vercel/analytics`, `@vercel/speed-insights`,
`@next/third-parties` (GA4), Vitest, Playwright, `@lhci/cli`. Node ≥ 22 (Vercel chạy Node 24).
Không dùng thư viện component; không dùng Edge runtime.

```
app/
  layout.tsx                 # chỉ trả về children; <html>/<body> nằm ở [locale]/layout
  robots.ts  sitemap.ts  manifest.ts
  [locale]/
    layout.tsx               # <html lang>, font, Header/Footer, Analytics, ConsentBar, setRequestLocale
    [...rest]/page.tsx       # mọi đường dẫn lạ → notFound() → 404 theo ngôn ngữ
    opengraph-image.tsx      # ảnh OG theo ngôn ngữ (next/og)
    not-found.tsx  error.tsx
    page.tsx                 # Trang chủ
    download/page.tsx        # slug dịch: /tai-ve, /en/download
    install/[os]/page.tsx    # os ∈ {macos, windows}; generateStaticParams
    how-it-works/page.tsx    # /quy-trinh
    ai-transparency/page.tsx # /minh-bach-ai
    contact/page.tsx         # /lien-he
    privacy/page.tsx         # /chinh-sach-bao-mat
proxy.ts                     # routing next-intl (quy ước Next 16, thay middleware.ts)
i18n/routing.ts  i18n/request.ts  i18n/navigation.ts
messages/vi.json  messages/en.json
content/install/{vi,en}/{macos,windows}.mdx
content/releases.json        # snapshot feed phát hành
lib/releases/                # feed.ts (tải), parse.ts (YAML → assets), snapshot.ts, index.ts
lib/seo/                     # metadata.ts, jsonld.ts
lib/analytics.ts  lib/platform.ts  lib/site.ts (hằng số: tên, email, địa chỉ, URL)
components/ui/               # Button, Container, Section, Card, Callout, Badge, Icon
components/site/             # Header, MobileNav, Footer, LocaleSwitcher, ConsentBar, SkipLink
components/home/             # Hero, PipelineStrip, CoreFlows, Benefits, TrustGrid, DownloadBlock, Faq, FinalCta
components/download/         # PlatformCard, ChecksumField, SystemRequirements
components/guide/            # Steps, Step, Toc, mdx-components
scripts/sync-releases.ts     # cập nhật content/releases.json
public/images/product/*.webp # ảnh màn hình app
public/brand/                # logo-mark.svg, favicon, apple-icon
tests/unit/**  tests/e2e/**  lighthouserc.json
```

Mọi trang là Server Component; chỉ các mảnh tương tác (Header mobile, LocaleSwitcher, ConsentBar,
nút tải theo hệ điều hành, ChecksumField, Faq) là Client Component.

## 5. Đa ngôn ngữ và routing

- next-intl với `localePrefix: 'as-needed'`: tiếng Việt không tiền tố, tiếng Anh dưới `/en`.
- Slug dịch qua `pathnames`; khoá nội bộ là tên tiếng Anh:

| Khoá nội bộ | Tiếng Việt | English |
|---|---|---|
| `/` | `/` | `/en` |
| `/download` | `/tai-ve` | `/en/download` |
| `/install/[os]` | `/huong-dan-cai-dat/macos`, `/huong-dan-cai-dat/windows` | `/en/install/macos`, `/en/install/windows` |
| `/how-it-works` | `/quy-trinh` | `/en/how-it-works` |
| `/ai-transparency` | `/minh-bach-ai` | `/en/ai-transparency` |
| `/contact` | `/lien-he` | `/en/contact` |
| `/privacy` | `/chinh-sach-bao-mat` | `/en/privacy` |

- `/quy-trinh` và `/minh-bach-ai` giữ đúng slug site cũ để không mất thứ hạng.
- Mọi trang gọi `setRequestLocale(locale)` và khai `generateStaticParams` cho hai locale, để build
  ra HTML tĩnh. Locale không hợp lệ → `notFound()`.
- Chuyển ngôn ngữ giữ nguyên trang hiện tại (dùng `Link`/`usePathname` của `i18n/navigation.ts`).
  Không tự chuyển theo `Accept-Language` (`localeDetection: false`): người Việt vào `/` phải thấy
  tiếng Việt, Google thấy cùng nội dung ở cùng URL.
- `<html lang>` = `vi` hoặc `en`. Chuỗi giao diện trong `messages/*.json`, khoá có kiểu (khai
  `Messages` từ `vi.json`); test bắt hai tệp có cùng tập khoá.
- Nội dung dài (hướng dẫn cài đặt, chính sách bảo mật) là MDX theo ngôn ngữ, chọn bằng bảng tĩnh
  `{ vi: { macos: () => import(...) } }` để Turbopack phân tích được.

## 6. Nội dung từng trang

Tiếng Việt là bản gốc; bản tiếng Anh dịch sát nghĩa, cùng cấu trúc. Dưới đây ghi bản tiếng Việt.

### 6.1 Trang chủ

1. **Header**: logo mark + chữ "Agentra DocOps"; menu Quy trình · Minh bạch AI · Tải về · Liên hệ;
   chuyển VI/EN; nút chính "Tải DocOps" → `/download`. Mobile: nút menu mở panel toàn màn.
2. **Hero**: eyebrow "Ứng dụng desktop cho Windows và macOS"; H1 "Tác tử AI cho văn bản hành chính
   trường đại học"; phụ đề "Từ văn bản đến quyết định, trong vài phút thay vì vài ngày"; nút chính
   "Tải về cho macOS" / "Tải về cho Windows" (theo hệ điều hành nhận được, mặc định "Tải DocOps");
   nút phụ "Xem quy trình"; ảnh màn hình Rà soát trong khung cửa sổ; dòng tin cậy "Dữ liệu lưu tại
   máy · Trích dẫn bắt buộc · Cán bộ duyệt cuối".
3. **Dải quy trình 6 bước**: Nhập (PDF/ảnh) → Phân loại (bóc metadata) → Tra cứu (Q&A trích dẫn) →
   Tác động (đồ thị pháp lý) → Soạn thảo (nháp theo NĐ 30) → Cán bộ kiểm & duyệt. Chú thích
   "Quy trình 6 bước, người quyết ở bước cuối".
4. **DocOps làm gì**: ba thẻ luồng lõi, mỗi thẻ có ảnh màn hình nhỏ.
   - Nhập & phân loại: OCR, nhận dạng dấu và chữ ký, bóc metadata, phân loại và định tuyến.
   - Tra cứu & Q&A: hỏi bằng ngôn ngữ tự nhiên trên toàn kho; trả lời có trích dẫn; nói "chưa đủ
     căn cứ" thay vì suy diễn.
   - Tác động & soạn thảo: dò quan hệ pháp lý, cảnh báo căn cứ hết hiệu lực, sinh nháp theo mẫu
     Nghị định 30, kiểm thể thức.
5. **Vì sao chọn DocOps**: Từ giờ xuống phút · Trích dẫn bắt buộc · Giữ tri thức thể chế · Bám
   chuẩn Nghị định 30/2020.
6. **Minh bạch và an toàn**: Con người quyết (AI chỉ hỗ trợ) · Dữ liệu tại máy, mỗi đơn vị một key
   và workspace riêng · Không dùng dữ liệu của trường để huấn luyện mô hình. Link "Đọc chính sách
   minh bạch AI".
7. **Khối tải về**: ba thẻ nền tảng (Windows x64 · macOS Apple Silicon · macOS Intel) hiện phiên
   bản và dung lượng, nút tải, link "Hướng dẫn cài đặt". Dùng chung dữ liệu với trang Tải về.
8. **FAQ** (6 câu, `<details>`, kèm JSON-LD FAQPage): Key kích hoạt là gì và xin ở đâu? · Có cần
   Internet không? · Dữ liệu văn bản lưu ở đâu? · Vì sao Windows/macOS cảnh báo khi cài? · Cập
   nhật phiên bản mới thế nào? · Chi phí sử dụng? (trả lời: liên hệ để nhận báo giá theo quy mô đơn
   vị).
9. **CTA cuối**: "Sẵn sàng thử DocOps cho đơn vị của bạn?" + nút "Tải DocOps" và "Liên hệ".
10. **Footer**: logo và tagline; cột Sản phẩm (Tải về, Cài đặt macOS, Cài đặt Windows, Quy trình);
    cột Tin cậy (Minh bạch AI, Chính sách bảo mật); cột Công ty (Agentra JSC → `https://agentra.io.vn`,
    Liên hệ, email); dòng cuối "© 2026 Agentra JSC · Đà Nẵng, Việt Nam" và chuyển ngôn ngữ.

### 6.2 Tải về (`/download`)

- Tiêu đề "Tải DocOps cho máy tính của bạn", phụ đề nêu phiên bản mới nhất và ngày phát hành.
- Ba `PlatformCard`, thẻ khớp hệ điều hành nhận được xếp đầu và được đánh dấu "Máy bạn đang dùng".
  Mỗi thẻ: tên nền tảng, tên tệp, phiên bản, dung lượng (MB, một chữ số thập phân), ngày phát hành,
  nút "Tải về" (link thẳng tới VPS, `download` attribute, gửi sự kiện), link hướng dẫn tương ứng,
  `ChecksumField` SHA-512 thu gọn với nút sao chép.
- macOS: ghi chú "Không chắc máy dùng chip gì? Bấm  → Giới thiệu về máy Mac này, đọc dòng Chip:
  Apple M-series chọn Apple Silicon, Intel chọn Intel".
- Yêu cầu hệ thống: Windows 10/11 64-bit; macOS 13 Ventura trở lên (Apple Silicon hoặc Intel);
  khoảng 1 GB dung lượng trống; kết nối Internet để kích hoạt và cho các bước AI.
- Lưu ý bản chưa ký số: Windows SmartScreen và macOS Gatekeeper sẽ cảnh báo, link tới hướng dẫn.
- "Đã cài rồi? Bản mới tự cập nhật trong app: Cài đặt → Phiên bản → Kiểm tra cập nhật".
- Khi dữ liệu đến từ snapshot (feed lỗi), giao diện không đổi; chỉ ghi log máy chủ.

### 6.3 Hướng dẫn cài đặt (`/install/macos`, `/install/windows`)

Chuyển thể từ hai tài liệu tester, bỏ mọi "Ghi chú cho nội bộ" và tham chiếu tệp nội bộ, đổi
"người gửi" thành "Agentra". Bố cục: tiêu đề, ngày cập nhật, mục lục nổi (desktop), các bước đánh
số bằng `Steps`/`Step`, khối `Callout` (kiểu `note`, `warning`), khối lệnh sao chép được.

macOS: 1) Chọn đúng tệp theo chip (bảng) · 2) Cài đặt (kéo vào Applications) · 3) Lần mở đầu: mục
3a cho macOS 15 và 26 ("Vẫn mở" trong Quyền riêng tư & Bảo mật), mục 3b cho macOS 13 và 14 (chuột
phải → Mở) · 4) Nếu báo "bị hỏng": lệnh `xattr -dr com.apple.quarantine /Applications/DocOps.app`
· 5) Kích hoạt bằng key `DOCOPS-XXXX-XXXX-XXXX` · 6) Cập nhật bản mới trong app · 7) Báo lỗi.

Windows: 1) Tải tệp `DocOps Setup <phiên bản>.exe` · 2) SmartScreen: "More info" → "Run anyway"
· 3) Trình cài · 4) Mở và kích hoạt · 5) Cập nhật bản mới · 6) Lỗi khác (antivirus).

Cuối mỗi trang: nút tải đúng nền tảng và link sang hướng dẫn kia. JSON-LD `HowTo`.

### 6.4 Quy trình (`/how-it-works`)

Tiêu đề "Văn bản được xử lý bởi các luồng AI. Cán bộ là người quyết định cuối cùng." Sáu bước với
mô tả (như trang cũ), ba luồng công việc (Nhập → Hồ sơ số hoá; Hỏi → Trả lời có căn cứ; Thay đổi →
Tác động + Nháp), mục "Độ tin cậy nội dung" (trích dẫn bắt buộc; nội dung AI tự sinh phải duyệt;
dữ liệu theo đơn vị; vì sao có bước con người). CTA tải về.

### 6.5 Minh bạch AI (`/ai-transparency`)

Tiêu đề "Minh bạch AI và dữ liệu". Mười mục như trang cũ: dùng AI ở đâu (Claude của Anthropic cho
OCR, nhận dạng dấu/chữ ký, bóc metadata, phân loại, soạn nháp); con người quyết; trích dẫn và chặn
suy diễn; bảo mật dữ liệu (văn bản gốc ở máy người dùng, truy cập bằng key theo đơn vị); tri thức
thể chế thuộc về trường, xuất được; tuân thủ Nghị định 30/2020 và Nghị định 13/2023; quyền sở hữu
nội dung, không huấn luyện trên dữ liệu của trường; giới hạn trách nhiệm; cập nhật chính sách; liên
hệ. Mục 4 sửa cho đúng sản phẩm desktop (không còn "bản web").

### 6.6 Liên hệ (`/contact`)

- Ba thẻ: Email `info@agentra.io.vn` (mailto + sao chép); Điện thoại/Zalo (ẩn khi `lib/site.ts`
  chưa có giá trị); Địa chỉ "Agentra JSC · Đà Nẵng, Việt Nam" với link "Mở Google Maps" (tìm theo
  tên, không cần API key).
- Khối `#nhan-key` "Cách nhận key kích hoạt": 1) Tải và cài DocOps · 2) Ở màn Kích hoạt chọn "Chưa
  có key (đăng ký mới)", điền tên đơn vị và liên hệ, gửi ngay trong app · 3) Agentra xét duyệt và
  gửi key qua email. Dòng phụ "Hoặc email cho chúng tôi kèm tên đơn vị và nhu cầu".
- Khối "Báo lỗi và góp ý": chụp màn hình, ghi bước đang làm và thông báo lỗi, phiên bản hệ điều
  hành; gửi email hoặc dùng mục Phản hồi trong app.
- JSON-LD `Organization` có `contactPoint`.

### 6.7 Chính sách bảo mật (`/privacy`)

MDX theo ngôn ngữ: phạm vi (trang web này), dữ liệu thu thập (không có dữ liệu cá nhân nhập vào;
số liệu truy cập ẩn danh của Vercel Analytics; GA4 chỉ khi đồng ý cookie), cookie và cách rút lại
đồng ý (xoá lựa chọn ở thanh cookie hoặc dữ liệu trình duyệt), liên kết ngoài (VPS tải bộ cài),
dữ liệu trong ứng dụng DocOps (dẫn sang Minh bạch AI), quyền của người dùng theo Nghị định
13/2023, liên hệ, ngày cập nhật. PO rà soát pháp lý trước khi công bố.

### 6.8 404 và lỗi

`not-found` theo ngôn ngữ: "Không tìm thấy trang" + nút về trang chủ và Tải về. `error.tsx` (client)
có nút "Thử lại". Đường dẫn lạ không có tiền tố `/en` (vd. `/foo`) được coi là tiếng Việt và rơi
vào trang 404 tiếng Việt qua `[locale]/[...rest]`.

## 7. Dữ liệu phát hành (feed)

### 7.1 Nguồn

`DOWNLOAD_FEED_URL` (mặc định `https://download-docsopapp.agentra.io.vn/desktop/`). Hai tệp:

- `latest.yml` (Windows): `version`, `path` (vd. `DocOps Setup 1.0.0.exe`), `sha512`,
  `releaseDate`, `files[].size`.
- `latest-mac.yml` (macOS): `version`, `releaseDate`, `files[]` gồm `url`, `sha512`, `size` cho
  `.zip` và `.dmg` hai kiến trúc.

### 7.2 Kiểu dữ liệu

```ts
type Platform = 'windows-x64' | 'macos-arm64' | 'macos-x64'
interface ReleaseAsset {
  platform: Platform; version: string; fileName: string; url: string
  sizeBytes: number; sha512: string; releaseDate: string // ISO 8601
}
interface ReleaseInfo { assets: ReleaseAsset[]; source: { windows: 'feed'|'snapshot'; mac: 'feed'|'snapshot' } }
```

### 7.3 Quy tắc gán nền tảng (`lib/releases/parse.ts`, hàm thuần)

- `windows-x64` ← `latest.yml`: `path` kết thúc `.exe`.
- `macos-arm64` ← `latest-mac.yml` `files[]` có `url` kết thúc `-arm64.dmg`.
- `macos-x64` ← `files[]` có `url` kết thúc `.dmg` và không chứa `arm64`.
- Bỏ `.zip`, `.blockmap`. Thiếu mục nào thì trả về danh sách thiếu mục đó (UI ẩn thẻ), không ném lỗi.
- `url` = `DOWNLOAD_FEED_URL` + `encodeURIComponent(fileName)` (tên tệp Windows có dấu cách).

### 7.4 Tải và dự phòng (`lib/releases/feed.ts`)

- Tải hai tệp song song, `fetch(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 600 } })`.
- Mỗi tệp: HTTP không 2xx, hết giờ, hoặc YAML không parse được → dùng phần tương ứng trong
  `content/releases.json`, ghi `console.error` một dòng có nhãn cố định (log Vercel).
- `content/releases.json` = `{ "windows": <latest.yml đã parse>, "mac": <latest-mac.yml đã parse> }`
  để đi qua cùng một hàm parse. Snapshot khởi tạo từ thư mục `release/` hiện tại (v1.0.0).
- Cùng dữ liệu dùng cho trang chủ, trang Tải về, hai trang cài đặt, JSON-LD và sitemap
  (`lastModified` của trang Tải về = `releaseDate` mới nhất); gọi qua `React.cache` để mỗi lần
  render chỉ tải một lần.

### 7.5 Script `pnpm sync-releases`

`scripts/sync-releases.ts [--from <url|thư mục>]`: đọc `latest.yml` và `latest-mac.yml` từ URL feed
(mặc định) hoặc thư mục `release/` cục bộ, ghi `content/releases.json`. Dùng khi phát hành bản mới để
snapshot không cũ; không bắt buộc vì trang tự đọc feed.

## 8. Thiết kế hình ảnh

### 8.1 Token

Lấy nguyên từ sản phẩm (`tokens.css`), khai trong Tailwind 4 `@theme`:

```
--page #f9f9f7   --card #fcfcfb   --card2 #ffffff   --ink #0b0b0b   --ink2 #52514e
--muted #898781  --line #e1e0d9
--brand-light #8cbf3c  --brand #6a9c39                     (nhận diện, logo, gradient)
--accent #567f2e  --accent-strong #3e6b1f  --accent-soft #eff5e3   (nút chính, hover, nền nhấn)
--good #0ca30c  --warn-dot #fab219  --crit #d03b3b          (huy hiệu trạng thái)
--r 10px (card)  --r-control 8px (nút)  --r-modal 14px
```

Một token mới duy nhất cho marketing: `--brand-deep #1e3413` (nền footer, khối CTA cuối, ảnh OG).
Nút chính dùng `--accent` (tương phản 4,7:1 với chữ trắng), không dùng `--brand`.

### 8.2 Chữ

Be Vietnam Pro qua `next/font/google`, subsets `latin` + `vietnamese`, weight 400/500/600/700,
`display: swap`, biến `--font-sans`. Mono: hệ thống. Thang: H1 44–52px desktop / 32px mobile;
H2 32/26; H3 20; thân 16–17px, dòng 1,5–1,6; eyebrow 13px viết hoa, tracking 0,5px.

### 8.3 Bố cục và thành phần

- Container 1200px, lưới 12 cột, gutter 24px; section padding 96px desktop / 64px mobile; mobile
  gutter 16px, không cuộn ngang.
- Sáng, nhiều khoảng trắng, nền `--page`, thẻ `--card` viền `--line`, bóng nhẹ. Nhấn xanh có
  chừng mực: nút chính, eyebrow, icon, gradient nhẹ ở hero.
- Icon SVG nét 1,6px trên lưới 24px, không emoji (đồng bộ quy ước sản phẩm).
- Ảnh sản phẩm: chụp từ artboard `docs/thiet-ke/*.dc.html` của repo ứng dụng (Rà soát, Tra cứu,
  Soạn thảo, Đồ thị, Hiện đại · Hội thoại) bằng Playwright ở 2x, xuất WebP ≤ 200 KB vào
  `public/images/product/`, commit vào repo; script chụp giữ trong `scripts/` để làm lại khi app
  đổi giao diện. Nếu artboard không render độc lập được, chụp app thật bằng script `screens` của
  gói desktop với kho demo. Hiển thị trong khung cửa sổ (thanh tiêu đề giả, bóng đổ).
- Chuyển động: chỉ fade/translate nhỏ khi vào viewport; tôn trọng `prefers-reduced-motion`.
- Truy cập: skip link, focus ring rõ, `aria-current` cho menu, hit target ≥ 44px trên mobile,
  tương phản chữ ≥ 4,5:1.

### 8.4 Canvas thiết kế

Dựng bằng skill `design` trước khi code, PO chỉnh trực tiếp trên canvas. Artboard: Trang chủ
desktop 1440 (VI) · Trang chủ mobile 390 (VI) · Home desktop (EN) · Tải về (VI) · Hướng dẫn cài
macOS (VI) · Liên hệ (VI) · Quy trình (VI). Canvas là chuẩn hình ảnh; code bám theo canvas đã duyệt.

## 9. SEO

- `generateMetadata` mỗi trang, mỗi ngôn ngữ: `title` (template `%s · Agentra DocOps`; trang chủ
  "Agentra DocOps · Phần mềm AI xử lý văn bản hành chính trường đại học"), `description` 140–160 ký
  tự, `alternates.canonical`, `alternates.languages` (`vi`, `en`, `x-default` = vi), `openGraph`
  (`locale` `vi_VN`/`en_US`, `siteName`, ảnh 1200×630), `twitter` card `summary_large_image`,
  `robots` index/follow. `metadataBase` = `NEXT_PUBLIC_SITE_URL`.
- `sitemap.ts`: mọi trang × 2 ngôn ngữ, `alternates.languages`, `lastModified` (trang Tải về lấy
  `releaseDate` từ feed lúc build; các trang khác lấy ngày build). `robots.ts`: cho phép tất cả, khai sitemap. `manifest.ts`: tên, màu, icon.
- JSON-LD (`lib/seo/jsonld.ts`, chèn `<script type="application/ld+json">` ở Server Component):
  `Organization` (Agentra JSC, logo, url `https://agentra.io.vn`, email, `areaServed` VN) ở mọi
  trang; `SoftwareApplication` (DocOps, `operatingSystem` "Windows 10+, macOS 13+",
  `applicationCategory` BusinessApplication, `softwareVersion` từ feed, `downloadUrl`,
  `publisher`) ở trang chủ và Tải về; `FAQPage` trang chủ; `BreadcrumbList` trang con; `HowTo` hai
  trang cài đặt.
- Ảnh OG: `app/[locale]/opengraph-image.tsx` bằng `next/og` (font Be Vietnam Pro TTF trong
  `assets/fonts/`), nền `--brand-deep`, logo, tiêu đề theo ngôn ngữ; trang Tải về có ảnh riêng ghi
  phiên bản.
- Redirect 301 trong `next.config.ts`: `/xin-key` → `/lien-he`; `/login` → `/`.
- Xác minh Search Console qua `verification.google` từ `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- Hiệu năng: HTML tĩnh; font tự host; `next/image` với `sizes`, ảnh hero `priority`; không script
  bên thứ ba ngoài GA4 (sau đồng ý) và Vercel; JS client tối thiểu. Mục tiêu Lighthouse mobile:
  Performance ≥ 90, SEO 100, Accessibility ≥ 95, Best Practices ≥ 95.

## 10. Analytics và đồng ý cookie

- `<Analytics />` và `<SpeedInsights />` trong `[locale]/layout.tsx`, luôn bật (không cookie).
- GA4: `<GoogleAnalytics gaId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />` chỉ render trong Client
  Component `AnalyticsGate` khi đồng ý = `granted`; thiếu biến môi trường thì không render.
- `lib/analytics.ts` xuất `track(event, props)`: gọi `sendGAEvent` (nếu GA đã nạp) và `track` của
  `@vercel/analytics`. Sự kiện có kiểu đóng:

| Sự kiện | Thuộc tính | Nơi phát |
|---|---|---|
| `download_click` | `platform`, `version`, `location` (`hero`/`home_block`/`download_page`/`guide`) | mọi nút tải |
| `cta_click` | `id`, `location` | nút chính/phụ không phải tải |
| `contact_click` | `channel` (`email`/`phone`/`zalo`/`maps`) | trang Liên hệ, footer |
| `locale_switch` | `from`, `to` | LocaleSwitcher |
| `faq_open` | `id` | FAQ trang chủ |
| `consent_change` | `value` | ConsentBar |

  Sự kiện tuỳ chỉnh của Vercel cần gói Pro; ở gói Hobby chúng bị bỏ qua, không lỗi.
- `ConsentBar`: thanh đáy trang, văn bản ngắn theo ngôn ngữ + link Chính sách bảo mật, hai nút
  "Đồng ý" / "Từ chối". Lưu `localStorage` khoá `docops.consent` = `{ value, at }` trong
  `try/catch`; chưa chọn thì hiện thanh và không nạp GA4. Tắt toàn bộ bằng
  `NEXT_PUBLIC_CONSENT_BANNER=off` (khi đó GA4 nạp ngay). Không chặn tương tác trang.

## 11. Cấu hình và biến môi trường

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | có | `https://docops.agentra.io.vn`; `metadataBase`, sitemap, canonical |
| `DOWNLOAD_FEED_URL` | không | mặc định URL VPS ở §7.1 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | không | `G-XXXX`; thiếu thì không có GA4 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | không | meta xác minh Search Console |
| `NEXT_PUBLIC_CONSENT_BANNER` | không | `off` để tắt thanh cookie |

Thông tin công ty (tên, email, địa chỉ, điện thoại/Zalo để trống, URL agentra.io.vn) tập trung ở
`lib/site.ts`; `.env.example` liệt kê đủ biến.

## 12. Xử lý lỗi

- Feed: lỗi từng tệp → snapshot cho tệp đó (§7.4); cả hai lỗi → toàn bộ snapshot; snapshot cũng
  hỏng (không thể vì được test) → build fail.
- Link tải trỏ thẳng VPS; nếu VPS thiếu tệp thì người dùng gặp 404 ở VPS: trang Tải về có dòng
  "Không tải được? Liên hệ info@agentra.io.vn" để không cụt đường.
- Locale hoặc `os` lạ → `notFound()`. MDX lỗi cú pháp → build fail. `localStorage` bị chặn →
  ConsentBar vẫn hoạt động trong phiên, không ném lỗi.
- Không có Route Handler nào; không có input người dùng gửi lên máy chủ.

## 13. Kiểm thử và chất lượng

- Vitest (`tests/unit/`): parse feed với fixture là bản sao `latest.yml` và `latest-mac.yml` thật
  (đủ 3 nền tảng, bỏ zip/blockmap, mã hoá URL dấu cách, size và sha512 đúng); thiếu mục → danh
  sách thiếu; feed lỗi → snapshot theo từng tệp; `vi.json` và `en.json` cùng tập khoá; `pathnames`
  phủ đủ mọi trang; JSON-LD hợp lệ về hình dạng; `detectPlatform` với các UA mẫu; định dạng dung
  lượng và ngày theo locale.
- Playwright (`tests/e2e/`, chạy trên `next build && next start`): mỗi trang × 2 ngôn ngữ trả
  200, đúng `<html lang>`, một H1, canonical và đủ hreflang, `<script type="application/ld+json">`
  parse được; trang Tải về hiện 3 link `.exe`/`.dmg` đúng host; chuyển ngôn ngữ giữ đúng trang;
  ConsentBar: chưa chọn → không có request `googletagmanager.com`, bấm Đồng ý → có; redirect
  `/xin-key` → `/lien-he`; menu mobile ở 390px; không lỗi console.
- Lighthouse CI (`lighthouserc.json`, preset mobile) trên trang chủ, Tải về, một trang cài đặt,
  cả 2 ngôn ngữ; ngưỡng §9.
- GitHub Actions `ci.yml`: typecheck, lint, unit, build, e2e, lhci trên mỗi PR và push `main`.
- Chất lượng mã: ESLint (`eslint-config-next`), Prettier, TypeScript strict, `pnpm verify` gom
  typecheck + lint + test.

## 14. Triển khai và vận hành

- Vercel Git integration: push `main` → production, PR → preview. Framework Next.js, Node 24,
  region hàm `sin1` (Singapore, đặt trong Project Settings → Functions) để tái tạo ISR gần người
  dùng. Không cần `vercel.json`.
- Header bảo mật qua `next.config.ts` `headers()`: `Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` tắt camera/micro/geolocation, `X-Frame-Options: DENY`.
- Chuyển domain (PO thực hiện, checklist trong README): 1) deploy preview, kiểm tra cả 2 ngôn
  ngữ, Search Console URL Inspection; 2) thêm domain `docops.agentra.io.vn` vào project Vercel;
  3) đổi bản ghi DNS từ VPS sang Vercel; 4) xác nhận HTTPS, sitemap, redirect `/xin-key`; 5) gửi
  sitemap mới trong Search Console.
- Quy trình phát hành desktop → web: upload tệp bộ cài và `.yml` lên VPS (tệp `.yml` sau cùng) như
  quy trình hiện có; trang Tải về cập nhật trong ≤ 10 phút; tuỳ chọn chạy `pnpm sync-releases` và
  commit để snapshot theo kịp.
- README: cách chạy, cấu trúc, cách sửa nội dung (messages, MDX, `lib/site.ts`), biến môi trường,
  quy trình phát hành, checklist chuyển domain.

## 15. Giả định và câu hỏi mở

- Yêu cầu hệ thống (Windows 10/11 64-bit, macOS 13+, ~1 GB) suy từ cấu hình build và hướng dẫn
  tester; PO xác nhận khi review.
- Câu FAQ về chi phí trả lời "liên hệ báo giá", không công bố đơn giá.
- Bản tiếng Anh do đội dev biên dịch; PO rà soát thuật ngữ (ví dụ "Nghị định 30/2020" giữ
  nguyên kèm chú giải "Decree 30/2020 on clerical work").
- Feed VPS hiện trống (404); site chạy bằng snapshot v1.0.0 cho tới khi bộ cài được upload.
- Điện thoại/Zalo: để trống trong `lib/site.ts`, thẻ tương ứng tự ẩn.
