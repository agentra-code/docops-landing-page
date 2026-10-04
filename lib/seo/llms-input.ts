import { PRIVACY } from '@/content/privacy'
import { getReleases, latestRelease } from '@/lib/releases'
import type { LlmsInput } from './llms'

/** Dữ liệu cần runtime của Next (feed phát hành, metadata trong MDX): tách khỏi llms.ts để llms.ts test được bằng vitest. */
export async function loadLlmsInput(): Promise<LlmsInput> {
  const [{ assets }, vi, en] = await Promise.all([getReleases(), PRIVACY.vi(), PRIVACY.en()])
  const meta = (m: MdxMeta) => ({ title: m.title, description: m.description ?? m.title })
  return { release: latestRelease(assets), privacy: { vi: meta(vi.meta), en: meta(en.meta) } }
}
