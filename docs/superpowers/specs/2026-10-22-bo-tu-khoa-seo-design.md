# Bộ từ khoá SEO 22/10: trang chủ chung, UBND xã, soạn theo từng loại văn bản

Ngày: 2026-10-22 · Người duyệt: PO

## Quyết định của PO (22/10)

| Câu hỏi | Chọn |
|---|---|
| Từ khoá chính của trang chủ | «phần mềm soạn thảo văn bản hành chính», bỏ «trường đại học» (thay quyết định 08/10 lấy giáo dục làm chính) |
| UBND xã, cơ quan nhà nước | Gộp vào `/ai-van-ban-co-quan-doanh-nghiep`, không mở trang mới, giữ nguyên URL |
| Báo giá | Không làm trang giá; xử lý trong FAQ và trang Liên hệ |
| Thư viện mẫu (nhóm 3) | Bỏ qua |
| Phần mềm kiểm tra thể thức, thẩm định | Bỏ |

## Bản đồ từ khoá mới

Mỗi URL một từ khoá chính, viết vào chú thích trong `lib/seo/brand.ts`.

| URL | Từ khoá chính → phụ |
|---|---|
| `/` | **phần mềm soạn thảo văn bản hành chính**, phần mềm tạo văn bản hành chính bằng AI, AI soạn thảo văn bản hành chính, ứng dụng AI cho cán bộ công chức |
| `/ai-van-ban-co-quan-doanh-nghiep` | **phần mềm AI cho cơ quan nhà nước, UBND xã**, phần mềm soạn thảo văn bản UBND xã, trợ lý AI cho cán bộ công chức, trợ lý AI hành chính công, AI cho văn thư doanh nghiệp |
| `/soan-thao-van-ban-nghi-dinh-30` | **soạn thảo văn bản theo Nghị định 30**, AI soạn công văn, AI viết tờ trình, AI viết báo cáo hành chính, AI viết biên bản cuộc họp |
| `/tra-cuu-van-ban-ai` | **tra cứu văn bản bằng AI**, AI tra cứu văn bản pháp luật (trong kho của đơn vị) |
| `/ra-soat-can-cu-phap-ly` | **rà soát căn cứ pháp lý**, công cụ tìm căn cứ pháp lý, kiểm tra căn cứ pháp lý trong công văn, tra cứu hiệu lực văn bản |
| `/chuyen-doi-so-van-thu-truong-dai-hoc` | giữ nguyên; nhận thêm «phần mềm AI văn bản hành chính trường đại học» mà trang chủ bỏ ra |

«AI soạn thảo văn bản hành chính» chuyển từ trang soạn thảo lên trang chủ, vì cùng ý định với «phần mềm soạn thảo văn bản hành chính». Trang soạn thảo nhắm các từ khoá theo loại văn bản.

## Thay đổi theo trang (vi, en làm tương ứng)

**Trang chủ và `brand.ts`**
- Tiêu đề: `Phần mềm soạn thảo văn bản hành chính AI · Agentra DocOps` (57 ký tự).
- H1: `{product}: phần mềm soạn thảo văn bản hành chính bằng AI`. Câu dưới H1 nêu tra cứu có trích dẫn, rà soát căn cứ và đối tượng: cơ quan nhà nước, UBND xã, trường đại học, doanh nghiệp.
- `brand.category`: «Phần mềm soạn thảo văn bản hành chính bằng AI».
- `brand.description` (câu chuẩn, 110–160 ký tự) đổi thành: «Agentra DocOps là phần mềm AI soạn thảo văn bản hành chính theo NĐ 30 cho cơ quan, UBND xã, trường đại học, doanh nghiệp; tra cứu có trích dẫn, rà soát căn cứ.» Sau khi lên web, **PO cập nhật câu này trên LinkedIn, Facebook và các hồ sơ ngoài**.
- `brand.keywords`, `brand.audience`: thêm cơ quan nhà nước, UBND xã, cán bộ công chức.
- FAQ «Chi phí sử dụng?» đổi thành «Báo giá DocOps thế nào?», giữ nội dung đúng sự thật: tải miễn phí, chi phí theo quy mô đơn vị, liên hệ nhận báo giá.
- FAQ «Dùng cho cơ quan, doanh nghiệp được không?» thêm UBND xã, phường.

**`/ai-van-ban-co-quan-doanh-nghiep`**
- Tiêu đề: `AI văn bản cho UBND, cơ quan, doanh nghiệp` (≤ 43 ký tự trước hậu tố).
- H1: `Phần mềm AI văn bản hành chính cho UBND xã, cơ quan nhà nước và doanh nghiệp`.
- Thêm phần mới «Cho UBND xã, phường và cán bộ công chức»:
  - soạn công văn, tờ trình, báo cáo, kế hoạch, biên bản theo Nghị định 30;
  - tra văn bản cấp trên mà xã đã nạp, câu trả lời có trích dẫn;
  - rà soát căn cứ đã bị thay thế;
  - mỗi xã một key và một kho riêng trên máy.
- Thêm 2 FAQ:
  - «UBND xã, phường dùng DocOps được không?»
  - «DocOps có phải phần mềm quản lý văn bản cấp xã không?» Trả lời: không phải, DocOps chạy cùng e-Office.

**`/soan-thao-van-ban-nghi-dinh-30`**
- Thêm phần «Soạn công văn, tờ trình, báo cáo, biên bản bằng AI»: mỗi loại một dòng, đúng khung trong app.
  - Công văn: trích yếu «V/v», không có tên loại.
  - Tờ trình: «Về việc», có «Kính gửi».
  - Biên bản: theo mẫu 1.9.
  - Báo cáo.
- Thêm FAQ «AI viết biên bản cuộc họp được không?».

**`/tra-cuu-van-ban-ai`**
- Thêm FAQ «DocOps tra cứu được mọi văn bản pháp luật Việt Nam không?» Trả lời: không, chỉ văn bản đơn vị đã nạp; nạp luật, nghị định, thông tư liên quan để tra và theo dõi hiệu lực.

**`/ra-soat-can-cu-phap-ly`**
- Thêm FAQ «Kiểm tra căn cứ pháp lý trong một công văn sắp ban hành thế nào?» Trả lời: mỗi dòng căn cứ trong bản nháp có nhãn hiệu lực.

## Từ khoá không đưa lên site (để dùng cho Google Ads hoặc khi app làm được)

| Từ khoá | Lý do |
|---|---|
| soạn công văn online, công cụ … online | DocOps là app desktop, không chạy trên web |
| phần mềm văn bản hành chính miễn phí | Chỉ miễn phí tải về, dùng phải có key |
| phần mềm quản lý văn bản cấp xã | Đây là e-Office (văn bản đi – đến); chỉ nhắc trong FAQ để nói rõ là không phải |
| AI hỏi đáp pháp luật Việt Nam | Không có cơ sở dữ liệu luật toàn quốc |
| báo giá…, so sánh phần mềm… | Chưa có giá công khai; so sánh với phần mềm trong nước cần số liệu đối thủ đã kiểm |
| nhóm kiểm tra thể thức, thẩm định; thư viện mẫu | PO bỏ / bỏ qua (22/10) |

## Kiểm chứng

- `pnpm test` (giới hạn độ dài tiêu đề và mô tả trong `tests/unit/content.test.ts`), `pnpm build`.
- Chạy `seo-audit.mjs` trên bản build production tại máy: 0 lỗi, số URL trong sitemap không đổi (không thêm trang).
- e2e trang chủ (đổi H1).
- Audit trang thật **sau khi** sự cố DNSSEC của `io.vn` được khắc phục (22/10, phía VNNIC).
