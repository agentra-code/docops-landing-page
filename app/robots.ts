import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * Bot tìm kiếm AI, bot người dùng gọi tới và bot huấn luyện đều được đọc toàn site (PO chọn 2026-10-04: cho phép
 * cả bot huấn luyện để các mô hình biết tới DocOps). Mỗi bot có nhóm riêng để chủ ý hiện rõ trong robots.txt.
 *
 * LƯU Ý: bot có nhóm riêng sẽ BỎ QUA nhóm `*`. Thêm `Disallow` vào `*` thì phải lặp lại nó trong `AI_BOTS`.
 */
export const AI_BOTS = [
  // OpenAI: chỉ mục ChatGPT search, lượt đọc do người dùng gọi, huấn luyện
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  // Anthropic
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google Gemini (huấn luyện và grounding; không ảnh hưởng Google Search), Apple, Common Crawl
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_BOTS, allow: '/' },
    ],
    sitemap: `${site.siteUrl()}/sitemap.xml`,
  }
}
