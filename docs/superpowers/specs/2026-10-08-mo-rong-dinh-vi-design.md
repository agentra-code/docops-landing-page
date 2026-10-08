# Thiết kế: Mở rộng định vị ra cơ quan, doanh nghiệp, tổ chức + 3 trang kiến thức văn thư

Ngày: 08/10/2026 · Trạng thái: chờ PO duyệt · Repo: `docops-landing-page`

## 1. Mục tiêu

Trang web hiện chỉ nói với trường đại học. PO muốn DocOps được tìm thấy và hiểu đúng bởi cả cơ quan, doanh nghiệp,
đoàn thể và tổ chức nói chung, mà **giáo dục vẫn là đối tượng chính** của trang chủ. Đồng thời thêm ba trang kiến thức
văn thư để lấy lượt tìm kiếm thông tin (loại văn bản, thể thức, so sánh với ChatGPT) và dẫn về sản phẩm.

Thành công khi:

- Google và trợ lý AI mô tả DocOps là "phần mềm AI cho văn bản hành chính trường đại học, cơ quan, doanh nghiệp".
- Có một URL riêng cho mỗi từ khoá mới (mục 4), không URL nào tranh từ khoá của URL khác.
- Mọi câu trên trang đúng với app v1.2.1 (mục 3) và với văn bản gốc Nghị định 30/2020/NĐ-CP.
- Audit SEO trên bản build production: 0 lỗi, sitemap 32 URL = 32 trang index được, tự canonical.

## 2. Quyết định của PO (08/10/2026)

| Câu hỏi | Chốt |
|---|---|
| Trang chủ nói với ai trước | Giáo dục vẫn là chính; nhắc thêm cơ quan, doanh nghiệp |
| Số trang ngành mới | 1 trang chung cho cơ quan, doanh nghiệp, tổ chức (giữ trang trường đại học hiện có) |
| Cách sửa nội dung cũ | A: H1 trang chủ giữ "trường đại học"; câu mô tả thương hiệu và ba trang tính năng nói chung "đơn vị" |
| Trang kiến thức | Cả ba: 29 loại văn bản và chữ viết tắt; thể thức văn bản; DocOps và ChatGPT |
| Chứng từ | Không đưa lên web (app chưa hỗ trợ) |
| Search Console, Bing | Đã đăng ký cả hai |

Cùng đợt (đã làm, độc lập với spec này): sửa menu mobile bị co về 49px do `backdrop-blur` trên header; thanh cookie
nằm dưới menu; câu cookie mới "Agentra DocOps dùng cookie Google Analytics để hiểu cán bộ cần gì và làm trang hữu ích
hơn. Từ chối thì trang vẫn hoạt động đầy đủ."

## 3. Sự thật từ app (`../docops-application`, v1.2.1) giới hạn nội dung

Đúng cho mọi đơn vị, được nói:

- Phân loại và soạn thảo đủ 29 loại văn bản hành chính Điều 7 NĐ 30 (`packages/contracts/src/docTypes.ts:107-137`),
  gồm thông báo, quyết định, chỉ thị, công văn, tờ trình, kế hoạch, báo cáo, biên bản, hợp đồng.
- Thông tin đơn vị chung cho mọi cơ quan: cơ quan chủ quản, cơ quan ban hành, địa danh, quyền hạn ký, chức vụ, họ tên
  (`main/unitInfo.ts:7-14`). Key không giới hạn loại đơn vị (`backend/.../001_khoi_tao.sql:6-22`).
- Luật, nghị định, thông tư không phải "loại văn bản" (xếp `khác`) nhưng được theo dõi làm căn cứ: quan hệ căn cứ,
  hướng dẫn, sửa đổi, thay thế, bãi bỏ theo số hiệu (`s09.md:49-59`), cảnh báo hiệu lực tại một ngày.
- Kiểm tra thể thức 9 thành phần (`packages/contracts/src/s12.ts:12-22`): quốc hiệu, tiêu ngữ, tên cơ quan, số hiệu,
  địa danh và ngày, tên loại và trích yếu, nơi nhận, chữ ký, dấu.
