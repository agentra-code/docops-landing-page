import { useLocale, useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { LogoMark } from '@/components/ui/Logo'
import { topicCopy, topicPage, topicsByGroup } from '@/content/topics'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { site } from '@/lib/site'
import { LocaleSwitcher } from './LocaleSwitcher'

const linkClass = 'text-[15px] text-ink2 transition-colors hover:text-ink'

export function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const tc = useTranslations('common')
  const locale = useLocale() as Locale
  const groups = topicsByGroup()
  const solutionIds = groups.filter((g) => g.group !== 'guide').flatMap((g) => g.ids)
  const guideIds = groups.find((g) => g.group === 'guide')?.ids ?? []
  return (
    <footer className="border-t border-line bg-sidebar pt-14 pb-8 md:pt-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:grid-cols-[1.5fr_repeat(5,minmax(0,1fr))]">
          <div className="flex max-w-[360px] flex-col gap-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 text-ink">
              <LogoMark size={26} />
              <span className="text-[17px] font-bold">{tc('siteName')}</span>
            </Link>
            <p className="text-[15px] leading-relaxed text-ink2">{t('tagline')}</p>
            <p className="text-sm text-muted">
              {site.company} · {site.city[locale]}, {site.country[locale]} · {site.email}
            </p>
          </div>
          <FooterColumn title={t('solutions')}>
            {solutionIds.map((id) => (
              <Link key={id} href={topicPage(id)} className={linkClass}>
                {topicCopy(locale, id).name}
              </Link>
            ))}
          </FooterColumn>
          {guideIds.length > 0 ? (
            <FooterColumn title={t('guides')}>
              {guideIds.map((id) => (
                <Link key={id} href={topicPage(id)} className={linkClass}>
                  {topicCopy(locale, id).name}
                </Link>
              ))}
            </FooterColumn>
          ) : null}
          <FooterColumn title={t('product')}>
            <Link href="/download" className={linkClass}>{tn('download')}</Link>
            <Link href={{ pathname: '/install/[os]', params: { os: 'macos' } }} className={linkClass}>{t('installMacos')}</Link>
            <Link href={{ pathname: '/install/[os]', params: { os: 'windows' } }} className={linkClass}>{t('installWindows')}</Link>
            <Link href="/how-it-works" className={linkClass}>{tn('howItWorks')}</Link>
          </FooterColumn>
          <FooterColumn title={t('trust')}>
            <Link href="/ai-transparency" className={linkClass}>{tn('transparency')}</Link>
            <Link href="/privacy" className={linkClass}>{t('privacy')}</Link>
          </FooterColumn>
          <FooterColumn title={t('company')}>
            <a href={site.companyUrl} className={linkClass} rel="noopener">{site.company}</a>
            <Link href="/contact" className={linkClass}>{tn('contact')}</Link>
            <a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a>
          </FooterColumn>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[13.5px] text-muted">{t('copyright', { year: 2026 })}</span>
          <LocaleSwitcher />
        </div>
      </Container>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] font-bold tracking-[0.5px] text-muted uppercase">{title}</span>
      {children}
    </div>
  )
}
