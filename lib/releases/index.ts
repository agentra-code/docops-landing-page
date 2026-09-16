import { cache } from 'react'
import { site } from '@/lib/site'
import { fetchFeed } from './feed'
import { parseFeeds } from './parse'
import { releaseSnapshot } from './snapshot'
import type { Platform, ReleaseAsset, ReleaseInfo } from './types'

export type { FeedSource, Platform, ReleaseAsset, ReleaseInfo } from './types'

/** Tải feed thật (ISR 10 phút), từng tệp lỗi thì dùng snapshot cho tệp đó. Mỗi lần render chỉ gọi một lần (React.cache). */
export const getReleases = cache(async (): Promise<ReleaseInfo> => {
  const base = site.feedUrl()
  const [windows, mac] = await Promise.all([fetchFeed(`${base}latest.yml`), fetchFeed(`${base}latest-mac.yml`)])
  return {
    assets: parseFeeds({ windows: windows ?? releaseSnapshot.windows, mac: mac ?? releaseSnapshot.mac }, base),
    source: { windows: windows ? 'feed' : 'snapshot', mac: mac ? 'feed' : 'snapshot' },
  }
})

export function findAsset(assets: ReleaseAsset[], platform: Platform): ReleaseAsset | undefined {
  return assets.find((a) => a.platform === platform)
}

/** Phiên bản và ngày mới nhất trong các tệp (Windows và macOS có thể phát hành lệch nhau). */
export function latestRelease(assets: ReleaseAsset[]): { version: string; releaseDate: string } | null {
  if (assets.length === 0) return null
  const newest = [...assets].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0]
  return { version: newest.version, releaseDate: newest.releaseDate }
}
