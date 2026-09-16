'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'

/** Chuyển VI/EN, giữ nguyên trang hiện tại (slug dịch theo locale). */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  function switchTo(next: Locale) {
    if (next === locale) return
    track({ name: 'locale_switch', from: locale, to: next })
    router.replace({ pathname, params } as Parameters<typeof router.replace>[0], { locale: next })
  }

  return (
    <div
      role="group"
      aria-label={t('language')}
      className={cn('inline-flex items-center gap-0.5 rounded-full border border-line bg-sidebar p-[3px]', className)}
    >
      {routing.locales.map((code) => {
        const on = code === locale
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-pressed={on}
            className={cn(
              'h-[30px] rounded-full px-2.5 text-[12.5px] font-bold tracking-[0.4px] transition-colors',
              on ? 'bg-card2 text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'text-muted hover:text-ink',
            )}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
