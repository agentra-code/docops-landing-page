import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { LogoMark } from '@/components/ui/Logo'
import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'

export function Header() {
  const t = useTranslations('common')
  // Nền mờ nằm ở ::before: backdrop-filter (cũng như transform, filter) trên chính <header> biến nó thành khung chứa
  // của phần tử `fixed` bên trong, panel menu mobile bị co về cao 64px của header.
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-line before:absolute before:inset-0 before:-z-10 before:bg-card/95 before:backdrop-blur md:h-[72px]">
      <Container className="flex h-full items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <LogoMark size={26} />
          <span className="text-[17px] font-bold tracking-[0.2px]">{t('siteName')}</span>
        </Link>
        <nav aria-label={t('mainNav')} className="ml-auto hidden items-center gap-7 md:flex">
          <NavLinks />
        </nav>
        <div className="hidden items-center gap-3.5 md:flex">
          <LocaleSwitcher />
          <ButtonLink href="/download" size="sm" icon="download">
            {t('download')}
          </ButtonLink>
        </div>
        <div className="ml-auto md:hidden">
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
