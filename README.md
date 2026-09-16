# Landing page Agentra DocOps

Trang marketing hai ngôn ngữ (vi mặc định, `/en`) cho **Agentra DocOps**, deploy trên Vercel. Trang Tải về tự cập nhật từ
feed phát hành của desktop app; hướng dẫn cài đặt viết bằng MDX; SEO đầy đủ; Vercel Analytics + Speed Insights và GA4 sau
khi người dùng đồng ý cookie. Không có form, không có Route Handler.

- Spec: `docs/superpowers/specs/2026-09-16-docops-landing-page-design.md`
- Kế hoạch: `docs/superpowers/plans/2026-09-16-docops-landing-page.md`
- Thiết kế (canvas Claude Design): https://claude.ai/artifact/68sTSFxNQdNhJG4T1iXgcu — nguồn ở `docs/thiet-ke/`
- Vận hành (phát hành bản desktop, chuyển domain): `docs/van-hanh.md`

## Chạy tại máy

```sh
pnpm install
cp .env.example .env.local       # điền NEXT_PUBLIC_SITE_URL, GA id nếu có
pnpm dev                          # http://localhost:3000
pnpm verify                       # typecheck (next typegen + tsc) + lint + unit test
pnpm build && pnpm start -p 3200  # bản production tại http://localhost:3200
pnpm e2e                          # Playwright (tự chạy `pnpm start -p 3200`); cần `pnpm exec playwright install chromium`
NEXT_PUBLIC_SITE_URL=http://localhost:3200 pnpm build && pnpm lhci
                                  # Lighthouse CI (canonical phải trùng domain đang đo): Performance ≥ 90, SEO 100,
                                  # Accessibility ≥ 95, Best Practices ≥ 95
```

Yêu cầu Node ≥ 22.18 (Vercel dùng 24), pnpm 9.15.

## Cấu trúc

```
app/[locale]/            # root layout (html lang, font, header/footer, analytics) + 8 trang; [...rest] → 404 theo ngôn ngữ
app/sitemap.ts robots.ts manifest.ts icon.* apple-icon.png
i18n/                    # routing (locales, slug dịch), navigation, request (next/root-params)
messages/vi.json en.json # chuỗi giao diện; hai tệp phải cùng tập khoá (test bắt)
content/install/{vi,en}/ # hướng dẫn cài đặt MDX; content/privacy/{vi,en}.mdx; content/releases.json (snapshot feed)
lib/releases/            # parse feed latest*.yml, fetch ISR 10 phút, dự phòng snapshot
lib/seo/                 # buildMetadata (canonical, hreflang, OG), jsonld, urls, og (ảnh OG bằng next/og)
lib/analytics.ts         # track(): Vercel Analytics luôn, GA4 khi đã nạp; lib/consent.ts: lựa chọn cookie
components/              # ui (primitives), site (header, footer, consent), home, download, guide, seo
scripts/                 # sync-releases.mjs, capture-product-images.mjs
tests/unit tests/e2e     # Vitest, Playwright; lighthouserc.json; .github/workflows/ci.yml
proxy.ts                 # next-intl (Next 16 gọi là proxy thay cho middleware)
```

## Sửa nội dung

| Muốn đổi | Sửa ở |
|---|---|
| Chữ trên giao diện (cả hai ngôn ngữ) | `messages/vi.json`, `messages/en.json` (giữ cùng tập khoá) |
| Hướng dẫn cài đặt | `content/install/<vi|en>/<macos|windows>.mdx` (`meta.toc` là mục lục) |
| Chính sách bảo mật | `content/privacy/<vi|en>.mdx` |
| Email, địa chỉ, điện thoại/Zalo, URL công ty | `lib/site.ts` (điện thoại/Zalo để trống thì thẻ Liên hệ tự ẩn) |
| Ảnh màn hình app | `pnpm capture-images <đường dẫn docops-application/docs/thiet-ke>` → `public/images/product/*.webp` |
| Slug trang | `i18n/routing.ts` (`pathnames`) — nhớ cập nhật test `tests/unit/i18n.test.ts` |

## Biến môi trường (Vercel → Settings → Environment Variables)

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | có | `https://docops.agentra.io.vn` — metadataBase, canonical, sitemap, hreflang |
| `DOWNLOAD_FEED_URL` | không | mặc định `https://download-docsopapp.agentra.io.vn/desktop/` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | không | `G-XXXX`; thiếu thì không nạp GA4 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | không | meta xác minh Google Search Console |
| `NEXT_PUBLIC_CONSENT_BANNER` | không | `off` để tắt thanh cookie (GA4 nạp ngay) |

Vercel tự đặt `NEXT_PUBLIC_VERCEL_ENV`; chỉ khi có biến này site mới nhúng script Vercel Analytics/Speed Insights (ở máy
và CI không nhúng để khỏi 404). Bật **Web Analytics** và **Speed Insights** trong dashboard của project.

## Deploy Vercel

1. Import repo vào Vercel (framework Next.js, Node 24). Đặt các biến ở trên cho Production và Preview.
2. Project Settings → Functions → Region: **Singapore (sin1)** để tái tạo ISR gần người dùng.
3. Push `main` → production; mỗi PR có preview URL. CI (`.github/workflows/ci.yml`) chạy verify, build, e2e, Lighthouse.
4. Chuyển domain và phát hành bản desktop: xem `docs/van-hanh.md`.
