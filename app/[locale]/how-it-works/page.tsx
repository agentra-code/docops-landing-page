import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { FinalCta } from '@/components/home/FinalCta'
import { SectionHead } from '@/components/home/SectionHead'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Section } from '@/components/ui/Section'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import { breadcrumb } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/seo/urls'

const STEPS: Array<{ key: 's1' | 's2' | 's3' | 's4' | 's5' | 's6'; icon: IconName }> = [
  { key: 's1', icon: 'file' },
  { key: 's2', icon: 'tag' },
  { key: 's3', icon: 'search' },
  { key: 's4', icon: 'graph' },
  { key: 's5', icon: 'pen' },
  { key: 's6', icon: 'user-check' },
]
const RELIABILITY: Array<{ key: 'r1' | 'r2' | 'r3' | 'r4'; icon: IconName }> = [
  { key: 'r1', icon: 'book' },
  { key: 'r2', icon: 'user-check' },
  { key: 'r3', icon: 'laptop' },
  { key: 'r4', icon: 'shield' },
]

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('howItWorks.meta')
  return buildMetadata({ locale, page: '/how-it-works', title: t('title'), description: t('description') })
}

export default async function HowItWorksPage() {
  const locale = (await getLocale()) as Locale
  const [t, tc] = await Promise.all([getTranslations('howItWorks'), getTranslations('common')])
  return (
    <main id="main" className="flex-1">
      <section className="bg-[radial-gradient(900px_300px_at_20%_-80px,#eff5e3_0%,rgba(239,245,227,0)_70%)] pt-12 pb-10 md:pt-16 md:pb-12">
        <Container>
          <SectionHead as="h1" align="left" eyebrow={t('eyebrow')} title={t('h1')} lead={t('lead')} />
        </Container>
      </section>
      <section className="pb-16 md:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <ol className="flex flex-col gap-1.5">
            {STEPS.map(({ key, icon }, i) => {
              const last = i === STEPS.length - 1
              return (
                <li
                  key={key}
                  className={cn('flex gap-4 rounded-xl border p-4', last ? 'border-accent-line bg-accent-soft' : 'border-transparent')}
                >
                  <span
                    className={cn(
                      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                      last ? 'border-accent bg-accent text-white' : 'border-line bg-card2 text-accent-strong',
                    )}
                  >
                    <Icon name={icon} size={22} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11.5px] font-bold tracking-[0.5px] text-muted">0{i + 1}</span>
                      <h2 className="text-lg font-semibold">{t(`${key}.title`)}</h2>
                    </div>
                    <p className="text-[15px] leading-relaxed text-ink2">{t(`${key}.desc`)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="overflow-hidden rounded-xl border border-line bg-card2 shadow-[0_24px_60px_-30px_rgba(30,52,19,0.4)] lg:sticky lg:top-24 lg:self-start">
            <div className="flex h-9 items-center gap-1.5 border-b border-line bg-sidebar px-3.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-[#e0ddd4]" />
              ))}
              <span className="ml-1.5 text-xs text-muted">{t('imageTitle')}</span>
            </div>
            <Image src="/images/product/dothi.webp" alt={t('imageAlt')} width={1520} height={950} sizes="(min-width: 1024px) 600px, 100vw" className="h-auto w-full" />
          </div>
        </Container>
      </section>
      <Section className="border-y border-line bg-card">
        <Container>
          <SectionHead align="left" eyebrow={t('flows.eyebrow')} title={t('flows.h2')} />
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {(['f1', 'f2', 'f3'] as const).map((key) => (
              <div key={key} className="flex items-center gap-3.5 rounded-xl border border-line bg-card2 px-6 py-5">
                <span className="text-lg font-bold">{t(`flows.${key}.from`)}</span>
                <Icon name="arrow-right" size={22} className="text-accent" />
                <span className="text-lg font-semibold text-accent-strong">{t(`flows.${key}.to`)}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHead align="left" eyebrow={t('reliability.eyebrow')} title={t('reliability.h2')} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {RELIABILITY.map(({ key, icon }) => (
              <div key={key} className="flex flex-col gap-3 rounded-xl border border-line bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                  <Icon name={icon} size={22} />
                </span>
                <h3 className="text-lg leading-snug font-semibold">{t(`reliability.${key}.title`)}</h3>
                <p className="text-[15px] leading-relaxed text-ink2">{t(`reliability.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <FinalCta />
      <JsonLd data={breadcrumb([{ name: tc('siteName'), url: absoluteUrl(locale, '/') }, { name: t('eyebrow'), url: absoluteUrl(locale, '/how-it-works') }])} />
    </main>
  )
}
