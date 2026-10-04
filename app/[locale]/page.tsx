import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Benefits } from '@/components/home/Benefits'
import { CoreFlows } from '@/components/home/CoreFlows'
import { DownloadBlock } from '@/components/home/DownloadBlock'
import { faqItems, FaqSection } from '@/components/home/FaqSection'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { PipelineStrip } from '@/components/home/PipelineStrip'
import { TrustGrid } from '@/components/home/TrustGrid'
import { JsonLd } from '@/components/seo/JsonLd'
import { TopicHub } from '@/components/topic/TopicHub'
import type { Locale } from '@/i18n/routing'
import { getReleases, latestRelease } from '@/lib/releases'
import { brand } from '@/lib/seo/brand'
import { faqPage, organization, softwareApplication, website } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('home.meta')
  return buildMetadata({ locale, page: '/', title: t('title'), description: brand.description[locale], absoluteTitle: true })
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale
  const [{ assets }, t, th] = await Promise.all([getReleases(), getTranslations('home.faq'), getTranslations('topics.hub')])
  const latest = latestRelease(assets)
  return (
    <main id="main" className="flex-1">
      <Hero assets={assets} version={latest?.version ?? '1.0.0'} />
      <PipelineStrip />
      <CoreFlows />
      <TopicHub eyebrow={th('eyebrow')} title={th('h2')} lead={th('lead')} className="border-t border-line" />
      <Benefits />
      <TrustGrid />
      <DownloadBlock assets={assets} locale={locale} latest={latest} />
      <FaqSection />
      <FinalCta />
      <JsonLd data={organization(locale)} />
      <JsonLd data={website(locale)} />
      <JsonLd data={softwareApplication(assets, locale)} />
      <JsonLd data={faqPage(faqItems(t as unknown as Parameters<typeof faqItems>[0], locale))} />
    </main>
  )
}
