# Thiết kế landing page Agentra DocOps

Bản mockup tĩnh cho landing page, theo spec `docs/superpowers/specs/2026-09-16-docops-landing-page-design.md` §8.
Token màu, bo góc lấy nguyên từ `docops-application/packages/ui/src/tokens.css`; font Be Vietnam Pro.

**Canvas đã xuất bản:** https://claude.ai/artifact/68sTSFxNQdNhJG4T1iXgcu

## Thư mục này chứa gì

| Tệp | Vai trò |
|---|---|
| `gen.py` | **Nguồn thật.** Nội dung hai ngôn ngữ (`T['vi']`, `T['en']`) và thành phần dùng chung (header, footer, nút, icon SVG) sinh ra 7 artboard và `canvas.json`. Sửa ở đây, không sửa tay artboard. |
| `*.dc.html` | 7 artboard sinh ra: `Main` (trang chủ VI desktop), `TrangChuMobile`, `HomeEN`, `TaiVe`, `CaiDatMacOS`, `LienHe`, `QuyTrinh` |
| `canvas.json` | Bố cục canvas và ghi chú dán |
| `heights.json` | Chiều cao thật của từng artboard, đo bằng `preview.mjs`; `gen.py` đọc để đặt khung |
| `images/` | Ảnh màn hình app, chụp từ artboard thiết kế desktop của `docops-application/docs/thiet-ke` |
| `render-shots.mjs` | Chụp artboard của app thành PNG 2x (tự điền `sc-for` và lỗ `{{...}}`) |
| `preview.mjs` | Mở từng artboard bằng Playwright: đo chiều cao, chụp toàn trang để soát |
| `landing-page-agentra-docops.html` | Canvas đã gói (3 MB, không theo dõi git) |

Playwright dùng bản cài trong `docops-application/packages/desktop` (Chromium đã có sẵn), nên hai script `.mjs`
tham chiếu đường dẫn tuyệt đối tới repo đó.

## Dựng lại

```sh
python3 docs/thiet-ke/gen.py                       # sinh artboard + canvas.json
node docs/thiet-ke/preview.mjs /tmp/xem            # đo chiều cao → heights.json, chụp toàn trang
python3 docs/thiet-ke/gen.py                       # chạy lại để canvas.json lấy chiều cao thật
```

Gói canvas bằng helper của skill `design` (chạy trong `docs/thiet-ke/`):

```sh
B=<thư mục skill design>
node "$B/seed-canvas.mjs" --template "$B/payload.template.html" \
  --out landing-page-agentra-docops.html --title "Landing page Agentra DocOps" \
  $(for f in Main TrangChuMobile HomeEN TaiVe CaiDatMacOS LienHe QuyTrinh; do printf -- "--artboard %s.dc.html " "$f"; done) \
  $(for f in images/*.jpg; do printf -- "--image %s " "$f"; done) \
  --canvas canvas.json
node "$B/seed-canvas.mjs" --check landing-page-agentra-docops.html
```

Rồi xuất bản lại **đúng đường dẫn tệp đó** để giữ nguyên link ở trên.

## Ảnh app

```sh
node docs/thiet-ke/render-shots.mjs <docops-application>/docs/thiet-ke /tmp/png RaSoat TraCuu SoanThao KhoVanBan DoThi
```

Thu nhỏ bằng Pillow: hero `app-rasoat.jpg` 1200px q80; thẻ 760px q76. Khi code site thật, chụp lại ở 2x và xuất WebP
vào `public/images/product/` (spec §8.3).