- Hỏi đáp chỉ từ kho, câu trích ngoài kho bị loại và hiện "AI nhắc tới văn bản không có trong kho", thiếu thì "Chưa tìm
  thấy trong kho" (`main/chat.ts:496-527`). Mô hình mặc định Claude, GLM tuỳ chọn; nội dung đi qua máy chủ DocOps tới
  nhà cung cấp AI, máy chủ không lưu nội dung (`001_khoi_tao.sql:79-84`).

Không được nói:

- **Chứng từ** (hoá đơn, phiếu thu, phiếu chi): không có trong app. Lưu ý `PC` trong app là Phiếu chuyển.
- **Văn bản Đảng, Đoàn** có thể thức riêng (Hướng dẫn 36-HD/VPTW): không hỗ trợ; quốc hiệu gắn cứng
  (`docFormat.ts:72`), văn bản không có quốc hiệu bị chấm "không đạt". Trang tổ chức phải ghi rõ DocOps theo NĐ 30.
- **Quản lý văn bản đi/đến, trình ký, luồng xử lý**: DocOps không phải e-Office. Định vị: chạy song song, làm phần
  đọc, tra cứu, rà soát, soạn nháp.
- **"Bốn lớp nghiệp vụ", thẻ "Việc theo đơn vị"**: app không bóc nghĩa vụ ở luồng thật (bảng `obligation` chỉ do bộ
  dữ liệu mẫu ghi, `packages/data/src/loadDataJs.ts:81`). Chỉ có ba lớp: con số chốt, cổng chặn, ngưỡng học vụ; lớp
  ngưỡng học vụ chỉ có nghĩa với trường học.

Ngoài repo này, báo team app: placeholder "HIỆU TRƯỞNG", "12/ĐHSP-ĐT", ví dụ ý chính về sinh viên, bảng "Ngưỡng học vụ",
dữ liệu mẫu của một trường vẫn hiện với doanh nghiệp dùng thử.

## 4. Thương hiệu và bản đồ từ khoá (`lib/seo/brand.ts`)

Câu mô tả chuẩn mới (dùng nguyên văn cho meta trang chủ, JSON-LD WebSite và SoftwareApplication, llms.txt, hồ sơ ngoài):

- vi (158 ký tự): "Agentra DocOps là phần mềm AI cho văn bản hành chính trường đại học, cơ quan, doanh nghiệp: tra cứu có trích
  dẫn, rà soát căn cứ, soạn nháp theo Nghị định 30."
- en (153 ký tự): "Agentra DocOps is AI software for administrative documents at universities, agencies and companies: cited
  search, legal basis checks, Decree 30 drafting."

`category` giữ nguyên (giáo dục là chính). `audience` thêm "văn thư, hành chính, pháp chế ở cơ quan, doanh nghiệp, tổ
chức". `keywords` thêm "phần mềm AI văn bản hành chính cho doanh nghiệp". `disambiguation` và `organization` giữ nguyên.

Bản đồ từ khoá, bốn dòng mới (khoá route = id chủ đề = slug en, theo quy ước của repo; ↔ slug vi):

| Khoá | vi | en | Từ khoá chính (phụ) |
|---|---|---|---|
| `/ai-for-organizations` | `/ai-van-ban-co-quan-doanh-nghiep` | `/ai-for-organizations` | phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp (AI cho văn thư doanh nghiệp, đoàn thể, tổ chức) |
| `/administrative-document-types` | `/cac-loai-van-ban-hanh-chinh` | `/administrative-document-types` | các loại văn bản hành chính (29 loại văn bản theo Nghị định 30, chữ viết tắt tên loại văn bản) |
| `/administrative-document-format` | `/the-thuc-van-ban-hanh-chinh` | `/administrative-document-format` | thể thức văn bản hành chính (cách trình bày văn bản theo Nghị định 30, kiểm tra thể thức văn bản) |
| `/docops-vs-chatgpt` | `/docops-va-chatgpt` | `/docops-vs-chatgpt` | dùng ChatGPT cho văn bản hành chính (DocOps và ChatGPT) |

Trang soạn thảo NĐ 30 bỏ "thể thức văn bản hành chính" và "kiểm tra thể thức văn bản" khỏi `keywords`, mục "Kiểm tra
thể thức văn bản đến" của nó dẫn sang trang thể thức. Anchor text tới mỗi trang = `name` của trang đó.

