#!/usr/bin/env python3
"""Sinh artboard .dc.html và canvas.json cho canvas thiết kế landing page Agentra DocOps.

Chạy:  python3 docs/thiet-ke/gen.py          (ghi vào cùng thư mục)
Sau đó đo chiều cao thật: node docs/thiet-ke/measure.mjs  → heights.json → chạy lại gen.py.
Token màu, bo góc, chữ lấy từ packages/ui/src/tokens.css của docops-application (spec §8.1).
"""
import json
import os

OUT = os.path.dirname(os.path.abspath(__file__))

# ── Token (tokens.css) ────────────────────────────────────────────────────────
PAGE = '#f9f9f7'; CARD = '#fcfcfb'; CARD2 = '#ffffff'; SIDEBAR = '#f3f3f0'
INK = '#0b0b0b'; INK2 = '#52514e'; MUTED = '#898781'; LINE = '#e1e0d9'
BRAND_L = '#8cbf3c'; BRAND = '#6a9c39'
ACCENT = '#567f2e'; ACCENT_S = '#3e6b1f'; SOFT = '#eff5e3'; SOFT_LINE = '#d9e6c4'
DEEP = '#1e3413'  # token mới duy nhất của marketing (spec §8.1)
GOOD = '#0ca30c'; GOOD_SOFT = '#e9f6e9'; GOOD_TEXT = '#006300'
WARN_DOT = '#fab219'; WARN_SOFT = '#fdf3dc'; WARN_TEXT = '#7a5200'; WARN_BORDER = '#f0dfae'
CRIT = '#d03b3b'; CRIT_SOFT = '#fbe9e9'; CRIT_TEXT = '#8f2020'
INFO_SOFT = '#eaf2fc'; INFO_TEXT = '#1c5cab'; INFO_BORDER = '#c9dcf3'
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

STYLE = """
    body{margin:0;background:#f9f9f7;color:#0b0b0b;font-family:'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',sans-serif;font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
    *{box-sizing:border-box}
    a{color:#3e6b1f;text-decoration:none} a:hover{color:#567f2e}
    h1,h2,h3,h4,p,ul,ol{margin:0} ul,ol{padding-left:22px}
    img{display:block} svg{flex:none}
    table{border-collapse:collapse}
"""
FONT_LINK = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&amp;display=swap">'

# ── Icon: SVG nét 1.6px trên lưới 24 (không emoji) ─────────────────────────────
ICONS = {
    'download': '<path d="M12 4v11"></path><path d="m7 10 5 5 5-5"></path><path d="M5 20h14"></path>',
    'arrow-right': '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    'arrow-left': '<path d="M19 12H5"></path><path d="m11 6-6 6 6 6"></path>',
    'check': '<path d="m5 12.5 4.5 4.5L19 7"></path>',
    'file': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 3v5h5"></path><path d="M9 13h6M9 17h6"></path>',
    'tag': '<path d="M20.5 12.5 12.5 20.5 3.5 11.5V3.5h8z"></path><circle cx="7.5" cy="7.5" r="1.5"></circle>',
    'search': '<circle cx="11" cy="11" r="6.5"></circle><path d="m20 20-4.3-4.3"></path>',
    'graph': '<circle cx="6" cy="6" r="2.5"></circle><circle cx="18" cy="8" r="2.5"></circle><circle cx="12" cy="18" r="2.5"></circle><path d="m8.4 6.6 7.2 1M7.2 8.2l3.7 7.6M16.9 10.3l-3.6 5.6"></path>',
    'pen': '<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17z"></path><path d="m13.5 6.5 3 3"></path>',
    'user-check': '<circle cx="10" cy="8" r="3.5"></circle><path d="M3.5 20a6.5 6.5 0 0 1 13 0"></path><path d="m16 13 2 2 4-4"></path>',
    'clock': '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>',
    'book': '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"></path><path d="M4 19a2 2 0 0 1 2-2h13"></path><path d="M9 7h6"></path>',
    'archive': '<rect x="3" y="4" width="18" height="5" rx="1"></rect><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path><path d="M10 13h4"></path>',
    'shield': '<path d="M12 3 5 6v5c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5V6z"></path><path d="m9.5 12 2 2 3.5-4"></path>',
    'laptop': '<rect x="4" y="5" width="16" height="11" rx="1.5"></rect><path d="M2 19h20"></path>',
    'lock': '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
    'phone': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"></path>',
    'pin': '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"></path><circle cx="12" cy="10" r="2.2"></circle>',
    'copy': '<rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path>',
    'chevron-down': '<path d="m6 9 6 6 6-6"></path>',
    'chevron-up': '<path d="m6 15 6-6 6 6"></path>',
    'chevron-right': '<path d="m9 6 6 6-6 6"></path>',
    'key': '<circle cx="8" cy="15" r="4"></circle><path d="m11 12 9-9M17 6l2 2M14 9l2 2"></path>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"></path>',
    'warning': '<path d="M12 4 3 20h18z"></path><path d="M12 10v4M12 17h.01"></path>',
    'info': '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 11v5M12 8h.01"></path>',
    'chip': '<rect x="6" y="6" width="12" height="12" rx="2"></rect><rect x="9.5" y="9.5" width="5" height="5"></rect><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"></path>',
    'refresh': '<path d="M20 12a8 8 0 1 1-2.3-5.7"></path><path d="M20 4v5h-5"></path>',
    'external': '<path d="M14 4h6v6"></path><path d="M20 4 10 14"></path><path d="M18 13v6H5V6h6"></path>',
    'bug': '<circle cx="12" cy="13" r="5"></circle><path d="M12 8V5M9 4l1.5 1.5M15 4l-1.5 1.5M4 13h3M17 13h3M6 19l2.5-2M18 19l-2.5-2M6 8l2.3 1.5M18 8l-2.3 1.5"></path>',
    'monitor': '<rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8M12 16v4"></path>',
    'wifi': '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"></path><circle cx="12" cy="19.5" r="1"></circle>',
    'hdd': '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 13h18"></path><circle cx="17" cy="16" r="1"></circle>',
    'camera': '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7l1.5-3h5L16 7"></path><circle cx="12" cy="13.5" r="3.5"></circle>',
    'message': '<path d="M4 5h16v11H9l-5 4z"></path><path d="M8 9h8M8 12.5h5"></path>',
}
APPLE = 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701'
WINDOWS = 'M3 5.6 10.6 4.5v7.1H3zM11.6 4.4 21 3v8.6h-9.4zM3 12.6h7.6v7.1L3 18.6zM11.6 12.6H21V21l-9.4-1.3z'


def ic(name, size=24, color='currentColor', sw=1.6):
    if name == 'windows':
        return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" aria-hidden="true"><path d="{WINDOWS}"></path></svg>'
    if name == 'apple':
        return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" aria-hidden="true"><path d="{APPLE}"></path></svg>'
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')


def logo(h=24):
    """Đường vẽ lấy nguyên từ packages/ui/src/components/Logo.tsx (viewBox 415×354)."""
    w = round(h * 415 / 354)
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 415 354" fill="none" aria-hidden="true">'
            f'<path d="M213 0 L270 103 L110 354 L0 354 Z" fill="{BRAND_L}"></path>'
            f'<path d="M288 133 L415 354 L302 354 L241 255 L209 253 Z" fill="{BRAND}"></path></svg>')


# ── Thành phần dùng chung ──────────────────────────────────────────────────────
def btn(label, kind='primary', icon=None, size='md', icon_after=False, full=False):
    h = {'lg': 52, 'md': 46, 'sm': 40}[size]
    px = {'lg': 24, 'md': 20, 'sm': 16}[size]
    fs = {'lg': 16, 'md': 15, 'sm': 14}[size]
    look = {
        'primary': f'background:{ACCENT};color:#ffffff;border:1px solid {ACCENT}',
        'secondary': f'background:{CARD};color:{INK};border:1px solid {LINE}',
        'white': f'background:#ffffff;color:{DEEP};border:1px solid #ffffff',
        'ghost-white': 'background:transparent;color:#ffffff;border:1px solid rgba(255,255,255,.45)',
    }[kind]
    ico = ic(icon, 20) if icon else ''
    inner = f'<span>{label}</span>{ico}' if icon_after else f'{ico}<span>{label}</span>'
    width = 'width:100%;' if full else ''
    return (f'<a href="#" style="{width}display:inline-flex;align-items:center;justify-content:center;gap:9px;height:{h}px;'
            f'padding:0 {px}px;border-radius:8px;font-size:{fs}px;font-weight:600;line-height:1;white-space:nowrap;{look}">{inner}</a>')


def eyebrow(text, color=ACCENT):
    return f'<span style="font-size:13px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:{color}">{text}</span>'


def sec_head(eb, h2, lead=None, align='center', maxw=800, color=INK, lead_color=INK2, h2_size=38):
    al = 'center' if align == 'center' else 'flex-start'
    ta = 'center' if align == 'center' else 'left'
    lead_html = f'<p style="font-size:18px;line-height:1.6;color:{lead_color};max-width:{maxw}px;text-wrap:pretty">{lead}</p>' if lead else ''
    return (f'<div style="display:flex;flex-direction:column;align-items:{al};text-align:{ta};gap:14px">{eyebrow(eb)}'
            f'<h2 style="font-size:{h2_size}px;line-height:1.15;font-weight:700;letter-spacing:-.5px;color:{color};max-width:{maxw}px;text-wrap:balance">{h2}</h2>{lead_html}</div>')


def container(inner, w=1200, extra=''):
    return f'<div style="width:{w}px;margin:0 auto;{extra}">{inner}</div>'


def section(inner, bg=PAGE, pad='96px 0', extra=''):
    return f'<section style="padding:{pad};background:{bg};{extra}">{inner}</section>'


def icon_box(name, size=44, bg=SOFT, color=ACCENT_S, r=12):
    return (f'<span style="width:{size}px;height:{size}px;border-radius:{r}px;display:inline-flex;align-items:center;'
            f'justify-content:center;background:{bg};color:{color}">{ic(name, round(size * 0.5))}</span>')


def callout(kind, text, title=None):
    kinds = {'info': (INFO_SOFT, INFO_TEXT, INFO_BORDER, 'info'),
             'warning': (WARN_SOFT, WARN_TEXT, WARN_BORDER, 'warning'),
             'note': (SOFT, ACCENT_S, SOFT_LINE, 'info')}
    bg, fg, bd, icon = kinds[kind]
    ttl = f'<b style="display:block;margin-bottom:4px">{title}</b>' if title else ''
    return (f'<div style="display:flex;gap:12px;padding:14px 16px;border:1px solid {bd};border-radius:10px;background:{bg};'
            f'color:{fg};font-size:15px;line-height:1.55"><span style="margin-top:1px">{ic(icon, 20)}</span><div>{ttl}{text}</div></div>')


