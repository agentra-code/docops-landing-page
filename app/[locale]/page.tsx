import { getLocale, getTranslations } from 'next-intl/server'
import { Benefits } from '@/components/home/Benefits'
import { CoreFlows } from '@/components/home/CoreFlows'
import { DownloadBlock } from '@/components/home/DownloadBlock'
import { FAQ_KEYS, FaqSection } from '@/components/home/FaqSection'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { PipelineStrip } from '@/components/home/PipelineStrip'
import { TrustGrid } from '@/components/home/TrustGrid'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Locale } from '@/i18n/routing'
import { getReleases, latestRelease } from '@/lib/releases'
import { faqPage, organization, softwareApplication } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/seo/urls'

export default async function HomePage() {
  const locale = (await getLocale()) as Locale
  const [{ assets }, t] = await Promise.all([getReleases(), getTranslations('home.faq')])
  const latest = latestRelease(assets)
  return (
    <main id="main" className="flex-1">
      <Hero assets={assets} version={latest?.version ?? '1.0.0'} />
      <PipelineStrip />
      <CoreFlows />
      <Benefits />
      <TrustGrid />
      <DownloadBlock assets={assets} locale={locale} latest={latest} />
      <FaqSection />
      <FinalCta />
      <JsonLd data={organization()} />
      <JsonLd data={softwareApplication(assets, locale, absoluteUrl(locale, '/download'))} />
      <JsonLd data={faqPage(FAQ_KEYS.map((k) => ({ q: t(`${k}.q`), a: t(`${k}.a`) })))} />
    </main>
  )
}
