import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('common')
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-24">
      <h1 className="text-4xl font-bold">{t('siteName')}</h1>
      <p className="mt-4 text-ink2">{t('tagline')}</p>
    </main>
  )
}
