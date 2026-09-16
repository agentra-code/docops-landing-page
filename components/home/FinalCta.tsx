import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function FinalCta() {
  const t = useTranslations('home.cta')
  return (
    <section className="bg-brand-deep py-14 md:py-22">
      <Container className="flex flex-col items-center gap-4 text-center md:gap-5">
        <h2 className="max-w-[760px] text-[28px] leading-[1.18] font-bold tracking-[-0.01em] text-white text-balance md:text-[38px] md:leading-[1.15]">
          {t('h2')}
        </h2>
        <p className="max-w-[640px] text-[15.5px] leading-relaxed text-white/78 md:text-[17px]">{t('sub')}</p>
        <div className="mt-2 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
          <ButtonLink href="/download" variant="white" size="lg" icon="download" className="w-full sm:w-auto">
            {t('b1')}
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost-white" size="lg" className="w-full sm:w-auto">
            {t('b2')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
