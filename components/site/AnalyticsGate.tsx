'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { consentBannerEnabled } from '@/lib/consent'
import { useConsent } from '@/lib/useConsent'

/** Vercel Analytics và Speed Insights luôn bật (không cookie); GA4 chỉ khi có ID và (không hỏi hoặc đã đồng ý). */
export function AnalyticsGate({ gaId }: { gaId?: string }) {
  const [consent] = useConsent()
  const gaAllowed = Boolean(gaId) && (!consentBannerEnabled() || consent === 'granted')
  return (
    <>
      <Analytics />
      <SpeedInsights />
      {gaAllowed && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  )
}