## 5. Nội dung bốn trang mới

Cả bốn dùng khuôn `TopicCopy` (định nghĩa, bảng, khối, hỏi đáp, ảnh chia sẻ), đủ vi và en, `metaTitle` ≤ 43 ký tự,
`description` 110–160 ký tự. Mỗi số liệu, điều khoản được đối chiếu với nguồn gốc lúc viết và trang ghi nguồn.

**Cơ quan, doanh nghiệp, tổ chức** (nhóm "Theo loại đơn vị", ảnh `dothi.webp`)

- Định nghĩa: DocOps cho văn thư, hành chính, pháp chế của đơn vị trình bày văn bản theo NĐ 30.
- Ai dùng được: cơ quan nhà nước, doanh nghiệp (kể cả doanh nghiệp nhà nước), đoàn thể, hội, hiệp hội áp dụng thể thức
  NĐ 30 (Điều 2 NĐ 30 về đối tượng áp dụng).
- Làm được gì: nạp PDF kể cả bản quét; 29 loại văn bản; theo dõi luật, nghị định, thông tư làm căn cứ; rà soát hiệu lực;
  tra cứu có trích dẫn; soạn nháp, xuất Word và PDF; kho riêng tại máy, mỗi đơn vị một key.
- Bảng: việc thường ngày của văn thư ↔ làm tay ↔ DocOps.
- Chạy cùng e-Office: DocOps không thay hệ thống văn bản đi/đến, trình ký.
- Giới hạn nói thẳng: văn bản Đảng, Đoàn có thể thức riêng chưa hỗ trợ; chỉ nạp PDF.
- Hỏi đáp: dùng cho doanh nghiệp tư nhân được không; có thay e-Office không; dữ liệu nằm ở đâu; văn bản Đảng.

**Các loại văn bản hành chính** (nhóm "Kiến thức văn thư", ảnh `soanthao.webp`)

- Định nghĩa: Điều 7 NĐ 30 quy định 29 loại văn bản hành chính.
- Bảng 29 dòng: tên loại, chữ viết tắt theo Phụ lục III NĐ 30, dùng khi nào (một câu). Công văn và thư công không có chữ
  viết tắt tên loại. Thêm bản sao: SY, SL, TS.
- Khối: các cặp hay nhầm QĐ/QyĐ, ĐA/DA, HD/HĐ; cách ghép ký hiệu văn bản (ví dụ `12/QĐ-<viết tắt cơ quan>`).
- Dẫn sang trang soạn thảo NĐ 30 và trang thể thức.

**Thể thức văn bản hành chính** (nhóm "Kiến thức văn thư", ảnh `soanthao.webp`)

- Định nghĩa: thể thức gồm các thành phần chính theo Điều 8 NĐ 30.
- Khối có thứ tự: 9 thành phần chính, mỗi thành phần một câu cách trình bày; thành phần bổ sung (phụ lục, dấu mật, khẩn,
  ký hiệu người soạn thảo, số lượng bản).
- Bảng kỹ thuật trình bày theo Phụ lục I: khổ giấy, phông, cỡ chữ, lề trên, dưới, trái, phải.
- Checklist trước khi trình ký; dẫn sang tính năng kiểm tra thể thức (trên trang soạn thảo) và trang 29 loại văn bản.

**DocOps và ChatGPT** (nhóm "Kiến thức văn thư", ảnh `tracuu.webp`)

- Ghi ngày đối chiếu. Giọng công bằng, không chê.
- Bảng: nguồn câu trả lời (kho đơn vị ↔ kiến thức chung, tệp tải lên); trích dẫn số hiệu, Điều; khi không có trong kho;
  rà soát hiệu lực căn cứ; soạn đúng thể thức 29 loại, xuất Word; dữ liệu đi đâu; giá và cài đặt.
- Khối "Khi nào ChatGPT hợp hơn": viết chung, kiến thức rộng, không cần kho riêng.
- Nói rõ: DocOps cũng gửi nội dung tới mô hình AI (Claude mặc định) qua máy chủ DocOps; máy chủ không lưu nội dung.
- Thông tin về ChatGPT (tính năng, chính sách dữ liệu) lấy từ trang chính thức của OpenAI tại ngày viết, có link.

