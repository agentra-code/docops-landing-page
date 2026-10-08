import { useLocale, useTranslations } from 'next-intl'
import { SectionHead } from '@/components/home/SectionHead'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { TOPIC_META, topicCopy, topicPage, topicsByGroup, type TopicId } from '@/content/topics'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

/** Thẻ dẫn tới các trang chủ đề (hub → pillar), theo nhóm. Tên thẻ = từ khoá chính của trang đích, dùng làm anchor text.
 *  Nhãn nhóm là chữ thường, không phải heading: tên thẻ vẫn là h3 ngay dưới h2 của khối. */
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
  return (
    <Section className={className}>
      <Container>
        <SectionHead eyebrow={eyebrow} title={title} lead={lead} />
        <div className="mt-8 flex flex-col gap-10 md:mt-12">
          {topicsByGroup(exclude).map(({ group, ids }) => (
            <div key={group} className="flex flex-col gap-4">
              <p className="text-[13px] font-bold tracking-[0.6px] text-muted uppercase">{t(`groups.${group}`)}</p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                {ids.map((id) => (
                  <TopicCard key={id} id={id} locale={locale} more={t('more')} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function TopicCard({ id, locale, more }: { id: TopicId; locale: Locale; more: string }) {
  const c = topicCopy(locale, id)
  return (
    <Link
      href={topicPage(id)}
      className="group flex flex-col gap-3 rounded-xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:border-accent"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
        <Icon name={TOPIC_META[id].icon} size={22} />
      </span>
      <h3 className="text-lg leading-snug font-semibold">{c.name}</h3>
      <p className="text-[15px] leading-relaxed text-ink2">{c.card}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[14.5px] font-semibold text-accent-strong">
        {more}
        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
