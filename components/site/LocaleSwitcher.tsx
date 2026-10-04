'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { usePathname } from '@/i18n/navigation'
import { routing, type Locale, type PageKey } from '@/i18n/routing'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { localizedPath } from '@/lib/seo/urls'

/** Khoá trang của đường dẫn hiện tại: `usePathname` trả mẫu ('/download') với trang tĩnh nhưng đường dẫn đã điền
 *  tham số ('/install/macos') với trang động, nên khớp ngược từng mẫu với `params`. */
function pageKeyOf(pathname: string, params: Record<string, string>): PageKey | undefined {
  return (Object.keys(routing.pathnames) as PageKey[]).find(
    (key) => key === pathname || key.replace(/\[(\w+)\]/g, (_, name: string) => params[name] ?? '') === pathname,
  )
}

/**
 * Chuyển VI/EN bằng link thật (bot theo được), giữ nguyên trang hiện tại (slug dịch theo locale).
 * Href tính sẵn tới URL cuối cùng: Link của next-intl với `locale` sinh `/vi/...` rồi bị 308 về `/...`
 * (link tới trang redirect làm phí lượt crawl). Trang lạ (404) thì về trang chủ của ngôn ngữ kia.
 * Thẻ <a> thường, không phải next/link: đổi ngôn ngữ là tải lại cả trang (đổi `<html lang>`), và prefetch RSC
 * chéo ngôn ngữ của next/link bị middleware trả 404.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const pathname = usePathname()
  const params = useParams<Record<string, string>>()
  return (
    <div
      role="group"
      aria-label={t('language')}
      className={cn('inline-flex items-center gap-0.5 rounded-full border border-line bg-sidebar p-[3px]', className)}
    >
      {routing.locales.map((code) => {
        const on = code === locale
        return (
          <a
            key={code}
            href={localizedPath(code, pageKeyOf(pathname, params) ?? '/', params)}
            hrefLang={code}
            aria-current={on ? 'true' : undefined}
            onClick={() => !on && track({ name: 'locale_switch', from: locale, to: code })}
            className={cn(
              'inline-flex h-[30px] items-center rounded-full px-2.5 text-[12.5px] font-bold tracking-[0.4px] transition-colors',
              on ? 'bg-card2 text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'text-muted hover:text-ink',
            )}
          >
            {code.toUpperCase()}
          </a>
        )
      })}
    </div>
  )
}
