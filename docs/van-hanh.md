# Vận hành landing page DocOps

## 1. Phát hành bản desktop mới → trang Tải về tự cập nhật

Trang Tải về đọc `latest.yml` (Windows) và `latest-mac.yml` (macOS) từ `DOWNLOAD_FEED_URL`
(mặc định `https://download-docsopapp.agentra.io.vn/desktop/`), cache 10 phút. Không cần deploy lại site.

1. Build bản desktop như quy trình của `docops-application` (`.github/workflows/release.yml`).
2. Upload lên VPS đúng thứ tự quy trình hiện có (`deploy/README.md` của repo ứng dụng): tệp `.exe`, `.dmg`, `.zip`,
   `.blockmap` trước, **hai tệp `.yml` sau cùng**.
3. Trong tối đa 10 phút, trang Tải về và khối tải trên trang chủ hiện phiên bản, dung lượng, ngày mới; SHA-512 nằm sau dòng gập "Kiểm tra toàn vẹn tệp" trên trang Tải về.
4. Tuỳ chọn, để snapshot dự phòng không cũ: `pnpm sync-releases` (đọc từ feed) hoặc
   `pnpm sync-releases --from ../docops-application/packages/desktop/release`, rồi commit `content/releases.json`.

Tên tệp phải giữ mẫu hiện tại: `DocOps Setup <v>.exe`, `DocOps-<v>-arm64.dmg` (Apple Silicon), `DocOps-<v>.dmg` (Intel).
Feed lỗi (404, hết giờ 5 s, YAML hỏng) thì site dùng snapshot và ghi log `release_feed_unavailable` trên Vercel.

## 2. Chuyển domain docops.agentra.io.vn sang Vercel

Site mới thay thế site cũ (web app). Các đường dẫn cũ `/xin-key` → `/lien-he`, `/login` → `/` đã có redirect 301.

1. Deploy preview trên Vercel, kiểm tra cả `/` và `/en`, trang Tải về tải được tệp, `/sitemap.xml`, `/robots.txt`.
2. Vercel → Project → Settings → Domains: thêm `docops.agentra.io.vn`; Vercel cho bản ghi cần đặt (CNAME
   `cname.vercel-dns.com` hoặc A `76.76.21.21`).
3. Đặt `NEXT_PUBLIC_SITE_URL=https://docops.agentra.io.vn` (Production) và redeploy.
4. Đổi bản ghi DNS từ VPS sang Vercel; chờ HTTPS của Vercel cấp xong.
5. Kiểm tra sau chuyển: `curl -I https://docops.agentra.io.vn/xin-key` → 308 về `/lien-he`; trang chủ có
   `<link rel="canonical">` đúng domain.
6. Google Search Console: xác minh domain (đặt `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` rồi redeploy), gửi
   `https://docops.agentra.io.vn/sitemap.xml`.
7. Tắt vhost của site cũ trên VPS (giữ backend, admin, downloads).

## 3. Analytics

- Vercel Analytics và Speed Insights: bật trong dashboard project; dữ liệu hiện sau deploy kế tiếp.
- GA4: tạo property, lấy Measurement ID `G-XXXX`, đặt `NEXT_PUBLIC_GA_MEASUREMENT_ID` rồi redeploy. Sự kiện tuỳ chỉnh:
  `download_click` (platform, version, location), `cta_click`, `contact_click` (channel), `locale_switch`, `faq_open`,
  `consent_change`. GA4 chỉ nạp sau khi người dùng bấm Đồng ý ở thanh cookie (tắt thanh bằng
  `NEXT_PUBLIC_CONSENT_BANNER=off`).
- Sự kiện tuỳ chỉnh của Vercel Analytics cần gói Pro; gói Hobby bỏ qua, không lỗi.

## 4. Nội dung cần PO điền

- `lib/site.ts`: `phone`, `zalo`, `address` (đang trống → thẻ Điện thoại/Zalo ẩn, địa chỉ chỉ hiện "Đà Nẵng, Việt Nam").
- Ngày cập nhật hướng dẫn cài đặt (`meta.updated` trong MDX) khi có bản mới thay đổi cách cài.
