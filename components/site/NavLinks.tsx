'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export const NAV_ITEMS = [
  { href: '/how-it-works', key: 'howItWorks' },
  { href: '/ai-transparency', key: 'transparency' },
  { href: '/download', key: 'download' },
  { href: '/user-guide', key: 'userGuide' },
  { href: '/contact', key: 'contact' },
] as const

/**
 * Thanh ngang chỉ đủ chỗ cho năm mục từ 1280 px (xl): nhãn "Hướng dẫn sử dụng DocOps" / "DocOps user guide" là từ khoá chính của trang
 * (lib/seo/brand.ts) nên không rút ngắn, mà chiếm ~170 px. Dưới 1280 px thanh giữ bốn mục như trước (hẹp hơn nữa là menu mobile, luôn đủ năm),
 * còn đường vào trang là chân trang, trang Tải về và hai trang cài đặt. tests/e2e/pages.spec.ts canh cả hai bên ngưỡng.
 */
const WIDE_ONLY: ReadonlySet<string> = new Set(['/user-guide'])

export function NavLinks({ onNavigate, className, bar }: { onNavigate?: () => void; className?: string; bar?: boolean }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  return (
    <>
      {NAV_ITEMS.map(({ href, key }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'border-b-2 py-1.5 text-[15px] transition-colors',
              active ? 'border-accent font-semibold text-ink' : 'border-transparent font-normal text-ink2 hover:text-ink',
              bar && WIDE_ONLY.has(href) && 'hidden xl:inline',
              className,
            )}
          >
            {t(key)}
          </Link>
        )
      })}
    </>
  )
}
