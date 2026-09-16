import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHead } from './SectionHead'

const FLOWS = [
  { key: 'f1', image: '/images/product/khovanban.webp' },
  { key: 'f2', image: '/images/product/tracuu.webp' },
  { key: 'f3', image: '/images/product/soanthao.webp' },
] as const

export function CoreFlows() {
  const t = useTranslations('home.flows')
  return (
    <Section>
      <Container>
        <SectionHead eyebrow={t('eyebrow')} title={t('h2')} lead={t('lead')} />
        <div className="mt-8 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {FLOWS.map(({ key, image }, i) => (
            <article key={key} className="flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="border-b border-line bg-sidebar px-4 pt-4 md:px-5 md:pt-5">
                <div className="aspect-[342/214] overflow-hidden rounded-t-lg border border-b-0 border-line bg-card2">
                  <Image
                    src={image}
                    alt={t(`${key}.title`)}
                    width={1520}
                    height={950}
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="h-auto w-[152%] max-w-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2.5 px-5 pt-5 pb-6 md:px-6">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-[13px] font-bold text-accent-strong">
                  {i + 1}
                </span>
                <h3 className="text-xl leading-snug font-semibold">{t(`${key}.title`)}</h3>
                <p className="text-[15.5px] leading-relaxed text-ink2">{t(`${key}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
