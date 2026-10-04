import { loadLlmsInput } from '@/lib/seo/llms-input'
import { llmsFullTxt } from '@/lib/seo/llms'

export const revalidate = 600

export async function GET() {
  return new Response(llmsFullTxt(await loadLlmsInput()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
