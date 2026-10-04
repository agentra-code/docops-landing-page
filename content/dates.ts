/**
 * Ngày nội dung thay đổi THẬT của từng trang (sitemap lastmod, JSON-LD dateModified, dòng "Cập nhật ngày").
 * Chỉ đổi khi nội dung đổi; trang không có ở đây thì sitemap bỏ lastmod thay vì ghi giờ build.
 * Hướng dẫn cài đặt và chính sách bảo mật còn ghi `updated` trong MDX: tests/unit/content.test.ts bắt hai nơi phải khớp.
 */
export const CONTENT_UPDATED = {
  install: { macos: '2026-09-15', windows: '2026-09-15' },
  privacy: '2026-09-15',
  aiTransparency: '2026-09-15',
} as const
