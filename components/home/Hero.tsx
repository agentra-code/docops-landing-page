import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import type { ReleaseAsset } from '@/lib/releases/types'
import { HeroCta } from './HeroCta'

export function Hero({ assets, version }: { assets: ReleaseAsset[]; version: string }) {
  const t = useTranslations('home.hero')
  const trust = [t('trust1'), t('trust2'), t('trust3')]
  return (
    <section className="overflow-hidden bg-[radial-gradient(1000px_480px_at_50%_-60px,#eff5e3_0%,rgba(239,245,227,0)_70%)] pt-10 md:pt-20">
      <Container className="flex flex-col items-center gap-5 text-center">
        <span className="text-[13px] font-bold tracking-[0.6px] text-accent-strong uppercase">{t('eyebrow')}</span>
        <h1 className="max-w-[940px] text-[34px] leading-[1.12] font-bold tracking-[-0.02em] text-balance md:text-[58px] md:leading-[1.08]">
          {t('h1')}
        </h1>
        <p className="max-w-[800px] text-base leading-relaxed text-ink2 text-pretty md:text-[19px]">{t('sub')}</p>
        <HeroCta
          assets={assets}
          labels={{ default: t('ctaDefault'), mac: t('ctaMac'), windows: t('ctaWindows'), secondary: t('cta2') }}
        />
        <p className="text-[13.5px] text-muted">{t('meta', { version })}</p>
        <ul className="flex flex-col gap-2 sm:flex-row sm:gap-7">
          {trust.map((item) => (
            <li key={item} className="inline-flex items-center gap-2 text-[14.5px] font-normal text-ink2">
              <Icon name="check" size={18} strokeWidth={2} className="text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
      <div className="mx-auto mt-10 w-[calc(100%-32px)] max-w-[1080px] overflow-hidden rounded-t-[14px] border border-b-0 border-line bg-card2 shadow-[0_30px_70px_-30px_rgba(30,52,19,0.45)] md:mt-14">
        <div className="flex h-9 items-center gap-2 border-b border-line bg-sidebar px-4 md:h-10">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-[#e0ddd4]" />
          ))}
          <span className="ml-2 text-[12.5px] text-muted">{t('windowTitle')}</span>
        </div>
        <Image
          src="/images/product/rasoat.webp"
          alt={t('imageAlt')}
          width={2000}
          height={1250}
          priority
          sizes="(min-width: 1120px) 1078px, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  )
}
