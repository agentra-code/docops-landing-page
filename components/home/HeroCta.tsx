'use client'

import { DownloadLink } from '@/components/download/DownloadLink'
import { ButtonLink } from '@/components/ui/Button'
import { track } from '@/lib/analytics'
import type { ReleaseAsset } from '@/lib/releases/types'
import { usePlatform } from '@/lib/usePlatform'

/**
 * Nút chính của hero đổi theo hệ điều hành người xem. Windows tải thẳng .exe; macOS dẫn tới trang Tải về
 * vì trình duyệt không phân biệt được chip Apple Silicon/Intel (spec §6.2).
 */
export function HeroCta({
  assets,
  labels,
}: {
  assets: ReleaseAsset[]
  labels: { default: string; mac: string; windows: string; secondary: string }
}) {
  const os = usePlatform()
  const windows = assets.find((a) => a.platform === 'windows-x64')
  const primary =
    os === 'windows' && windows ? (
      <DownloadLink asset={windows} location="hero" size="lg" className="w-full sm:w-auto">
        {labels.windows}
      </DownloadLink>
    ) : (
      <ButtonLink
        href="/download"
        size="lg"
        icon="download"
        className="w-full sm:w-auto"
        onClick={() => track({ name: 'cta_click', id: os === 'macos' ? 'hero_download_mac' : 'hero_download', location: 'hero' })}
      >
        {os === 'macos' ? labels.mac : labels.default}
      </ButtonLink>
    )
  return (
    <div className="mt-1.5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      {primary}
      <ButtonLink
        href="/how-it-works"
        variant="secondary"
        size="lg"
        icon="arrow-right"
        iconAfter
        className="w-full sm:w-auto"
        onClick={() => track({ name: 'cta_click', id: 'hero_how_it_works', location: 'hero' })}
      >
        {labels.secondary}
      </ButtonLink>
    </div>
  )
}
