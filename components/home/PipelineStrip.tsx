import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

const STEPS: Array<{ key: 's1' | 's2' | 's3' | 's4' | 's5' | 's6'; icon: IconName }> = [
  { key: 's1', icon: 'file' },
  { key: 's2', icon: 'tag' },
  { key: 's3', icon: 'search' },
  { key: 's4', icon: 'graph' },
  { key: 's5', icon: 'pen' },
  { key: 's6', icon: 'user-check' },
]

export function PipelineStrip() {
  const t = useTranslations('home.pipeline')
  return (
    <section className="border-y border-line bg-card py-7 md:py-10">
      <Container>
        <ol className="flex flex-col gap-1 md:flex-row md:items-stretch">
          {STEPS.map(({ key, icon }, i) => {
            const last = i === STEPS.length - 1
            return (
              <li key={key} className="contents">
                <div
                  className={cn(
                    'flex items-center gap-3.5 rounded-xl px-3 py-3 md:flex-1 md:flex-col md:justify-start md:gap-2.5 md:px-2 md:py-4 md:text-center',
                    last && 'bg-accent-soft',
                  )}
                >
                  <span className="w-6 text-[11.5px] font-bold tracking-[0.5px] text-muted md:w-auto">0{i + 1}</span>
                  <span
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-[10px] border md:h-[46px] md:w-[46px] md:rounded-xl',
                      last ? 'border-accent bg-accent text-white' : 'border-line bg-card2 text-accent-strong',
                    )}
                  >
                    <Icon name={icon} size={22} />
                  </span>
                  <span className="flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[15px] font-bold leading-tight">{t(`${key}.name`)}</span>
                    <span className="text-[13px] text-ink2">{t(`${key}.sub`)}</span>
                  </span>
                </div>
                {!last ? (
                  <span aria-hidden="true" className="hidden items-center pt-8 text-[#c9c8c0] md:flex">
                    <Icon name="arrow-right" size={18} />
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
        <p className="mt-4 text-center text-sm text-muted">{t('caption')}</p>
      </Container>
    </section>
  )
}
