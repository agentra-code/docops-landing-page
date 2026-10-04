import { useLocale, useTranslations } from 'next-intl'
import { SectionHead } from '@/components/home/SectionHead'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { TOPIC_IDS, TOPIC_META, topicCopy, topicPage, type TopicId } from '@/content/topics'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

/** Thẻ dẫn tới các trang chủ đề (hub → pillar). Tên thẻ = từ khoá chính của trang đích, dùng làm anchor text. */
export function TopicHub({
  exclude,
  eyebrow,
  title,
  lead,
  className,
}: {
  exclude?: TopicId
  eyebrow: string
  title: string
  lead?: string
  className?: string
}) {
  const locale = useLocale() as Locale
  const t = useTranslations('topics')
  const ids = TOPIC_IDS.filter((id) => id !== exclude)
  return (
    <Section className={className}>
      <Container>
        <SectionHead eyebrow={eyebrow} title={title} lead={lead} />
        <div className={cn('mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-5', ids.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
          {ids.map((id) => {
            const c = topicCopy(locale, id)
            return (
              <Link
                key={id}
                href={topicPage(id)}
                className="group flex flex-col gap-3 rounded-xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:border-accent"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                  <Icon name={TOPIC_META[id].icon} size={22} />
                </span>
                <h3 className="text-lg leading-snug font-semibold">{c.name}</h3>
                <p className="text-[15px] leading-relaxed text-ink2">{c.card}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[14.5px] font-semibold text-accent-strong">
                  {t('more')}
                  <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