def locale_switch(t):
    cur = t['locale']
    segs = ''
    for code in ('vi', 'en'):
        on = code == cur
        bg = CARD2 if on else 'transparent'
        fg = INK if on else MUTED
        sh = '0 1px 2px rgba(0,0,0,.08)' if on else 'none'
        segs += (f'<span style="padding:0 10px;height:30px;display:inline-flex;align-items:center;border-radius:99px;'
                 f'font-size:12.5px;font-weight:700;letter-spacing:.4px;background:{bg};color:{fg};box-shadow:{sh}">{code.upper()}</span>')
    return f'<span style="display:inline-flex;align-items:center;gap:2px;padding:3px;border:1px solid {LINE};border-radius:99px;background:{SIDEBAR}">{segs}</span>'


def header(t, active=None, w=1200):
    nav = ''
    for key, label in t['nav']:
        on = key == active
        nav += (f'<a href="#" style="font-size:15px;font-weight:{600 if on else 500};color:{INK if on else INK2};'
                f'padding:6px 0;border-bottom:2px solid {ACCENT if on else "transparent"}">{label}</a>')
    brand = f'<a href="#" style="display:flex;align-items:center;gap:10px;color:{INK}">{logo(26)}<span style="font-size:17px;font-weight:700;letter-spacing:.2px">Agentra DocOps</span></a>'
    right = f'<div style="display:flex;align-items:center;gap:14px">{locale_switch(t)}{btn(t["cta_download"], "primary", "download", "sm")}</div>'
    inner = f'<div style="display:flex;align-items:center;gap:40px">{brand}<nav style="display:flex;align-items:center;gap:28px;margin-left:auto">{nav}</nav>{right}</div>'
    return f'<header style="height:72px;border-bottom:1px solid {LINE};background:{CARD};display:flex;align-items:center">{container(inner, w)}</header>'


def footer(t, w=1200):
    cols = ''
    for title, links in t['footer_cols']:
        items = ''.join(f'<a href="#" style="font-size:15px;color:{INK2}">{l}</a>' for l in links)
        cols += (f'<div style="display:flex;flex-direction:column;gap:12px"><span style="font-size:13px;font-weight:700;'
                 f'letter-spacing:.5px;text-transform:uppercase;color:{MUTED}">{title}</span>{items}</div>')
    brand = (f'<div style="display:flex;flex-direction:column;gap:16px;max-width:360px"><a href="#" style="display:flex;align-items:center;gap:10px;color:{INK}">{logo(26)}'
             f'<span style="font-size:17px;font-weight:700">Agentra DocOps</span></a><p style="font-size:15px;line-height:1.6;color:{INK2}">{t["footer_tagline"]}</p>'
             f'<p style="font-size:14px;color:{MUTED}">{t["footer_addr"]}</p></div>')
    grid = f'<div style="display:grid;grid-template-columns:1.6fr repeat(3, minmax(0, 1fr));gap:48px">{brand}{cols}</div>'
    bottom = (f'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:48px;padding-top:24px;border-top:1px solid {LINE}">'
              f'<span style="font-size:13.5px;color:{MUTED}">{t["footer_copy"]}</span>{locale_switch(t)}</div>')
    return f'<footer style="background:{SIDEBAR};border-top:1px solid {LINE};padding:64px 0 32px">{container(grid + bottom, w)}</footer>'


def wrap(inner, w):
    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  {FONT_LINK}
  <style>{STYLE}  </style>