## 6. Sửa nội dung hiện có

- Trang chủ: H1 và đoạn phụ hero giữ nguyên; tiêu đề và lead khối thẻ chủ đề nhắc "cơ quan, doanh nghiệp"; thêm một câu hỏi đáp "DocOps có dùng
  cho cơ quan, doanh nghiệp được không?" (vào cả FAQPage). Meta description = câu mô tả chuẩn mới.
- `messages/*.json`: tagline header và footer thêm "cơ quan, doanh nghiệp"; "Không huấn luyện trên dữ liệu của trường"
  → "của đơn vị"; `relatedH2`, tiêu đề hub nói chung "đơn vị".
- Ba trang tính năng (rà soát, soạn thảo, tra cứu): h1, lead, metaTitle, description đổi "của trường" → "của đơn vị";
  ví dụ giáo dục giữ khi minh hoạ, thêm ví dụ cơ quan ở chỗ hợp lý; `updated` = ngày sửa.
- Sửa claim: "bốn lớp nghiệp vụ" → ba lớp (con số chốt, cổng chặn, ngưỡng học vụ cho trường học); bỏ thẻ "Việc theo đơn
  vị" và "nghĩa vụ" khỏi mô tả bán kính ảnh hưởng (`content/topics/vi.ts:65,72,264` và bản en tương ứng,
  `messages/vi.json:302`).
- Trang trường đại học: giữ trọng tâm, chỉ sửa claim trên và thêm link sang trang cơ quan, doanh nghiệp.

## 7. Kỹ thuật

- `content/topics/index.ts`: thêm 4 id vào `TOPIC_IDS`; `TOPIC_META` thêm trường `group: 'feature' | 'audience' |
  'guide'` (feature: rà soát, soạn thảo, tra cứu; audience: trường đại học, cơ quan doanh nghiệp; guide: ba trang kiến
  thức). Nội dung vào `content/topics/vi.ts`, `en.ts`.
- `i18n/routing.ts`: 4 khoá pathnames mới. `app/[locale]/<khoá>/page.tsx` và `opengraph-image.tsx` mỏng như các trang
  chủ đề hiện có.
- `TopicHub`: hiển thị theo ba nhóm (nhãn nhóm là chữ thường, không phải heading; tên thẻ vẫn là h3), lưới 3 cột mỗi
  nhóm. Trang chủ và Quy trình hiện đủ ba nhóm; "Xem thêm" trên trang chủ đề hiện các trang còn lại, theo nhóm.
- Footer: cột chủ đề chia theo nhóm (nhãn không phải heading).
- Tự cập nhật từ `TOPIC_IDS`: sitemap (lastmod = `TOPIC_META.updated`), llms.txt, JSON-LD, footer, hub.
- `brand.ts`: câu mô tả, audience, keywords, bản đồ từ khoá (mục 4).

## 8. Kiểm chứng

- `pnpm verify` (typecheck, lint, unit): test độ dài metaTitle, description hiện có tự áp cho 4 trang mới; kiểu
  `Record<TopicId, …>` buộc mỗi trang có `group`.
- E2E `pages.spec.ts` có 4 trang mới × 2 ngôn ngữ trả 200, đúng h1; `mobile.spec.ts` giữ test menu.
- Build production (`VERCEL_ENV=production`) + `seo-audit.mjs --next-manifest`: 0 lỗi, sitemap 32 URL, mọi trang
  index được và tự canonical; giải thích từng cảnh báo.
- Chụp màn hình mobile và desktop trang chủ (khối thẻ ba nhóm) và một trang mới.
- Sau khi deploy: audit site live; URL Inspection và yêu cầu index 4 trang mới vi trong Search Console; Bing nhận qua
  sitemap.

## 9. Ngoài phạm vi

- Sửa app (placeholder, dữ liệu mẫu, lớp ngưỡng học vụ): báo team app.
- Hỗ trợ chứng từ, văn bản Đảng, Đoàn.
- Blog, RSS; trang so sánh với e-Office hay sản phẩm cụ thể khác.
- Đổi H1, `category` hoặc ảnh OG trang chủ.
