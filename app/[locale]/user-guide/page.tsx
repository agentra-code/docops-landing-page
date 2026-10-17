import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Toc } from '@/components/guide/Toc'
import { JsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { USER_GUIDE } from '@/content/guide'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import { breadcrumb, howTo } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/seo/urls'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const { meta } = await USER_GUIDE[locale]()
  return buildMetadata({ locale, page: '/user-guide', title: meta.title, description: meta.description ?? meta.title })
}

/**
 * Hướng dẫn sử dụng (spec Dự án 2 §5). Cùng khung với trang cài đặt: mục lục bên trái, mỗi mục là một `<Step>` mang
 * `id` trong `GUIDE_SECTION_IDS` — app desktop mở trang này kèm `#<id>` của đúng mục, nên tiêu đề mục có `scroll-mt`.
 */
export default async function UserGuidePage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale
  const [{ default: Guide, meta }, t, ti, tc] = await Promise.all([
    USER_GUIDE[locale](),
    getTranslations('guide'),
    getTranslations('install'),
    getTranslations('common'),
  ])
  const toc = meta.toc ?? []
  const crumbs = [
    { name: tc('siteName'), url: absoluteUrl(locale, '/') },
    { name: meta.title, url: absoluteUrl(locale, '/user-guide') },
  ]
  return (
    <main id="main" className="flex-1">
      <section className="bg-[radial-gradient(900px_300px_at_20%_-80px,#eff5e3_0%,rgba(239,245,227,0)_70%)] pt-10 pb-8 md:pt-14 md:pb-10">
        <Container className="flex flex-col gap-3">
          <nav aria-label={t('breadcrumbNav')} className="flex items-center gap-2 text-[13.5px] text-muted">
            <Link href="/" className="hover:text-ink">{t('breadcrumbHome')}</Link>
            <Icon name="chevron-right" size={14} />
            <span className="text-ink2">{t('breadcrumbGuide')}</span>
          </nav>
          <span className="text-[13px] font-bold tracking-[0.6px] text-accent-strong uppercase">{t('eyebrow')}</span>
          <h1 className="max-w-[900px] text-[32px] leading-[1.12] font-bold tracking-[-0.02em] text-balance md:text-[44px] md:leading-[1.1]">
            {meta.title}
          </h1>
          <p className="text-base text-ink2 md:text-lg">
            {meta.minutes ? `${ti('minutes', { n: meta.minutes })} · ` : ''}
            {meta.updated ? ti('updated', { date: formatDate(meta.updated, locale) }) : ''}
          </p>
        </Container>
      </section>
      <section className="pb-16 md:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:self-start">
            <Toc items={toc} />
          </aside>
          <article className="flex max-w-[780px] min-w-0 flex-col gap-8 md:gap-10">
            <Guide />
            <div className="flex flex-col gap-4 rounded-xl border border-accent-line bg-accent-soft p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <div className="flex flex-col gap-1">
                <b className="text-base">{t('bottom.title')}</b>
                <span className="text-[14.5px] text-ink2">{t('bottom.body')}</span>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <ButtonLink href="/download" icon="download">{t('bottom.download')}</ButtonLink>
                <ButtonLink href={{ pathname: '/install/[os]', params: { os: 'macos' } }} variant="secondary" icon="arrow-right" iconAfter>
                  {t('bottom.install')}
                </ButtonLink>
              </div>
            </div>
          </article>
        </Container>
      </section>
      <JsonLd data={breadcrumb(crumbs)} />
      <JsonLd data={howTo({ name: meta.title, description: meta.description ?? meta.title, steps: toc.map((s) => ({ name: s.label, text: s.label })) })} />
    </main>
  )
}
