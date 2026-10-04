import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { topicCopy, type TopicId } from '@/content/topics'
import type { Locale } from '@/i18n/routing'

export const OG_SIZE = { width: 1200, height: 630 }

async function fonts() {
  const dir = join(process.cwd(), 'assets/fonts')
  const [bold, regular] = await Promise.all([readFile(join(dir, 'BeVietnamPro-Bold.ttf')), readFile(join(dir, 'BeVietnamPro-Regular.ttf'))])
  return [
    { name: 'BeVietnamPro', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'BeVietnamPro', data: regular, weight: 400 as const, style: 'normal' as const },
  ]
}

/** Ảnh Open Graph 1200×630: nền xanh đậm, logo, tiêu đề và dòng phụ (spec §9). */
export async function ogImage({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #1e3413 0%, #2c4d1d 100%)',
          color: '#ffffff',
          fontFamily: 'BeVietnamPro',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="56" height="48" viewBox="0 0 415 354" fill="none">
            <path d="M213 0 L270 103 L110 354 L0 354 Z" fill="#8cbf3c" />
            <path d="M288 133 L415 354 L302 354 L241 255 L209 253 Z" fill="#6a9c39" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: 0.5 }}>Agentra DocOps</span>
          {badge ? (
            <span
              style={{
                marginLeft: 16,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(140,191,60,0.22)',
                border: '1px solid rgba(140,191,60,0.6)',
                color: '#d7ecb0',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.4, color: 'rgba(255,255,255,0.8)', maxWidth: 960 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: 'rgba(255,255,255,0.65)' }}>
          <span>docops.agentra.io.vn</span>
          <span>Windows · macOS</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  )
}

/** Ảnh chia sẻ của trang chủ đề: tiêu đề ngắn trong `share` để không tràn dòng. */
export function topicOgImage(locale: Locale, id: TopicId) {
  const { share } = topicCopy(locale, id)
  return ogImage({ title: share.title, subtitle: share.subtitle })
}
