import type { MdxModule } from '@/content/install'

/**
 * Mười hai mục của trang Hướng dẫn sử dụng, đúng thứ tự trên trang. Mỗi id là `id` của một tiêu đề mục (`<Step id>`)
 * và là phần `#…` mà app desktop gắn vào link mở trang này. Desktop ghim CÙNG chuỗi ở `GUIDE_SECTIONS`
 * (`contracts/ipc.ts`), nên đổi một id ở đây mà không đổi bên kia thì link trong app mở đầu trang thay vì đúng mục
 * (spec Dự án 2 §7.4, X1; `tests/unit/guides.test.ts`).
 */
export const GUIDE_SECTION_IDS = [
  'bat-dau',
  'nap-van-ban',
  'kho-van-ban',
  'tra-cuu',
  'hoi-ai',
  'ra-soat',
  'do-thi',
  'soan-thao',
  'cai-dat',
  'sao-luu',
  'ket-noi-agent',
  'cau-hoi-thuong-gap',
] as const

export type GuideSectionId = (typeof GUIDE_SECTION_IDS)[number]

/** Bảng import tĩnh để Turbopack phân tích được, như `content/install/index.ts`. */
export const USER_GUIDE: Record<'vi' | 'en', () => Promise<MdxModule>> = {
  vi: () => import('./vi.mdx'),
  en: () => import('./en.mdx'),
}
