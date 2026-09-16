import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Section } from '@/components/ui/Section'
import { SectionHead } from './SectionHead'

const ITEMS: Array<{ key: 'w1' | 'w2' | 'w3' | 'w4'; icon: IconName }> = [
  { key: 'w1', icon: 'clock' },
  { key: 'w2', icon: 'book' },
  { key: 'w3', icon: 'archive' },
  { key: 'w4', icon: 'shield' },
]

export function Benefits() {
  const t = useTranslations('home.why')
  return (
    <Section className="border-y border-line bg-card">
      <Container>
        <SectionHead eyebrow={t('eyebrow')} title={t('h2')} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-5 lg:grid-cols-4">
          {ITEMS.map(({ key, icon }) => (
            <div key={key} className="flex gap-3.5 rounded-xl border border-line bg-card2 p-5 md:flex-col md:p-6">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong md:h-11 md:w-11 md:rounded-xl">
                <Icon name={icon} size={22} />
              </span>
              <div className="flex flex-col gap-1.5 md:gap-2.5">
                <h3 className="text-[17px] leading-snug font-semibold md:text-lg">{t(`${key}.title`)}</h3>
                <p className="text-[14.5px] leading-relaxed text-ink2 md:text-[15px]">{t(`${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