</helmet>
<div style="width:{w}px;background:{PAGE};display:flex;flex-direction:column">
{inner}
</div>
</x-dc>
</body>
</html>
'''


# ── Nội dung ───────────────────────────────────────────────────────────────────
T = {}
T['vi'] = dict(
    locale='vi',
    nav=[('how', 'Quy trình'), ('transparency', 'Minh bạch AI'), ('download', 'Tải về'), ('contact', 'Liên hệ')],
    cta_download='Tải DocOps',
    hero_eyebrow='Ứng dụng desktop cho Windows và macOS',
    hero_h1='Tác tử AI cho văn bản hành chính trường đại học',
    hero_sub='Từ văn bản đến quyết định, trong vài phút thay vì vài ngày. DocOps nhập, phân loại, tra cứu có trích dẫn, dò tác động pháp lý và soạn nháp theo Nghị định 30. Cán bộ luôn là người duyệt cuối.',
    hero_cta1='Tải về cho macOS', hero_cta2='Xem quy trình',
    hero_meta='Phiên bản 1.0.0 · Windows 10/11 · macOS 13 trở lên · Miễn phí tải, kích hoạt bằng key của đơn vị',
    trust=['Dữ liệu lưu tại máy', 'Trích dẫn bắt buộc', 'Cán bộ duyệt cuối'],
    window_title='DocOps · Rà soát căn cứ pháp lý',
    steps=[('Nhập', 'PDF, ảnh quét', 'file'), ('Phân loại', 'bóc metadata', 'tag'), ('Tra cứu', 'Q&amp;A có trích dẫn', 'search'),
           ('Tác động', 'đồ thị pháp lý', 'graph'), ('Soạn thảo', 'nháp theo NĐ 30', 'pen'), ('Cán bộ kiểm &amp; duyệt', 'người quyết cuối', 'user-check')],
    steps_caption='Quy trình 6 bước, người quyết ở bước cuối',
    flows_eyebrow='Ba luồng lõi', flows_h2='DocOps làm gì',
    flows_lead='Ba luồng cho vòng đời văn bản hành chính, dùng chung một kho tri thức tích luỹ của đơn vị.',
    flows=[('Nhập &amp; phân loại', 'OCR cho bản quét, nhận dạng con dấu và chữ ký, bóc số hiệu, ngày ký, cơ quan ban hành. Tự phân loại và định tuyến vào kho.', 'app-khovanban.jpg'),
           ('Tra cứu &amp; Q&amp;A', 'Hỏi bằng ngôn ngữ tự nhiên trên toàn bộ kho văn bản. Mỗi câu trả lời nêu rõ nguồn và nói "chưa đủ căn cứ" thay vì suy diễn.', 'app-tracuu.jpg'),
           ('Tác động &amp; soạn thảo', 'Dò quan hệ pháp lý, cảnh báo căn cứ hết hiệu lực, sinh nháp theo mẫu Nghị định 30 và kiểm thể thức trước khi trình ký.', 'app-soanthao.jpg')],
    why_eyebrow='Lợi ích', why_h2='Vì sao chọn DocOps',
    why=[('clock', 'Từ giờ xuống phút', 'Ở các luồng nhập, tra cứu và soạn thảo, việc lặp lại rút từ hàng giờ thủ công xuống còn vài phút.'),
         ('book', 'Trích dẫn bắt buộc', 'Mọi câu trả lời nêu rõ nguồn; cảnh báo ngay khi viện dẫn căn cứ đã hết hiệu lực.'),
         ('archive', 'Giữ tri thức thể chế', 'Kho văn bản và đồ thị quan hệ pháp lý tích luỹ theo năm, không bốc hơi khi cán bộ nghỉ.'),
         ('shield', 'Bám chuẩn Nghị định 30/2020', 'Thể thức văn bản theo quy định nhà nước; luôn có cán bộ duyệt cuối trước khi ban hành.')],
    trust_eyebrow='Minh bạch và an toàn', trust_h2='AI hỗ trợ, con người quyết',
    trust_cards=[('user-check', 'Con người quyết', 'Văn bản ở trạng thái chờ cho tới khi cán bộ xem, sửa và duyệt. AI không thay quyền quyết định.'),
                 ('laptop', 'Dữ liệu tại máy', 'Văn bản gốc lưu trên máy của bạn. Mỗi đơn vị một key và một workspace riêng, tách biệt hoàn toàn.'),
                 ('lock', 'Không huấn luyện trên dữ liệu của trường', 'Máy chủ chỉ xử lý phần AI và không giữ nội dung sau khi trả kết quả.')],
    trust_link='Đọc chính sách minh bạch AI',
    dl_eyebrow='Tải về', dl_h2='Tải DocOps',
    dl_lead='Phiên bản 1.0.0, phát hành 15/09/2026. Miễn phí tải, kích hoạt bằng key của đơn vị.',
    dl_date='15/09/2026',
    platforms=[('windows', 'Windows', '64-bit, Windows 10 và 11', 'DocOps Setup 1.0.0.exe', '150 MB'),
               ('apple', 'macOS Apple Silicon', 'Chip M1, M2, M3, M4', 'DocOps-1.0.0-arm64.dmg', '186 MB'),
               ('apple', 'macOS Intel', 'Chip Intel Core', 'DocOps-1.0.0.dmg', '191 MB')],
    dl_btn='Tải về', dl_guide='Hướng dẫn cài đặt',
    dl_note='Bản hiện tại chưa ký số nên Windows và macOS sẽ hỏi xác nhận một lần khi cài. Hướng dẫn cài đặt chỉ từng bước "Vẫn chạy" và "Vẫn mở".',
    faq_eyebrow='Hỏi đáp', faq_h2='Câu hỏi thường gặp',
    faq=[('Key kích hoạt là gì và xin ở đâu?', 'Mỗi đơn vị được Agentra cấp một key dạng DOCOPS-XXXX-XXXX-XXXX để mở workspace riêng. Cài app, ở màn Kích hoạt chọn "Chưa có key (đăng ký mới)" và gửi đơn ngay trong app, hoặc email cho chúng tôi kèm tên đơn vị.'),
         ('Có cần Internet không?', 'Cần khi kích hoạt và ở các bước AI: OCR, phân loại, tra cứu, soạn nháp. Văn bản của bạn vẫn lưu tại máy.'),
         ('Dữ liệu văn bản lưu ở đâu?', 'Trên máy của bạn. Máy chủ chỉ xử lý phần AI và không giữ nội dung sau khi trả kết quả. Agentra không dùng dữ liệu của trường để huấn luyện mô hình.'),
         ('Vì sao Windows hoặc macOS cảnh báo khi cài?', 'Bản hiện tại chưa mua chứng thư số nên hệ điều hành hỏi xác nhận một lần. Hướng dẫn cài đặt chỉ từng bước bấm "Vẫn chạy" trên Windows và "Vẫn mở" trên macOS.'),
         ('Cập nhật phiên bản mới thế nào?', 'Không cần tải lại. Trong app vào Cài đặt, thẻ Phiên bản, bấm Kiểm tra cập nhật, rồi Tải và cài, sau đó Khởi động lại để cài.'),
         ('Chi phí sử dụng?', 'Tải và cài miễn phí. Chi phí tính theo quy mô sử dụng của đơn vị; liên hệ để nhận báo giá.')],
    cta_h2='Sẵn sàng thử DocOps cho đơn vị của bạn?',
    cta_sub='Tải app, xin key ngay trong màn Kích hoạt, và bắt đầu rà soát kho văn bản của đơn vị trong hôm nay.',
    cta_b1='Tải DocOps', cta_b2='Liên hệ',
    footer_tagline='Phần mềm AI xử lý văn bản hành chính trường đại học. Một sản phẩm của Agentra.',
    footer_addr='Agentra JSC · Đà Nẵng, Việt Nam · info@agentra.io.vn',
    footer_cols=[('Sản phẩm', ['Tải về', 'Cài đặt trên macOS', 'Cài đặt trên Windows', 'Quy trình']),
                 ('Tin cậy', ['Minh bạch AI', 'Chính sách bảo mật']),
                 ('Công ty', ['Agentra JSC', 'Liên hệ', 'info@agentra.io.vn'])],
    footer_copy='© 2026 Agentra JSC · Đà Nẵng, Việt Nam',
    m_menu='Menu',
)

T['en'] = dict(
    locale='en',
    nav=[('how', 'How it works'), ('transparency', 'AI transparency'), ('download', 'Download'), ('contact', 'Contact')],
    cta_download='Download DocOps',
    hero_eyebrow='Desktop app for Windows and macOS',
    hero_h1='The AI agent for university administrative documents',
    hero_sub='From document to decision in minutes, not days. DocOps ingests, classifies, searches with citations, maps legal impact and drafts under Decree 30. Your staff always make the final call.',
    hero_cta1='Download for macOS', hero_cta2='See how it works',
    hero_meta='Version 1.0.0 · Windows 10/11 · macOS 13 or later · Free to download, activated with your institution key',
    trust=['Data stays on your machine', 'Citations required', 'Staff make the final call'],
    window_title='DocOps · Legal basis review',
    steps=[('Ingest', 'PDF, scans', 'file'), ('Classify', 'extract metadata', 'tag'), ('Search', 'cited Q&amp;A', 'search'),
           ('Impact', 'legal graph', 'graph'), ('Draft', 'Decree 30 templates', 'pen'), ('Staff review &amp; approve', 'a person decides', 'user-check')],
    steps_caption='Six steps; a person decides at the last one',
    flows_eyebrow='Three core flows', flows_h2='What DocOps does',
    flows_lead='Three flows for the administrative document lifecycle, sharing one knowledge base that grows with your institution.',
    flows=[('Ingest &amp; classify', 'OCR for scans, seal and signature detection, extraction of number, date and issuing body. Automatic classification and routing into the repository.', 'app-khovanban.jpg'),
           ('Search &amp; Q&amp;A', 'Ask in plain language across the whole repository. Every answer cites its sources and says "insufficient basis" instead of guessing.', 'app-tracuu.jpg'),
           ('Impact &amp; drafting', 'Map legal relationships, flag expired references, generate drafts on Decree 30 templates and check the format before signing.', 'app-soanthao.jpg')],
    why_eyebrow='Benefits', why_h2='Why DocOps',
    why=[('clock', 'Hours down to minutes', 'Across ingest, search and drafting, repetitive work drops from hours of manual effort to a few minutes.'),
         ('book', 'Citations, always', 'Every answer names its source and warns as soon as a cited basis has expired.'),
         ('archive', 'Institutional memory that stays', 'The repository and the legal relationship graph accumulate year after year and do not leave with staff turnover.'),
         ('shield', 'Compliant with Decree 30/2020 on clerical work', 'Document format follows the national standard; a staff member always approves before issuance.')],
    trust_eyebrow='Transparent and safe', trust_h2='AI assists, people decide',
    trust_cards=[('user-check', 'People decide', 'A document stays pending until a staff member reviews, edits and approves it. AI never replaces that decision.'),
                 ('laptop', 'Data on your machine', 'Original documents live on your computer. Each institution gets its own key and a fully separate workspace.'),
                 ('lock', 'Never used for training', 'The server only runs the AI steps and keeps no content after returning a result.')],
    trust_link='Read the AI transparency policy',
    dl_eyebrow='Download', dl_h2='Download DocOps',
    dl_lead='Version 1.0.0, released 15 September 2026. Free to download, activated with your institution key.',
    dl_date='15 Sep 2026',
    platforms=[('windows', 'Windows', '64-bit, Windows 10 and 11', 'DocOps Setup 1.0.0.exe', '150 MB'),
               ('apple', 'macOS Apple Silicon', 'M1, M2, M3, M4 chips', 'DocOps-1.0.0-arm64.dmg', '186 MB'),
               ('apple', 'macOS Intel', 'Intel Core chips', 'DocOps-1.0.0.dmg', '191 MB')],
    dl_btn='Download', dl_guide='Installation guide',
    dl_note='The current build is not code-signed yet, so Windows and macOS ask for a one-time confirmation. The installation guide walks through "Run anyway" and "Open Anyway".',
    faq_eyebrow='FAQ', faq_h2='Frequently asked questions',
    faq=[('What is an activation key and where do I get one?', 'Agentra issues each institution a key in the form DOCOPS-XXXX-XXXX-XXXX that opens its own workspace. Install the app, choose "No key yet (new registration)" on the activation screen and send the request from inside the app, or email us with your institution name.'),
         ('Do I need an internet connection?', 'Yes, for activation and for the AI steps: OCR, classification, search and drafting. Your documents still stay on your machine.'),
         ('Where are my documents stored?', 'On your computer. The server only runs the AI steps and keeps no content after returning a result. Agentra never uses institution data to train models.'),
         ('Why does Windows or macOS warn me during installation?', 'The current build has no code-signing certificate yet, so the operating system asks for a one-time confirmation. The guide shows exactly where to click "Run anyway" on Windows and "Open Anyway" on macOS.'),
         ('How do I get new versions?', 'No re-download needed. In the app open Settings, the Version tab, click Check for updates, then Download and install, then Restart to install.'),
         ('What does it cost?', 'Downloading and installing is free. Pricing depends on how much your institution uses; contact us for a quote.')],
    cta_h2='Ready to try DocOps at your institution?',
    cta_sub='Download the app, request a key right from the activation screen, and start reviewing your document repository today.',
    cta_b1='Download DocOps', cta_b2='Contact us',
    footer_tagline='AI software for university administrative documents. A product of Agentra.',
    footer_addr='Agentra JSC · Da Nang, Vietnam · info@agentra.io.vn',
    footer_cols=[('Product', ['Download', 'Install on macOS', 'Install on Windows', 'How it works']),
                 ('Trust', ['AI transparency', 'Privacy policy']),
                 ('Company', ['Agentra JSC', 'Contact', 'info@agentra.io.vn'])],
    footer_copy='© 2026 Agentra JSC · Da Nang, Vietnam',
    m_menu='Menu',
)


# ── Trang chủ · desktop ─────────────────────────────────────────────────────────
def hero(t):
    trust = ''.join(f'<span style="display:inline-flex;align-items:center;gap:8px;font-size:14.5px;font-weight:500;color:{INK2}">'
                    f'<span style="color:{ACCENT}">{ic("check", 18, sw=2)}</span>{x}</span>' for x in t['trust'])
    dots = ''.join(f'<span style="width:10px;height:10px;border-radius:99px;background:{c}"></span>' for c in ('#e0ddd4', '#e0ddd4', '#e0ddd4'))
    buttons = btn(t['hero_cta1'], 'primary', 'download', 'lg') + btn(t['hero_cta2'], 'secondary', 'arrow-right', 'lg', icon_after=True)
    top = (f'<div style="width:1200px;margin:0 auto;display:flex;flex-direction:column;align-items:center;text-align:center;gap:22px">'
           f'{eyebrow(t["hero_eyebrow"])}'
           f'<h1 style="font-size:58px;line-height:1.08;font-weight:700;letter-spacing:-1px;max-width:940px;text-wrap:balance">{t["hero_h1"]}</h1>'
           f'<p style="font-size:19px;line-height:1.6;color:{INK2};max-width:800px;text-wrap:pretty">{t["hero_sub"]}</p>'
           f'<div style="display:flex;gap:12px;margin-top:6px">{buttons}</div>'
           f'<p style="font-size:13.5px;color:{MUTED}">{t["hero_meta"]}</p>'
           f'<div style="display:flex;gap:28px;margin-top:6px">{trust}</div></div>')
    frame = (f'<div style="width:1080px;margin:60px auto 0;border:1px solid {LINE};border-bottom:0;border-radius:14px 14px 0 0;background:{CARD2};'
             f'box-shadow:0 30px 70px -30px rgba(30,52,19,.45);overflow:hidden">'
             f'<div style="display:flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-bottom:1px solid {LINE};background:{SIDEBAR}">{dots}'
             f'<span style="margin-left:8px;font-size:12.5px;color:{MUTED}">{t["window_title"]}</span></div>'
             f'<img src="app-rasoat.jpg" alt="" style="width:1078px;height:674px"></div>')
    return (f'<section style="padding:80px 0 0;background:radial-gradient(1000px 480px at 50% -60px, {SOFT} 0%, rgba(239,245,227,0) 70%), {PAGE}">'
            f'{top}{frame}</section>')


def pipeline(t):
    items = []
    n = len(t['steps'])
    for i, (name, sub, icon) in enumerate(t['steps']):
        last = i == n - 1
        box = (f'<span style="width:46px;height:46px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;'
               f'background:{ACCENT if last else CARD2};border:1px solid {ACCENT if last else LINE};color:{"#ffffff" if last else ACCENT_S}">{ic(icon, 22)}</span>')
        items.append(f'<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;flex:1;padding:18px 8px;border-radius:12px;'
                     f'background:{SOFT if last else "transparent"}"><span style="font-size:11.5px;font-weight:700;letter-spacing:.5px;color:{MUTED}">0{i + 1}</span>{box}'
                     f'<span style="font-size:15px;font-weight:700;line-height:1.3">{name}</span><span style="font-size:13px;color:{INK2}">{sub}</span></div>')
        if not last:
            items.append(f'<span style="display:flex;align-items:center;color:#c9c8c0;padding-top:34px">{ic("arrow-right", 18)}</span>')
    row = f'<div style="display:flex;align-items:stretch;gap:4px">{"".join(items)}</div>'
    cap = f'<p style="text-align:center;font-size:14px;color:{MUTED};margin-top:18px">{t["steps_caption"]}</p>'
    return f'<section style="padding:40px 0 36px;background:{CARD};border-top:1px solid {LINE};border-bottom:1px solid {LINE}">{container(row + cap)}</section>'


def flows(t):
    cards = []
    for i, (title, desc, img) in enumerate(t['flows']):
        cards.append(f'<article style="display:flex;flex-direction:column;background:{CARD};border:1px solid {LINE};border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.03)">'
                     f'<div style="padding:20px 20px 0;background:{SIDEBAR};border-bottom:1px solid {LINE}"><div style="width:342px;height:214px;overflow:hidden;border:1px solid {LINE};border-bottom:0;border-radius:8px 8px 0 0;background:{CARD2}"><img src="{img}" alt="" style="width:520px;height:325px"></div></div>'
                     f'<div style="display:flex;flex-direction:column;gap:10px;padding:22px 24px 26px">'
                     f'<span style="width:28px;height:28px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;background:{SOFT};color:{ACCENT_S};font-size:13px;font-weight:700">{i + 1}</span>'
                     f'<h3 style="font-size:20px;font-weight:600;line-height:1.3">{title}</h3>'
                     f'<p style="font-size:15.5px;line-height:1.6;color:{INK2}">{desc}</p></div></article>')
    grid = f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px;margin-top:56px">{"".join(cards)}</div>'
    return section(container(sec_head(t['flows_eyebrow'], t['flows_h2'], t['flows_lead']) + grid))


def why(t):
    cards = ''.join(f'<div style="display:flex;flex-direction:column;gap:14px;padding:26px;background:{CARD};border:1px solid {LINE};border-radius:12px">{icon_box(icon)}'
                    f'<h3 style="font-size:18px;font-weight:600;line-height:1.3">{title}</h3><p style="font-size:15px;line-height:1.6;color:{INK2}">{desc}</p></div>'
                    for icon, title, desc in t['why'])
    grid = f'<div style="display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:20px;margin-top:48px">{cards}</div>'
    return section(container(sec_head(t['why_eyebrow'], t['why_h2']) + grid), bg=CARD, extra=f'border-top:1px solid {LINE};border-bottom:1px solid {LINE}')


def trust(t):
    cards = ''.join(f'<div style="display:flex;flex-direction:column;gap:14px;padding:28px;background:{CARD};border:1px solid {SOFT_LINE};border-radius:12px">{icon_box(icon, bg=SOFT)}'
                    f'<h3 style="font-size:18px;font-weight:600;line-height:1.3">{title}</h3><p style="font-size:15px;line-height:1.6;color:{INK2}">{desc}</p></div>'
                    for icon, title, desc in t['trust_cards'])
    grid = f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px;margin-top:48px">{cards}</div>'
    link = (f'<div style="display:flex;justify-content:center;margin-top:32px"><a href="#" style="display:inline-flex;align-items:center;gap:8px;font-size:15.5px;font-weight:600;color:{ACCENT_S}">'
            f'{t["trust_link"]}{ic("arrow-right", 18)}</a></div>')
    return section(container(sec_head(t['trust_eyebrow'], t['trust_h2']) + grid + link), bg=SOFT)


SHA = {'DocOps Setup 1.0.0.exe': '93YxTv222mr9/9U3PTHkVZXl8L4+x8QqF2LC2+315ns298W/XqS0Vm0Y8x3+XqnygYz+l7Rcyt1goTAKCWVBhw==',
       'DocOps-1.0.0-arm64.dmg': 'hj7TvzOhP8eQ9MYXywM/iV3mlWJ8Ll9kyZfi8DAKGNxGPgumbVEZuj9h2jx5ZKW9l2iX0vtYaFDg+zm5ysgAAA==',
       'DocOps-1.0.0.dmg': 'nwCiOamO6uqO6D9itiiCeJeasFEYDQHXd5RUuMs9ip9ZXTVDwLhVy0AG5+Ngzmfh8OdVq2XOru14q5K18U2Uuw=='}


def platform_card(t, p, highlight=False, badge=None, checksum=False, guide_label=None, full_btn=True):
    icon, title, sub, fname, size = p
    head = (f'<div style="display:flex;align-items:center;gap:14px">{icon_box(icon, 48, bg=SIDEBAR, color=INK, r=12)}'
            f'<div style="display:flex;flex-direction:column;gap:2px"><h3 style="font-size:18px;font-weight:600;line-height:1.3">{title}</h3>'
            f'<span style="font-size:13.5px;color:{INK2}">{sub}</span></div></div>')
    meta = (f'<div style="display:flex;flex-direction:column;gap:6px;padding:12px 14px;background:{SIDEBAR};border-radius:8px">'
            f'<span style="font-family:{MONO};font-size:12.5px;color:{INK};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{fname}</span>'
            f'<span style="font-size:13px;color:{MUTED}">{size} · v1.0.0 · {t["dl_date"]}</span></div>')
    sha = ''
    if checksum:
        s = SHA[fname]
        sha = (f'<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px dashed {LINE};border-radius:8px">'
               f'<span style="font-size:11px;font-weight:700;letter-spacing:.5px;color:{MUTED}">SHA-512</span>'
               f'<span style="font-family:{MONO};font-size:12px;color:{INK2};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">{s[:14]}…{s[-10:]}</span>'
               f'<span style="color:{MUTED}">{ic("copy", 16)}</span></div>')
    guide = (f'<a href="#" style="display:inline-flex;align-items:center;gap:6px;font-size:14.5px;font-weight:600;color:{ACCENT_S}">'
             f'{guide_label or t["dl_guide"]}{ic("arrow-right", 16)}</a>')
    bd = ACCENT if highlight else LINE
    badge_html = (f'<span style="position:absolute;top:-12px;left:20px;padding:3px 10px;border-radius:99px;background:{ACCENT};color:#ffffff;font-size:11.5px;font-weight:700;letter-spacing:.3px">{badge}</span>'
                  if badge else '')
    return (f'<div style="position:relative;display:flex;flex-direction:column;gap:16px;padding:26px 24px 24px;background:{CARD};border:1px solid {bd};border-radius:12px;'
            f'box-shadow:{"0 0 0 3px " + SOFT if highlight else "0 1px 2px rgba(0,0,0,.03)"}">{badge_html}{head}{meta}{sha}'
            f'{btn(t["dl_btn"], "primary", "download", "md", full=full_btn)}{guide}</div>')


def download_block(t):
    cards = ''.join(platform_card(t, p) for p in t['platforms'])
    grid = f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px;margin-top:48px">{cards}</div>'
    note = f'<div style="max-width:860px;margin:28px auto 0">{callout("info", t["dl_note"])}</div>'
    return section(container(sec_head(t['dl_eyebrow'], t['dl_h2'], t['dl_lead']) + grid + note))


def faq(t, open_index=0):
    items = []
    for i, (q, a) in enumerate(t['faq']):
        opened = i == open_index
        ans = f'<p style="font-size:15.5px;line-height:1.65;color:{INK2};padding:0 44px 22px 0">{a}</p>' if opened else ''
        items.append(f'<div style="border-bottom:1px solid {LINE}"><div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0">'
                     f'<span style="font-size:17px;font-weight:600;line-height:1.4">{q}</span><span style="color:{MUTED}">{ic("chevron-up" if opened else "chevron-down", 20)}</span></div>{ans}</div>')
    lst = f'<div style="max-width:800px;margin:40px auto 0;border-top:1px solid {LINE}">{"".join(items)}</div>'
    return section(container(sec_head(t['faq_eyebrow'], t['faq_h2']) + lst), bg=CARD, extra=f'border-top:1px solid {LINE}')


def cta(t):
    inner = (f'<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px">'
             f'<h2 style="font-size:38px;line-height:1.15;font-weight:700;letter-spacing:-.5px;color:#ffffff;max-width:760px;text-wrap:balance">{t["cta_h2"]}</h2>'
             f'<p style="font-size:17px;line-height:1.6;color:rgba(255,255,255,.78);max-width:640px">{t["cta_sub"]}</p>'
             f'<div style="display:flex;gap:12px;margin-top:10px">{btn(t["cta_b1"], "white", "download", "lg")}{btn(t["cta_b2"], "ghost-white", None, "lg")}</div></div>')
    return section(container(inner), bg=DEEP, pad='88px 0')


def home_desktop(t):
    return wrap(header(t) + hero(t) + pipeline(t) + flows(t) + why(t) + trust(t) + download_block(t) + faq(t) + cta(t) + footer(t), 1440)


# ── Trang chủ · mobile 390 ─────────────────────────────────────────────────────
def m_header(t):
    brand = f'<a href="#" style="display:flex;align-items:center;gap:8px;color:{INK}">{logo(22)}<span style="font-size:15px;font-weight:700">Agentra DocOps</span></a>'
    menu = f'<span style="width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border:1px solid {LINE};border-radius:8px;background:{CARD2};color:{INK}">{ic("menu", 22)}</span>'
    return (f'<header style="height:64px;padding:0 16px;border-bottom:1px solid {LINE};background:{CARD};display:flex;align-items:center;justify-content:space-between">'
            f'{brand}<div style="display:flex;align-items:center;gap:10px">{locale_switch(t)}{menu}</div></header>')


def m_sec_head(eb, h2, lead=None):
    lead_html = f'<p style="font-size:16px;line-height:1.6;color:{INK2};text-wrap:pretty">{lead}</p>' if lead else ''
    return (f'<div style="display:flex;flex-direction:column;gap:10px">{eyebrow(eb)}'
            f'<h2 style="font-size:28px;line-height:1.18;font-weight:700;letter-spacing:-.4px;text-wrap:balance">{h2}</h2>{lead_html}</div>')


def m_hero(t):
    trust = ''.join(f'<span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:{INK2}">'
                    f'<span style="color:{ACCENT}">{ic("check", 18, sw=2)}</span>{x}</span>' for x in t['trust'])
    dots = ''.join(f'<span style="width:8px;height:8px;border-radius:99px;background:#e0ddd4"></span>' for _ in range(3))
    top = (f'<div style="display:flex;flex-direction:column;gap:16px;padding:0 16px">{eyebrow(t["hero_eyebrow"])}'
           f'<h1 style="font-size:34px;line-height:1.12;font-weight:700;letter-spacing:-.6px;text-wrap:balance">{t["hero_h1"]}</h1>'
           f'<p style="font-size:16px;line-height:1.6;color:{INK2};text-wrap:pretty">{t["hero_sub"]}</p>'
           f'<div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">{btn(t["hero_cta1"], "primary", "download", "lg", full=True)}{btn(t["hero_cta2"], "secondary", "arrow-right", "md", icon_after=True, full=True)}</div>'
           f'<p style="font-size:12.5px;line-height:1.5;color:{MUTED}">{t["hero_meta"]}</p>'
           f'<div style="display:flex;flex-direction:column;gap:8px">{trust}</div></div>')
    frame = (f'<div style="margin:32px 16px 0;border:1px solid {LINE};border-bottom:0;border-radius:12px 12px 0 0;background:{CARD2};box-shadow:0 20px 50px -24px rgba(30,52,19,.45);overflow:hidden">'
             f'<div style="display:flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-bottom:1px solid {LINE};background:{SIDEBAR}">{dots}'
             f'<span style="margin-left:6px;font-size:11px;color:{MUTED}">{t["window_title"]}</span></div>'
             f'<img src="app-rasoat.jpg" alt="" style="width:356px;height:222px"></div>')
    return f'<section style="padding:36px 0 0;background:radial-gradient(420px 260px at 50% -40px, {SOFT} 0%, rgba(239,245,227,0) 70%), {PAGE}">{top}{frame}</section>'


def m_pipeline(t):
    rows = []
    n = len(t['steps'])
    for i, (name, sub, icon) in enumerate(t['steps']):
        last = i == n - 1
        box = (f'<span style="width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;'
               f'background:{ACCENT if last else CARD2};border:1px solid {ACCENT if last else LINE};color:{"#ffffff" if last else ACCENT_S}">{ic(icon, 20)}</span>')
        rows.append(f'<div style="display:flex;align-items:center;gap:14px;padding:12px 12px;border-radius:10px;background:{SOFT if last else "transparent"}">'
                    f'<span style="width:22px;font-size:11.5px;font-weight:700;color:{MUTED}">0{i + 1}</span>{box}'
                    f'<div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:15px;font-weight:700">{name}</span><span style="font-size:13px;color:{INK2}">{sub}</span></div></div>')
    return (f'<section style="padding:28px 16px;background:{CARD};border-top:1px solid {LINE};border-bottom:1px solid {LINE}">'
            f'<div style="display:flex;flex-direction:column;gap:4px">{"".join(rows)}</div>'
            f'<p style="text-align:center;font-size:13.5px;color:{MUTED};margin-top:14px">{t["steps_caption"]}</p></section>')


def m_flows(t):
    cards = []
    for i, (title, desc, img) in enumerate(t['flows']):
        cards.append(f'<article style="display:flex;flex-direction:column;background:{CARD};border:1px solid {LINE};border-radius:12px;overflow:hidden">'
                     f'<div style="padding:16px 16px 0;background:{SIDEBAR};border-bottom:1px solid {LINE}"><div style="width:324px;height:203px;overflow:hidden;border:1px solid {LINE};border-bottom:0;border-radius:8px 8px 0 0;background:{CARD2}"><img src="{img}" alt="" style="width:490px;height:306px"></div></div>'
                     f'<div style="display:flex;flex-direction:column;gap:8px;padding:18px 18px 22px">'
                     f'<span style="width:26px;height:26px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;background:{SOFT};color:{ACCENT_S};font-size:12.5px;font-weight:700">{i + 1}</span>'
                     f'<h3 style="font-size:19px;font-weight:600;line-height:1.3">{title}</h3><p style="font-size:15px;line-height:1.6;color:{INK2}">{desc}</p></div></article>')
    return f'<section style="padding:56px 16px">{m_sec_head(t["flows_eyebrow"], t["flows_h2"], t["flows_lead"])}<div style="display:flex;flex-direction:column;gap:16px;margin-top:28px">{"".join(cards)}</div></section>'


def m_why(t):
    rows = ''.join(f'<div style="display:flex;gap:14px;padding:18px;background:{CARD};border:1px solid {LINE};border-radius:12px">{icon_box(icon, 40)}'
                   f'<div style="display:flex;flex-direction:column;gap:6px"><h3 style="font-size:17px;font-weight:600;line-height:1.3">{title}</h3>'
                   f'<p style="font-size:14.5px;line-height:1.55;color:{INK2}">{desc}</p></div></div>' for icon, title, desc in t['why'])
    return (f'<section style="padding:56px 16px;background:{CARD};border-top:1px solid {LINE};border-bottom:1px solid {LINE}">{m_sec_head(t["why_eyebrow"], t["why_h2"])}'
            f'<div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">{rows}</div></section>')


def m_trust(t):
    cards = ''.join(f'<div style="display:flex;flex-direction:column;gap:10px;padding:20px;background:{CARD};border:1px solid {SOFT_LINE};border-radius:12px">{icon_box(icon, 40)}'
                    f'<h3 style="font-size:17px;font-weight:600;line-height:1.3">{title}</h3><p style="font-size:14.5px;line-height:1.55;color:{INK2}">{desc}</p></div>'
                    for icon, title, desc in t['trust_cards'])
    link = f'<a href="#" style="display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:{ACCENT_S};margin-top:20px">{t["trust_link"]}{ic("arrow-right", 18)}</a>'
    return f'<section style="padding:56px 16px;background:{SOFT}">{m_sec_head(t["trust_eyebrow"], t["trust_h2"])}<div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">{cards}</div>{link}</section>'


def m_download(t):
    cards = ''.join(platform_card(t, p) for p in t['platforms'])
    return (f'<section style="padding:56px 16px">{m_sec_head(t["dl_eyebrow"], t["dl_h2"], t["dl_lead"])}'
            f'<div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">{cards}</div><div style="margin-top:16px">{callout("info", t["dl_note"])}</div></section>')


def m_faq(t):
    items = []
    for i, (q, a) in enumerate(t['faq']):
        opened = i == 0
        ans = f'<p style="font-size:15px;line-height:1.6;color:{INK2};padding:0 0 18px">{a}</p>' if opened else ''
        items.append(f'<div style="border-bottom:1px solid {LINE}"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0">'
                     f'<span style="font-size:16px;font-weight:600;line-height:1.4">{q}</span><span style="color:{MUTED}">{ic("chevron-up" if opened else "chevron-down", 20)}</span></div>{ans}</div>')
    return f'<section style="padding:56px 16px;background:{CARD};border-top:1px solid {LINE}">{m_sec_head(t["faq_eyebrow"], t["faq_h2"])}<div style="margin-top:20px;border-top:1px solid {LINE}">{"".join(items)}</div></section>'


def m_cta(t):
    return (f'<section style="padding:56px 16px;background:{DEEP};display:flex;flex-direction:column;gap:14px;text-align:center;align-items:center">'
            f'<h2 style="font-size:28px;line-height:1.18;font-weight:700;letter-spacing:-.4px;color:#ffffff;text-wrap:balance">{t["cta_h2"]}</h2>'
            f'<p style="font-size:15.5px;line-height:1.6;color:rgba(255,255,255,.78)">{t["cta_sub"]}</p>'
            f'<div style="display:flex;flex-direction:column;gap:10px;width:100%;margin-top:8px">{btn(t["cta_b1"], "white", "download", "lg", full=True)}{btn(t["cta_b2"], "ghost-white", None, "md", full=True)}</div></section>')


def m_footer(t):
    cols = ''
    for title, links in t['footer_cols']:
        items = ''.join(f'<a href="#" style="font-size:15px;color:{INK2}">{l}</a>' for l in links)
        cols += f'<div style="display:flex;flex-direction:column;gap:10px"><span style="font-size:12.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:{MUTED}">{title}</span>{items}</div>'
    brand = (f'<div style="display:flex;flex-direction:column;gap:12px"><a href="#" style="display:flex;align-items:center;gap:8px;color:{INK}">{logo(22)}<span style="font-size:15px;font-weight:700">Agentra DocOps</span></a>'
             f'<p style="font-size:14.5px;line-height:1.6;color:{INK2}">{t["footer_tagline"]}</p><p style="font-size:13.5px;line-height:1.5;color:{MUTED}">{t["footer_addr"]}</p></div>')
    return (f'<footer style="background:{SIDEBAR};border-top:1px solid {LINE};padding:40px 16px 28px;display:flex;flex-direction:column;gap:28px">{brand}'
            f'<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:24px">{cols}</div>'
            f'<div style="display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid {LINE}"><span style="font-size:13px;color:{MUTED}">{t["footer_copy"]}</span>{locale_switch(t)}</div></footer>')


def home_mobile(t):
    return wrap(m_header(t) + m_hero(t) + m_pipeline(t) + m_flows(t) + m_why(t) + m_trust(t) + m_download(t) + m_faq(t) + m_cta(t) + m_footer(t), 390)


# ── Trang con (VI) ─────────────────────────────────────────────────────────────
def page_head(eb, h1, lead=None, crumbs=None):
    crumb_html = ''
    if crumbs:
        parts = []
        for i, c in enumerate(crumbs):
            if i:
                parts.append(f'<span style="color:{MUTED}">{ic("chevron-right", 14)}</span>')
            parts.append(f'<a href="#" style="font-size:13.5px;color:{MUTED}">{c}</a>' if i < len(crumbs) - 1 else f'<span style="font-size:13.5px;color:{INK2}">{c}</span>')
        crumb_html = f'<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">{"".join(parts)}</div>'
    lead_html = f'<p style="font-size:18px;line-height:1.6;color:{INK2};max-width:760px;text-wrap:pretty">{lead}</p>' if lead else ''
    return section(container(f'<div style="display:flex;flex-direction:column;gap:14px">{crumb_html}{eyebrow(eb)}'
                             f'<h1 style="font-size:44px;line-height:1.1;font-weight:700;letter-spacing:-.8px;max-width:900px;text-wrap:balance">{h1}</h1>{lead_html}</div>'),
                   pad='64px 0 48px', bg=f'radial-gradient(900px 300px at 20% -80px, {SOFT} 0%, rgba(239,245,227,0) 70%), {PAGE}')


def page_taive(t):
    head = page_head('Tải về', 'Tải DocOps cho máy tính của bạn',
                     'Phiên bản 1.0.0, phát hành 15/09/2026. Miễn phí tải; sau khi cài, kích hoạt bằng key của đơn vị.')
    detect = (f'<div style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 12px;border-radius:99px;background:{SOFT};border:1px solid {SOFT_LINE};'
              f'color:{ACCENT_S};font-size:14px;font-weight:600">{ic("apple", 18)}Máy bạn đang dùng macOS. Chọn bản theo chip của máy.</div>')
    p = t['platforms']
    cards = (platform_card(t, p[1], highlight=True, checksum=True, guide_label='Hướng dẫn cài đặt cho macOS') +
             platform_card(t, p[2], highlight=True, checksum=True, guide_label='Hướng dẫn cài đặt cho macOS') +
             platform_card(t, p[0], checksum=True, guide_label='Hướng dẫn cài đặt cho Windows'))
    grid = f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px;margin-top:24px">{cards}</div>'
    chip = callout('info', 'Không chắc máy dùng chip gì? Bấm biểu tượng Apple ở góc trái trên, chọn "Giới thiệu về máy Mac này" và đọc dòng Chip: '
                           'Apple M1, M2, M3, M4 chọn bản Apple Silicon; Intel Core chọn bản Intel. Cài nhầm bản thì app không mở được.')
    block1 = section(container(detect + grid + f'<div style="margin-top:24px">{chip}</div>'), pad='8px 0 72px')

    def req_card(icon, title, rows):
        lst = ''.join(f'<li style="display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.55;color:{INK2}"><span style="color:{ACCENT};margin-top:2px">{ic(ri, 18)}</span><span>{rt}</span></li>' for ri, rt in rows)
        return (f'<div style="display:flex;flex-direction:column;gap:14px;padding:24px;background:{CARD};border:1px solid {LINE};border-radius:12px">'
                f'<div style="display:flex;align-items:center;gap:12px">{icon_box(icon, 40, bg=SIDEBAR, color=INK)}<h3 style="font-size:18px;font-weight:600">{title}</h3></div>'
                f'<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px">{lst}</ul></div>')
    reqs = (f'<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:24px;margin-top:32px">'
            + req_card('windows', 'Windows', [('monitor', 'Windows 10 hoặc 11, bản 64-bit'), ('hdd', 'Khoảng 1 GB dung lượng trống'), ('wifi', 'Kết nối Internet để kích hoạt và cho các bước AI')])
            + req_card('apple', 'macOS', [('monitor', 'macOS 13 Ventura trở lên'), ('chip', 'Apple Silicon (M1 trở lên) hoặc Intel'), ('hdd', 'Khoảng 1 GB dung lượng trống'), ('wifi', 'Kết nối Internet để kích hoạt và cho các bước AI')])
            + '</div>')
    unsigned = callout('warning', 'Windows sẽ hiện "Windows đã bảo vệ PC của bạn" (Windows protected your PC), macOS hiện "Apple không thể xác minh". Đó là thủ tục bình thường với phần mềm chưa ký số, không phải lỗi. '
                                  '<a href="#" style="font-weight:600">Hướng dẫn cài đặt</a> chỉ đúng chỗ bấm "Vẫn chạy" (Windows) và "Vẫn mở" (macOS); chỉ phải làm một lần.', title='Bản hiện tại chưa ký số')
    update = (f'<div style="display:flex;gap:14px;padding:20px 22px;background:{CARD};border:1px solid {LINE};border-radius:12px">{icon_box("refresh", 40)}'
              f'<div style="display:flex;flex-direction:column;gap:4px"><b style="font-size:16px">Đã cài rồi? Bản mới tự cập nhật trong app</b>'
              f'<span style="font-size:15px;line-height:1.55;color:{INK2}">Vào Cài đặt, thẻ Phiên bản, bấm Kiểm tra cập nhật rồi Tải và cài. Không cần tải lại tệp cài.</span></div></div>')
    help_line = f'<p style="text-align:center;font-size:14.5px;color:{MUTED};margin-top:28px">Không tải được? Email <a href="#" style="font-weight:600">info@agentra.io.vn</a>, chúng tôi gửi tệp qua kênh khác.</p>'
    block2 = section(container(sec_head('Yêu cầu hệ thống', 'Máy nào chạy được DocOps', align='left') + reqs
                               + f'<div style="display:flex;flex-direction:column;gap:16px;margin-top:32px">{unsigned}{update}</div>' + help_line),
                     bg=CARD, extra=f'border-top:1px solid {LINE}', pad='72px 0 80px')
    return wrap(header(t, 'download') + head + block1 + block2 + footer(t), 1440)


def step_block(n, title, body):
    return (f'<div style="display:flex;gap:20px"><span style="flex:none;width:36px;height:36px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;'
            f'background:{ACCENT};color:#ffffff;font-size:15px;font-weight:700">{n}</span>'
            f'<div style="display:flex;flex-direction:column;gap:14px;flex:1;padding-bottom:40px;border-bottom:1px solid {LINE}">'
            f'<h2 style="font-size:24px;font-weight:700;line-height:1.3;letter-spacing:-.3px;padding-top:4px">{title}</h2>{body}</div></div>')


def para(text):
    return f'<p style="font-size:16px;line-height:1.65;color:{INK2}">{text}</p>'


def olist(items):
    return '<ol style="display:flex;flex-direction:column;gap:8px;font-size:16px;line-height:1.6;color:{c}">{i}</ol>'.format(
        c=INK2, i=''.join(f'<li>{x}</li>' for x in items))


def code_block(cmd):
    return (f'<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:{INK};border-radius:8px;color:#e6e6e2;font-family:{MONO};font-size:13.5px">'
            f'<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{cmd}</span><span style="color:#a9a8a1">{ic("copy", 18)}</span></div>')


def page_caidat(t):
    head = page_head('Hướng dẫn cài đặt', 'Cài DocOps trên máy Mac', 'Khoảng 5 phút. Cập nhật ngày 15/09/2026.', crumbs=['Tải về', 'Hướng dẫn cài đặt', 'macOS'])
    tabs = (f'<div style="display:inline-flex;gap:4px;padding:4px;border:1px solid {LINE};border-radius:10px;background:{SIDEBAR}">'
            f'<span style="display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:7px;background:{CARD2};box-shadow:0 1px 2px rgba(0,0,0,.08);font-size:14.5px;font-weight:600;color:{INK}">{ic("apple", 18)}macOS</span>'
            f'<a href="#" style="display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:7px;font-size:14.5px;font-weight:600;color:{INK2}">{ic("windows", 18)}Windows</a></div>')
    toc_items = ['Chọn đúng tệp cho máy của bạn', 'Cài đặt', 'Lần mở đầu', 'Nếu máy báo "DocOps bị hỏng"', 'Kích hoạt bằng key', 'Nhận bản mới', 'Báo lỗi']
    toc = ''.join(f'<a href="#" style="display:flex;gap:10px;font-size:14.5px;line-height:1.4;padding:7px 12px;border-left:2px solid {ACCENT if i == 0 else "transparent"};'
                  f'color:{INK if i == 0 else INK2};font-weight:{600 if i == 0 else 500}"><span style="color:{MUTED};font-variant-numeric:tabular-nums">{i + 1}.</span>{x}</a>'
                  for i, x in enumerate(toc_items))
    toc_html = (f'<div style="position:sticky;top:24px;display:flex;flex-direction:column;gap:12px"><span style="font-size:12.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:{MUTED};padding-left:12px">Nội dung</span>'
                f'<nav style="display:flex;flex-direction:column;gap:2px;border-left:1px solid {LINE}">{toc}</nav>'
                f'<div style="margin-top:12px;padding-left:12px">{btn("Tải về cho macOS", "primary", "download", "md")}</div></div>')
    intro = callout('note', 'Bản này chưa mua chứng thư số của Apple, nên lần mở đầu macOS sẽ chặn và bạn phải cho phép một lần trong Cài đặt Hệ thống. '
                            'Đây là thủ tục bình thường của macOS với phần mềm ngoài App Store, không phải lỗi. Sau khi cho phép, những lần mở sau không hỏi lại.')
    th = f'padding:10px 14px;text-align:left;font-size:13px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:{MUTED};background:{SIDEBAR};border-bottom:1px solid {LINE}'
    td = f'padding:12px 14px;font-size:15px;color:{INK2};border-bottom:1px solid {LINE}'
    table = (f'<table style="width:100%;border:1px solid {LINE};border-radius:10px;overflow:hidden;border-spacing:0"><tr><th style="{th}">Dòng Chip ghi</th><th style="{th}">Tệp cần tải</th></tr>'
             f'<tr><td style="{td}">Apple M1, M2, M3, M4…</td><td style="{td};font-family:{MONO};font-size:13.5px;color:{INK}">DocOps-1.0.0-arm64.dmg</td></tr>'
             f'<tr><td style="{td};border-bottom:0">Intel Core i5, i7, i9…</td><td style="{td};border-bottom:0;font-family:{MONO};font-size:13.5px;color:{INK}">DocOps-1.0.0.dmg</td></tr></table>')
    s1 = step_block(1, 'Chọn đúng tệp cho máy của bạn',
                    para('Bấm biểu tượng Apple ở góc trái trên, chọn <b>Giới thiệu về máy Mac này</b> (About This Mac) và đọc dòng <b>Chip</b>:') + table +
                    para('Cài nhầm tệp thì app không mở được. Nếu không chắc, email cho Agentra kèm ảnh chụp cửa sổ Giới thiệu về máy Mac này.'))
    s2 = step_block(2, 'Cài đặt', olist(['Bấm đúp tệp <b>.dmg</b> vừa tải. Một cửa sổ hiện ra có biểu tượng <b>DocOps</b> và thư mục <b>Applications</b>.',
                                         'Kéo biểu tượng <b>DocOps</b> thả vào thư mục <b>Applications</b>.',
                                         'Đóng cửa sổ, rồi tháo ổ đĩa DocOps trên màn hình chính (chuột phải, chọn Đẩy ra (Eject)).']))
    sub_a = (f'<div style="display:flex;flex-direction:column;gap:12px;padding:20px;background:{CARD};border:1px solid {LINE};border-radius:12px">'
             f'<h3 style="font-size:17px;font-weight:600">3a. macOS 15 Sequoia và macOS 26 Tahoe</h3>'
             + olist(['Mở <b>Launchpad</b> hoặc thư mục <b>Applications</b>, bấm đúp <b>DocOps</b>.',
                      'macOS hiện hộp thoại "Apple không thể xác minh DocOps không chứa phần mềm độc hại". Bấm <b>Xong</b> (Done).',
                      'Mở <b>Cài đặt Hệ thống</b>, chọn <b>Quyền riêng tư &amp; Bảo mật</b>, cuộn xuống mục <b>Bảo mật</b>.',
                      'Ở dòng "DocOps đã bị chặn để bảo vệ máy Mac của bạn", bấm <b>Vẫn mở</b> (Open Anyway). Dòng này chỉ xuất hiện sau khi bạn đã thử mở app ở bước 1.',
                      'macOS hỏi lại lần nữa: bấm <b>Vẫn mở</b>, rồi xác thực bằng Touch ID hoặc mật khẩu máy. Từ lần sau bấm đúp là chạy thẳng.'])
             + callout('warning', 'Ở bước 2, <b>đừng bấm "Chuyển vào Thùng rác"</b> (Move to Trash). Nút đó xoá app vừa cài.') + '</div>')
    sub_b = (f'<div style="display:flex;flex-direction:column;gap:12px;padding:20px;background:{CARD};border:1px solid {LINE};border-radius:12px">'
             f'<h3 style="font-size:17px;font-weight:600">3b. macOS 13 Ventura và macOS 14 Sonoma</h3>'
             + olist(['Mở thư mục <b>Applications</b>, <b>bấm chuột phải</b> vào <b>DocOps</b>, chọn <b>Mở</b> (Open).',
                      'Hộp thoại hiện ra có nút <b>Mở</b>: bấm vào đó. Bấm đúp thông thường sẽ không có nút này, phải vào bằng chuột phải đúng một lần.'])
             + para('Nếu không thấy nút Mở, làm theo mục 3a từ bước 3.') + '</div>')
    s3 = step_block(3, 'Lần mở đầu: cho phép trong Cài đặt Hệ thống', para('Cách làm tuỳ phiên bản macOS. Xem phiên bản ở Giới thiệu về máy Mac này.') + sub_a + sub_b)
    s4 = step_block(4, 'Nếu máy báo "DocOps bị hỏng" (is damaged)',
                    para('Thông báo này xảy ra khi tệp cài bị sửa đổi trên đường truyền, thường do nén lại hoặc do dịch vụ gửi tệp. App không hỏng. '
                         'Mở <b>Terminal</b> (Spotlight: bấm ⌘ + Space, gõ "Terminal"), dán đúng dòng dưới rồi bấm Enter, nhập mật khẩu máy nếu được hỏi:')
                    + code_block('xattr -dr com.apple.quarantine /Applications/DocOps.app')
                    + para('Xong bấm đúp mở DocOps như bình thường. Nếu vẫn không được, email cho Agentra để nhận tệp mới; đừng tải bản khác trên mạng.'))
    key_chip = f'<span style="display:inline-block;padding:4px 10px;border-radius:6px;background:{SIDEBAR};border:1px solid {LINE};font-family:{MONO};font-size:13.5px;color:{INK}">DOCOPS-XXXX-XXXX-XXXX</span>'
    s5 = step_block(5, 'Kích hoạt bằng key',
                    para(f'Màn hình đầu tiên là <b>Kích hoạt</b>. Nhập key Agentra đã cấp cho đơn vị, dạng {key_chip}, rồi bấm <b>Kích hoạt</b>. Máy cần có Internet. '
                         f'Chưa có key? Ở màn này chọn <b>Chưa có key (đăng ký mới)</b>, điền tên đơn vị và liên hệ, Agentra sẽ xét duyệt và gửi key qua email.'))
    s6 = step_block(6, 'Nhận bản mới',
                    para('Không cần tải lại tệp .dmg. DocOps tự kiểm tra và tải bản mới:')
                    + olist(['Mở <b>Cài đặt</b> trong app, chọn thẻ <b>Phiên bản</b>.', 'Bấm <b>Kiểm tra cập nhật</b>.',
                             'Nếu có bản mới, bấm <b>Tải và cài</b> và đợi thanh phần trăm chạy hết.',
                             'Bấm <b>Khởi động lại để cài</b>. DocOps đóng lại, cài bản mới rồi tự mở lại.'])
                    + callout('info', 'Đang soạn thảo dở? Lưu bản thảo trước khi bấm "Khởi động lại để cài": bước này đóng app ngay.'))
    s7 = (f'<div style="display:flex;gap:20px"><span style="flex:none;width:36px;height:36px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;background:{ACCENT};color:#ffffff;font-size:15px;font-weight:700">7</span>'
          f'<div style="display:flex;flex-direction:column;gap:14px;flex:1"><h2 style="font-size:24px;font-weight:700;line-height:1.3;letter-spacing:-.3px;padding-top:4px">Báo lỗi</h2>'
          + para('Khi gặp lỗi, chụp màn hình và ghi lại: đang ở màn nào, bấm gì thì lỗi, thông báo hiện ra chữ gì, kèm phiên bản macOS và loại chip. Gửi về <a href="#" style="font-weight:600">info@agentra.io.vn</a> hoặc dùng mục Phản hồi trong app.')
          + '</div></div>')
    bottom = (f'<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:40px;padding:24px;background:{SOFT};border:1px solid {SOFT_LINE};border-radius:12px">'
              f'<div style="display:flex;flex-direction:column;gap:4px"><b style="font-size:16px">Sẵn sàng cài?</b><span style="font-size:14.5px;color:{INK2}">Tải đúng bản theo chip của máy rồi làm theo các bước trên.</span></div>'
              f'<div style="display:flex;gap:10px">{btn("Tải về cho macOS", "primary", "download", "md")}{btn("Hướng dẫn cho Windows", "secondary", "arrow-right", "md", icon_after=True)}</div></div>')
    content = f'<div style="display:flex;flex-direction:column;gap:40px;max-width:780px">{intro}{s1}{s2}{s3}{s4}{s5}{s6}{s7}</div>' + bottom
    body = section(container(f'<div style="margin-bottom:40px">{tabs}</div><div style="display:grid;grid-template-columns:260px minmax(0, 1fr);gap:64px;align-items:start">{toc_html}<div>{content}</div></div>'),
                   pad='8px 0 96px')
    return wrap(header(t, 'download') + head + body + footer(t), 1440)


def page_lienhe(t):
    head = page_head('Liên hệ', 'Liên hệ Agentra', 'Gửi email cho chúng tôi, hoặc xin key ngay trong ứng dụng DocOps.')

    def contact_card(icon, title, value, sub, action, placeholder=False):
        val_style = f'font-size:20px;font-weight:600;color:{WARN_TEXT if placeholder else INK};line-height:1.3'
        return (f'<div style="display:flex;flex-direction:column;gap:14px;padding:26px;background:{CARD};border:1px solid {LINE};border-radius:12px">{icon_box(icon, 44)}'
                f'<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:{MUTED}">{title}</span>'
                f'<span style="{val_style}">{value}</span><span style="font-size:14.5px;line-height:1.5;color:{INK2}">{sub}</span></div>'
                f'<div style="margin-top:auto">{action}</div></div>')
    link = lambda label, icon: f'<a href="#" style="display:inline-flex;align-items:center;gap:6px;font-size:14.5px;font-weight:600;color:{ACCENT_S}">{ic(icon, 16)}{label}</a>'
    cards = (contact_card('mail', 'Email', 'info@agentra.io.vn', 'Câu hỏi về sản phẩm, xin key, báo lỗi và góp ý.', link('Sao chép địa chỉ', 'copy'))
             + contact_card('phone', 'Điện thoại / Zalo', '[Số điện thoại]', '[Giờ làm việc]', link('Mở Zalo', 'external'), placeholder=True)
             + contact_card('pin', 'Địa chỉ', 'Agentra JSC, Đà Nẵng', '[Địa chỉ đầy đủ], Đà Nẵng, Việt Nam', link('Mở Google Maps', 'external')))
    grid = f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px">{cards}</div>'
    block1 = section(container(grid), pad='8px 0 80px')

    def step_card(n, icon, title, desc):
        return (f'<div style="display:flex;flex-direction:column;gap:14px;padding:26px;background:{CARD};border:1px solid {LINE};border-radius:12px">'
                f'<div style="display:flex;align-items:center;justify-content:space-between">{icon_box(icon, 44)}<span style="font-size:13px;font-weight:700;color:{MUTED}">Bước {n}</span></div>'
                f'<h3 style="font-size:18px;font-weight:600;line-height:1.3">{title}</h3><p style="font-size:15px;line-height:1.6;color:{INK2}">{desc}</p></div>')
    steps = (step_card(1, 'download', 'Tải và cài DocOps', 'Chọn bản Windows hoặc macOS ở trang Tải về và cài theo hướng dẫn.')
             + step_card(2, 'key', 'Gửi đơn ngay trong app', 'Ở màn Kích hoạt chọn "Chưa có key (đăng ký mới)", điền tên đơn vị và người liên hệ rồi gửi.')
             + step_card(3, 'mail', 'Nhận key qua email', 'Agentra xét duyệt và gửi key dạng DOCOPS-XXXX-XXXX-XXXX về email đã khai. Nhập key là dùng được.'))
    note = f'<p style="font-size:15px;color:{INK2};margin-top:20px">Hoặc email cho chúng tôi kèm tên đơn vị và nhu cầu sử dụng, chúng tôi sẽ liên hệ lại.</p>'
    block2 = section(container(sec_head('Nhận key kích hoạt', 'Cách nhận key cho đơn vị của bạn', align='left')
                               + f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:24px;margin-top:40px">{steps}</div>' + note),
                     bg=CARD, extra=f'border-top:1px solid {LINE};border-bottom:1px solid {LINE}', pad='80px 0')
    items = ''.join(f'<li style="display:flex;gap:10px;align-items:flex-start;font-size:15.5px;line-height:1.55;color:{INK2}"><span style="color:{ACCENT};margin-top:2px">{ic("check", 18, sw=2)}</span><span>{x}</span></li>'
                    for x in ['Đang ở màn hình nào, bấm gì thì lỗi xảy ra', 'Thông báo lỗi hiện ra (kèm ảnh chụp màn hình nếu có)',
                              'Phiên bản Windows hoặc macOS, và loại chip nếu là máy Mac', 'Phiên bản DocOps (Cài đặt, thẻ Phiên bản)'])
    left = (f'<div style="display:flex;flex-direction:column;gap:16px">{sec_head("Hỗ trợ", "Báo lỗi và góp ý", align="left")}'
            f'<p style="font-size:16px;line-height:1.6;color:{INK2};max-width:520px">Khi gặp lỗi, gửi cho chúng tôi những thông tin sau để xử lý nhanh:</p>'
            f'<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:10px">{items}</ul></div>')
    right = (f'<div style="display:flex;flex-direction:column;gap:16px;padding:28px;background:{CARD};border:1px solid {LINE};border-radius:12px;align-self:start">'
             f'<div style="display:flex;align-items:center;gap:12px">{icon_box("bug", 40)}<b style="font-size:16px">Hai cách gửi</b></div>'
             f'<p style="font-size:15px;line-height:1.6;color:{INK2}">Email về info@agentra.io.vn, hoặc mở mục <b>Phản hồi</b> ngay trong app DocOps: phản hồi gửi từ app tự đính kèm phiên bản và nhật ký kỹ thuật.</p>'
             f'{btn("Gửi email báo lỗi", "primary", "mail", "md")}</div>')
    block3 = section(container(f'<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:64px;align-items:start">{left}{right}</div>'), pad='80px 0 96px')
    return wrap(header(t, 'contact') + head + block1 + block2 + block3 + footer(t), 1440)


def page_quytrinh(t):
    head = page_head('Quy trình', 'Văn bản được xử lý bởi các luồng AI. Cán bộ là người quyết định cuối cùng.',
                     'DocOps làm phần nặng: đọc, bóc tách, phân loại, tra cứu và soạn nháp. Cán bộ, những chuyên gia nghiệp vụ thực thụ, luôn là người cuối cùng quyết định nội dung được dùng.')
    steps = [('file', 'Nhập', 'OCR bản quét, nhận dạng con dấu và chữ ký, bóc số hiệu, ngày ký, cơ quan ban hành, trích yếu.'),
             ('tag', 'Phân loại', 'Xác định loại văn bản, chủ đề, hiệu lực và định tuyến vào đúng khu vực của kho.'),
             ('search', 'Tra cứu', 'Trả lời kèm trích dẫn nguồn cụ thể; chặn suy diễn khi thiếu căn cứ.'),
             ('graph', 'Tác động', 'Dò đồ thị quan hệ pháp lý: văn bản nào dẫn văn bản nào, căn cứ nào đã hết hiệu lực hoặc sắp thay đổi.'),
             ('pen', 'Soạn thảo', 'Sinh nháp theo mẫu Nghị định 30, kiểm thể thức, gợi ý thay căn cứ đã hết hiệu lực.'),
             ('user-check', 'Cán bộ kiểm &amp; duyệt', 'Con người xem, sửa, duyệt. AI chỉ hỗ trợ, không thay quyền quyết định.')]
    rows = ''
    for i, (icon, title, desc) in enumerate(steps):
        last = i == len(steps) - 1
        rows += (f'<div style="display:flex;gap:18px;padding:18px 18px;border-radius:12px;background:{SOFT if last else "transparent"};border:1px solid {SOFT_LINE if last else "transparent"}">'
                 f'<span style="width:44px;height:44px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;flex:none;background:{ACCENT if last else CARD2};border:1px solid {ACCENT if last else LINE};color:{"#ffffff" if last else ACCENT_S}">{ic(icon, 22)}</span>'
                 f'<div style="display:flex;flex-direction:column;gap:4px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:11.5px;font-weight:700;letter-spacing:.5px;color:{MUTED}">0{i + 1}</span>'
                 f'<h3 style="font-size:18px;font-weight:600">{title}</h3></div><p style="font-size:15px;line-height:1.6;color:{INK2}">{desc}</p></div></div>')
    dots = ''.join('<span style="width:8px;height:8px;border-radius:99px;background:#e0ddd4"></span>' for _ in range(3))
    frame = (f'<div style="position:sticky;top:24px;border:1px solid {LINE};border-radius:12px;background:{CARD2};box-shadow:0 24px 60px -30px rgba(30,52,19,.4);overflow:hidden">'
             f'<div style="display:flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-bottom:1px solid {LINE};background:{SIDEBAR}">{dots}<span style="margin-left:6px;font-size:12px;color:{MUTED}">DocOps · Đồ thị quan hệ pháp lý</span></div>'
             f'<img src="app-dothi.jpg" alt="" style="width:100%;height:auto"></div>')
    block1 = section(container(f'<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:56px;align-items:start"><div style="display:flex;flex-direction:column;gap:6px">{rows}</div>{frame}</div>'), pad='8px 0 96px')
    flows_ = [('Nhập', 'Hồ sơ số hoá'), ('Hỏi', 'Trả lời có căn cứ'), ('Thay đổi', 'Tác động + Nháp')]
    chips = ''.join(f'<div style="display:flex;align-items:center;gap:14px;padding:22px 24px;background:{CARD};border:1px solid {LINE};border-radius:12px">'
                    f'<span style="font-size:18px;font-weight:700">{a}</span><span style="color:{ACCENT}">{ic("arrow-right", 22)}</span><span style="font-size:18px;font-weight:600;color:{ACCENT_S}">{b}</span></div>' for a, b in flows_)
    block2 = section(container(sec_head('Ba luồng công việc', 'Một kho tri thức, ba việc thường ngày', align='left')
                               + f'<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:20px;margin-top:40px">{chips}</div>'),
                     bg=CARD, extra=f'border-top:1px solid {LINE};border-bottom:1px solid {LINE}', pad='80px 0')
    rel = [('book', 'Trích dẫn bắt buộc', 'Mọi câu trả lời nêu rõ nguồn: số hiệu, điều khoản, trang.'),
           ('user-check', 'Nội dung AI tự sinh phải duyệt', 'Nháp và tóm tắt ở trạng thái chờ; cán bộ đọc, sửa và duyệt trước khi dùng.'),
           ('laptop', 'Dữ liệu theo đơn vị', 'Mỗi đơn vị một key và một workspace riêng; văn bản gốc lưu tại máy.'),
           ('shield', 'Vì sao có bước con người', 'Văn bản hành chính có hệ quả pháp lý. AI hỗ trợ nhưng không thay phán đoán chuyên môn.')]
    rel_cards = ''.join(f'<div style="display:flex;flex-direction:column;gap:14px;padding:26px;background:{CARD};border:1px solid {LINE};border-radius:12px">{icon_box(icon)}'
                        f'<h3 style="font-size:18px;font-weight:600;line-height:1.3">{ti}</h3><p style="font-size:15px;line-height:1.6;color:{INK2}">{de}</p></div>' for icon, ti, de in rel)
    block3 = section(container(sec_head('Độ tin cậy nội dung', 'Tin được vì kiểm được', align='left')
                               + f'<div style="display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:20px;margin-top:40px">{rel_cards}</div>'), pad='80px 0 96px')
    return wrap(header(t, 'how') + head + block1 + block2 + block3 + cta(t) + footer(t), 1440)


# ── Ghi tệp ────────────────────────────────────────────────────────────────────
ARTBOARDS = [
    ('Main.dc.html', 'Trang chủ · Desktop 1440 (VI)', lambda: home_desktop(T['vi']), 1440, 6400),
    ('TrangChuMobile.dc.html', 'Trang chủ · Mobile 390 (VI)', lambda: home_mobile(T['vi']), 390, 7200),
    ('HomeEN.dc.html', 'Home · Desktop 1440 (EN)', lambda: home_desktop(T['en']), 1440, 6400),
    ('TaiVe.dc.html', 'Tải về (VI)', lambda: page_taive(T['vi']), 1440, 2300),
    ('CaiDatMacOS.dc.html', 'Hướng dẫn cài đặt · macOS (VI)', lambda: page_caidat(T['vi']), 1440, 3400),
    ('LienHe.dc.html', 'Liên hệ (VI)', lambda: page_lienhe(T['vi']), 1440, 1900),
    ('QuyTrinh.dc.html', 'Quy trình (VI)', lambda: page_quytrinh(T['vi']), 1440, 2700),
]


def main():
    heights = {}
    hp = os.path.join(OUT, 'heights.json')
    if os.path.exists(hp):
        with open(hp, encoding='utf-8') as f:
            heights = json.load(f)
    for name, _title, build, _w, _h in ARTBOARDS:
        html = build()
        assert '{{' not in html, f'{name}: còn lỗ template'
        with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
            f.write(html)
    # Bố cục canvas: hàng 1 = ba bản trang chủ; hàng 2 và 3 = trang con. Khoảng cách ≥ 80px ngang, ≥ 120px dọc.
    def h_of(name, default):
        v = heights.get(name)
        return int(v * 1.04) + 40 if v else default
    row1 = h_of('Main.dc.html', 6400)
    rowm = max(row1, h_of('TrangChuMobile.dc.html', 7200), h_of('HomeEN.dc.html', 6400))
    y2 = rowm + 200
    row2 = max(h_of('TaiVe.dc.html', 2300), h_of('CaiDatMacOS.dc.html', 3400))
    y3 = y2 + row2 + 200
    layout = {
        'Main.dc.html': (0, 0, 1440, h_of('Main.dc.html', 6400)),
        'TrangChuMobile.dc.html': (1540, 0, 390, h_of('TrangChuMobile.dc.html', 7200)),
        'HomeEN.dc.html': (2030, 0, 1440, h_of('HomeEN.dc.html', 6400)),
        'TaiVe.dc.html': (0, y2, 1440, h_of('TaiVe.dc.html', 2300)),
        'CaiDatMacOS.dc.html': (1540, y2, 1440, h_of('CaiDatMacOS.dc.html', 3400)),
        'LienHe.dc.html': (0, y3, 1440, h_of('LienHe.dc.html', 1900)),
        'QuyTrinh.dc.html': (1540, y3, 1440, h_of('QuyTrinh.dc.html', 2700)),
    }
    canvas = {
        'artboards': [{'file': n, 'title': ttl, 'x': layout[n][0], 'y': layout[n][1], 'w': layout[n][2], 'h': layout[n][3]}
                      for n, ttl, _b, _w, _h in ARTBOARDS],
        'annotations': [
            {'id': 'note-nguon', 'x': 0, 'y': -260, 'w': 520,
             'text': 'Landing page Agentra DocOps · bản thiết kế 16/09/2026\nMàu, bo góc, chữ lấy từ tokens.css của app; font Be Vietnam Pro. Ảnh app render từ artboard thiết kế desktop (sẽ thay bằng ảnh chụp app thật khi code).\nHàng trên: trang chủ VI desktop, VI mobile, EN desktop. Hai hàng dưới: Tải về, Cài đặt macOS, Liên hệ, Quy trình.'},
            {'id': 'note-hero', 'x': 1540, 'y': -200, 'w': 380,
             'text': 'Nút "Tải về cho macOS" đổi theo hệ điều hành của người xem (Windows / macOS); mặc định "Tải DocOps".'},
            {'id': 'note-lienhe', 'x': 0, 'y': y3 - 150, 'w': 460,
             'text': 'Cần PO điền: [Số điện thoại], link Zalo và [Địa chỉ đầy đủ] ở trang Liên hệ. Chưa có thì thẻ Điện thoại/Zalo tự ẩn trên site thật.'},
        ],
        'launch': {'view': 'canvas'},
    }
    with open(os.path.join(OUT, 'canvas.json'), 'w', encoding='utf-8') as f:
        json.dump(canvas, f, ensure_ascii=False, indent=2)
    print('wrote', len(ARTBOARDS), 'artboards + canvas.json', '(heights.json:', 'có' if heights else 'chưa', ')')


if __name__ == '__main__':
    main()
