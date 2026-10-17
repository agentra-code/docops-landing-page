/**
 * Ngày nội dung thay đổi THẬT của từng trang (sitemap lastmod, JSON-LD dateModified, dòng "Cập nhật ngày").
 * Chỉ đổi khi nội dung đổi; trang không có ở đây thì sitemap bỏ lastmod thay vì ghi giờ build.
 * Hướng dẫn cài đặt, hướng dẫn sử dụng và chính sách bảo mật còn ghi `updated` trong MDX: tests/unit/content.test.ts bắt hai nơi phải khớp.
 */
export const CONTENT_UPDATED = {
  install: { macos: '2026-10-18', windows: '2026-10-18' },
  privacy: '2026-09-15',
  aiTransparency: '2026-10-04',
  guide: '2026-10-17',
} as const
