import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { Be_Vietnam_Pro } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { SkipLink } from '@/components/site/SkipLink'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

// Đây là ROOT layout (không có app/layout.tsx) để `locale` là root param → next/root-params
// đọc được locale khi render tĩnh (next-intl 4 với Next 16.3).

const font = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  return (
    <html lang={locale} className={font.variable}>
      <body className="flex min-h-dvh flex-col bg-page font-sans text-ink antialiased">
        <NextIntlClientProvider>
          <SkipLink />
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
