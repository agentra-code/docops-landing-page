import type { IconName } from '@/components/ui/icons'
import type { Locale, PageKey } from '@/i18n/routing'
import { TOPICS_EN } from './en'
import { TOPICS_VI } from './vi'

/**
 * Trang chủ đề (pillar): mỗi trang sở hữu MỘT từ khoá chính (bản đồ ở lib/seo/brand.ts). Danh sách này sinh route,
 * sitemap, footer, thẻ hub trên trang chủ, llms.txt, JSON-LD và link "Xem thêm". Thêm chủ đề = thêm một phần tử
 * ở đây + một khoá trong `routing.pathnames` + thư mục route mỏng trong app/[locale].
 */
export const TOPIC_IDS = ['legal-basis-review', 'decree-30-drafting', 'ai-document-search', 'ai-for-universities', 'ai-for-organizations', 'administrative-document-types', 'administrative-document-format', 'docops-vs-chatgpt'] as const
export type TopicId = (typeof TOPIC_IDS)[number]

export const topicPage = (id: TopicId) => `/${id}` as const satisfies PageKey
export const isTopicPage = (page: string): page is `/${TopicId}` => TOPIC_IDS.some((id) => page === `/${id}`)

/** Nhóm thẻ trên hub và footer: tính năng, theo loại đơn vị, kiến thức văn thư (thứ tự hiển thị). */
export const TOPIC_GROUPS = ['feature', 'audience', 'guide'] as const
export type TopicGroup = (typeof TOPIC_GROUPS)[number]

/** Dữ liệu không đổi theo ngôn ngữ. `updated` là ngày nội dung đổi thật (sitemap, JSON-LD, dòng "Cập nhật"). */
export const TOPIC_META: Record<TopicId, { icon: IconName; image: string; updated: string; group: TopicGroup }> = {
  'legal-basis-review': { icon: 'graph', image: '/images/product/rasoat.webp', updated: '2026-10-04', group: 'feature' },
  'decree-30-drafting': { icon: 'pen', image: '/images/product/soanthao.webp', updated: '2026-10-04', group: 'feature' },
  'ai-document-search': { icon: 'search', image: '/images/product/tracuu.webp', updated: '2026-10-04', group: 'feature' },
  'ai-for-universities': { icon: 'book', image: '/images/product/khovanban.webp', updated: '2026-10-04', group: 'audience' },
  'ai-for-organizations': { icon: 'archive', image: '/images/product/dothi.webp', updated: '2026-10-08', group: 'audience' },
  'administrative-document-types': { icon: 'file', image: '/images/product/soanthao.webp', updated: '2026-10-08', group: 'guide' },
  'administrative-document-format': { icon: 'tag', image: '/images/product/soanthao.webp', updated: '2026-10-08', group: 'guide' },
  'docops-vs-chatgpt': { icon: 'message', image: '/images/product/tracuu.webp', updated: '2026-10-08', group: 'guide' },
}

/** Trang chủ đề theo nhóm, đúng thứ tự TOPIC_GROUPS rồi TOPIC_IDS; bỏ trang `exclude` và nhóm rỗng. */
export function topicsByGroup(exclude?: TopicId): Array<{ group: TopicGroup; ids: TopicId[] }> {
  return TOPIC_GROUPS.map((group) => ({ group, ids: TOPIC_IDS.filter((id) => id !== exclude && TOPIC_META[id].group === group) })).filter(
    (g) => g.ids.length > 0,
  )
}

/** Link trong thân bài: trang chủ đề khác (anchor = từ khoá chính của nó), trang sản phẩm, hoặc nguồn bên ngoài. */
export type TopicLink =
  | { topic: TopicId }
  | { page: Exclude<PageKey, '/install/[os]'>; label: string }
  | { href: `https://${string}`; label: string }

export type TopicBlock = {
  h2: string
  paras?: string[]
  /** Danh sách; `title` in đậm đầu dòng. */
  items?: Array<{ title?: string; text: string; link?: TopicLink }>
  ordered?: boolean
}

export type TopicCopy = {
  /** Từ khoá chính, dạng tên: nhãn thẻ, breadcrumb, footer, anchor text từ trang khác. */
  name: string
  /** ≤ 43 ký tự: template nối thêm " · Agentra DocOps" (17). */
  metaTitle: string
  /** 110–160 ký tự. */
  description: string
  /** Từ khoá chính đứng đầu (JSON-LD keywords). */
  keywords: string[]
  eyebrow: string
  h1: string
  lead: string
  /** Mô tả trên thẻ hub (trang chủ, Quy trình, "Xem thêm"). */
  card: string
  /** Hộp "Tóm lại": toàn bộ câu trả lời trong 2–3 câu. */
  inShort: string
  /** Mục định nghĩa: câu đầu là định nghĩa độc lập, in đậm thuật ngữ (câu AI và featured snippet trích). */
  definition: { h2: string; term: string; rest: string; paras?: string[] }
  imageAlt: string
  table?: { h2: string; caption: string; head: string[]; rows: string[][] }
  blocks: TopicBlock[]
  faq: Array<{ q: string; a: string }>
  /** Ảnh chia sẻ 1200×630: tiêu đề ngắn để không tràn. */
  share: { title: string; subtitle: string }
}

export const TOPICS: Record<Locale, Record<TopicId, TopicCopy>> = { vi: TOPICS_VI, en: TOPICS_EN }

export function topicCopy(locale: Locale, id: TopicId): TopicCopy {
  return TOPICS[locale][id]
}
