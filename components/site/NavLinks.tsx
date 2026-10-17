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
 * Thanh ngang chỉ đủ chỗ cho năm mục từ 1280 px (xl). Nhãn "Hướng dẫn sử dụng DocOps" / "DocOps user guide" là từ khoá chính của trang
 * (lib/seo/brand.ts) nên không rút ngắn. Container rộng tối đa 1200 px (nội dung 1136 px): năm mục tiếng Anh cần ~1150 px với khoảng cách
 * mặc định, nên từ xl khoảng cách thu lại (Header: gap-10 → 6, gap-7 → 5, còn ~1090 px) và nhãn, logo không bẻ dòng (`xl:whitespace-nowrap`).
 * Dưới 1280 px thanh giữ bốn mục như trước (hẹp hơn nữa là menu mobile, luôn đủ năm); từ `lg` không đủ chỗ: nội dung chỉ 960 px.
 * Đường vào trang ở khổ giữa: chân trang, trang Tải về và hai trang cài đặt. tests/e2e/pages.spec.ts đếm dòng chữ ở 1100, 1280, 1366, 1920 px.
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
              'border-b-2 py-1.5 text-[15px] transition-colors xl:whitespace-nowrap',
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
