import { loadLlmsInput } from '@/lib/seo/llms-input'
import { llmsTxt } from '@/lib/seo/llms'

// Tái tạo cùng nhịp với feed phát hành (10 phút) để phiên bản mới nhất luôn đúng.
export const revalidate = 600

export async function GET() {
  return new Response(llmsTxt(await loadLlmsInput()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
