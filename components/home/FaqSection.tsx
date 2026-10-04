import { useLocale, useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import type { Locale } from '@/i18n/routing'
import { brand } from '@/lib/seo/brand'
import { Faq } from './Faq'
import { SectionHead } from './SectionHead'

export const FAQ_KEYS = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const

type FaqT = (key: string, values: { description: string }) => string

/** Một nguồn cho câu hỏi hiển thị và FAQPage JSON-LD. q0 mở đầu bằng câu mô tả chuẩn (lib/seo/brand.ts). */
export function faqItems(t: FaqT, locale: Locale) {
  const values = { description: brand.description[locale] }
  return FAQ_KEYS.map((id) => ({ id, q: t(`${id}.q`, values), a: t(`${id}.a`, values) }))
}

export function FaqSection() {
  const t = useTranslations('home.faq')
  const locale = useLocale() as Locale
  return (
    <Section className="border-t border-line bg-card">
      <Container>
        <SectionHead eyebrow={t('eyebrow')} title={t('h2')} />
        <Faq items={faqItems(t as unknown as FaqT, locale)} />
      </Container>
    </Section>
  )
}
