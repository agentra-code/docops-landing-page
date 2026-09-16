# Landing page Agentra DocOps — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the bilingual (vi/en) marketing site for Agentra DocOps on Vercel: static pages, a self-updating Download page fed by the VPS release feed, MDX install guides, full SEO, Vercel Analytics + GA4 behind a consent bar, and a contact page without forms.

**Architecture:** Next.js 16 App Router with next-intl (`/` = vi, `/en/...` = en, localized slugs). All pages are Server Components rendered statically per locale; the download data comes from `latest.yml` / `latest-mac.yml` fetched with ISR (10 min) and falls back to a committed snapshot. Pure logic lives in `lib/` (unit-tested with Vitest); pages are verified with Playwright and Lighthouse CI.

**Tech Stack:** Next.js 16.3, React 19, TypeScript 5, pnpm, Tailwind CSS 4, next-intl 4.14, @next/mdx + remark-gfm, yaml, @vercel/analytics 2, @vercel/speed-insights 2, @next/third-parties, Vitest 5, @playwright/test 1.63, @lhci/cli 0.15, sharp.

**Spec:** `docs/superpowers/specs/2026-09-16-docops-landing-page-design.md` (design canvas: https://claude.ai/artifact/68sTSFxNQdNhJG4T1iXgcu, source in `docs/thiet-ke/gen.py` — the approved copy for both languages lives in its `T['vi']` / `T['en']` dictionaries; copy it verbatim into `messages/*.json`).

## Global Constraints

- Node ≥ 22 (Vercel runs 24); package manager pnpm; TypeScript `strict: true`; **pin `typescript` to `^5.9`** (npm `latest` is 7.x, unsupported by Next 16).
- Locales: `vi` (default, no prefix) and `en` (`/en` prefix); `localeDetection: false`; `x-default` = vi.
- Localized slugs exactly as spec §5: `/tai-ve`↔`/en/download`, `/huong-dan-cai-dat/[os]`↔`/en/install/[os]`, `/quy-trinh`↔`/en/how-it-works`, `/minh-bach-ai`↔`/en/ai-transparency`, `/lien-he`↔`/en/contact`, `/chinh-sach-bao-mat`↔`/en/privacy`.
- Feed URL default `https://download-docsopapp.agentra.io.vn/desktop/`; fetch timeout 5000 ms; ISR `revalidate: 600`; snapshot at `content/releases.json`.
- Design tokens verbatim from spec §8.1 (`--page #f9f9f7 … --brand-deep #1e3413`); font Be Vietnam Pro (subsets latin + vietnamese, weights 400/500/600/700); light theme only; no emoji icons (inline SVG, 1.6px stroke, 24px grid).
- Copy: Vietnamese source of truth = `docs/thiet-ke/gen.py` `T['vi']` (+ page builders); English = `T['en']`. Company facts: Agentra JSC · Đà Nẵng · info@agentra.io.vn · https://agentra.io.vn. No forms, no web-app links.
- Env vars (spec §11): `NEXT_PUBLIC_SITE_URL` (required), `DOWNLOAD_FEED_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_CONSENT_BANNER`.
- Redirects 301: `/xin-key` → `/lien-he`, `/login` → `/`. Security headers per spec §14. No Edge runtime, no Route Handlers.
- Every task ends with `pnpm verify` (typecheck + lint + unit tests) green and a commit; commit messages in Vietnamese with English scope, e.g. `feat(i18n): …`.

## File Structure

```
app/layout.tsx                      # returns children only (html lives in [locale]/layout)
app/robots.ts  app/sitemap.ts  app/manifest.ts  app/icon.svg  app/apple-icon.png
app/[locale]/layout.tsx             # <html lang>, font, NextIntlClientProvider, Header/Footer, AnalyticsGate, ConsentBar
app/[locale]/page.tsx               # Home (composes components/home/*)
app/[locale]/download/page.tsx
app/[locale]/install/[os]/page.tsx  # os ∈ {macos, windows}
app/[locale]/how-it-works/page.tsx  app/[locale]/ai-transparency/page.tsx
app/[locale]/contact/page.tsx       app/[locale]/privacy/page.tsx
app/[locale]/[...rest]/page.tsx     # notFound()
app/[locale]/not-found.tsx  app/[locale]/error.tsx
app/[locale]/opengraph-image.tsx    app/[locale]/download/opengraph-image.tsx
proxy.ts                            # next-intl createMiddleware
i18n/routing.ts  i18n/navigation.ts  i18n/request.ts
messages/vi.json  messages/en.json  global.d.ts
content/releases.json  content/install/{vi,en}/{macos,windows}.mdx  content/privacy/{vi,en}.mdx
mdx-components.tsx
lib/site.ts                         # company facts + env accessors
lib/releases/{types,parse,feed,snapshot,index}.ts
lib/seo/{metadata,jsonld}.ts
lib/analytics.ts  lib/platform.ts  lib/format.ts
components/ui/{Container,Section,Button,Card,Callout,Icon}.tsx
components/site/{Header,MobileNav,Footer,LocaleSwitcher,SkipLink,AnalyticsGate,ConsentBar}.tsx
components/home/{Hero,PipelineStrip,CoreFlows,Benefits,TrustGrid,DownloadBlock,Faq,FinalCta}.tsx
components/download/{PlatformCard,ChecksumField,SystemRequirements,DownloadLink}.tsx
components/guide/{Steps,Step,Toc,OsTabs}.tsx
scripts/sync-releases.ts  scripts/capture-product-images.mjs
tests/unit/**  tests/e2e/**  tests/fixtures/{latest.yml,latest-mac.yml}
vitest.config.ts  playwright.config.ts  lighthouserc.json  .github/workflows/ci.yml
```

---

### Task 1: Scaffold the Next.js 16 project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `app/globals.css`, `.env.example`, `.prettierrc`, `vitest.config.ts`, `tests/unit/smoke.test.ts`
- Modify: `.gitignore` (append scaffold entries), `README.md` (replace scaffold README with a short project README; the full ops README is Task 12)

**Interfaces:**
- Produces: pnpm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `verify`; import alias `@/*` → project root.

- [ ] **Step 1: Scaffold into a temp dir and move in** (create-next-app refuses a non-empty dir)

```bash
pnpm dlx create-next-app@latest /tmp/docops-scaffold --ts --tailwind --eslint --app --import-alias "@/*" --use-pnpm --disable-git --skip-install --yes
rsync -a --exclude README.md /tmp/docops-scaffold/ ./
cat /tmp/docops-scaffold/.gitignore >> .gitignore   # then dedupe by hand
```

- [ ] **Step 2: Pin versions and add dependencies**

```bash
pnpm add next@16.3.5 react@19 react-dom@19 next-intl@^4.14 @next/mdx@16.3.5 @mdx-js/loader @mdx-js/react @types/mdx remark-gfm yaml @vercel/analytics @vercel/speed-insights @next/third-parties@16.3.5
pnpm add -D typescript@^5.9 vitest@^5 @playwright/test@^1.63 @lhci/cli@^0.15 prettier@^3 sharp
```

- [ ] **Step 3: Scripts in package.json**

```json
"scripts": {
  "dev": "next dev", "build": "next build", "start": "next start",
  "lint": "eslint .", "typecheck": "tsc --noEmit",
  "test": "vitest run", "e2e": "playwright test", "lhci": "lhci autorun",
  "verify": "pnpm typecheck && pnpm lint && pnpm test",
  "sync-releases": "node --experimental-strip-types scripts/sync-releases.ts",
  "capture-images": "node scripts/capture-product-images.mjs"
},
"engines": { "node": ">=22" }
```

- [ ] **Step 4: Vitest config and a smoke test**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname) } },
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
})
```

```ts
// tests/unit/smoke.test.ts
import { expect, test } from 'vitest'
test('vitest runs', () => { expect(1 + 1).toBe(2) })
```

- [ ] **Step 5: `.env.example`**

```
NEXT_PUBLIC_SITE_URL=https://docops.agentra.io.vn
DOWNLOAD_FEED_URL=https://download-docsopapp.agentra.io.vn/desktop/
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_CONSENT_BANNER=on
```

- [ ] **Step 6: Run** `pnpm install && pnpm verify && pnpm build` → all green, `.next` produced.
- [ ] **Step 7: Commit** `chore: khởi tạo Next.js 16 + Tailwind 4 + Vitest`

### Task 2: i18n routing, locale layout, messages

**Files:**
- Create: `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `proxy.ts`, `messages/vi.json`, `messages/en.json`, `global.d.ts`, `app/layout.tsx`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/[...rest]/page.tsx`, `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`
- Modify: `next.config.ts`
- Test: `tests/unit/i18n.test.ts`

**Interfaces:**
- Produces: `routing` (`locales: ['vi','en']`, `defaultLocale: 'vi'`, `pathnames` keyed by internal paths `/`, `/download`, `/install/[os]`, `/how-it-works`, `/ai-transparency`, `/contact`, `/privacy`); `Link`, `getPathname`, `usePathname`, `useRouter`, `redirect` from `i18n/navigation.ts`; type `Locale = (typeof routing.locales)[number]`; `messages/*.json` namespaces `common`, `nav`, `home`, `download`, `install`, `howItWorks`, `transparency`, `contact`, `privacy`, `notFound`, `consent`.

- [ ] **Step 1: Failing test** — pathnames cover every page and both message files have identical key sets

```ts
// tests/unit/i18n.test.ts
import { describe, expect, test } from 'vitest'
import { routing } from '@/i18n/routing'
import vi from '@/messages/vi.json'
import en from '@/messages/en.json'

const flatten = (o: unknown, p = ''): string[] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o).flatMap(([k, v]) => flatten(v, p ? `${p}.${k}` : k))
    : [p]

describe('i18n', () => {
  test('pathnames cover every page in both locales', () => {
    const expected = ['/', '/download', '/install/[os]', '/how-it-works', '/ai-transparency', '/contact', '/privacy']
    expect(Object.keys(routing.pathnames).sort()).toEqual(expected.sort())
    for (const key of expected) {
      const entry = routing.pathnames[key as keyof typeof routing.pathnames]
      if (typeof entry === 'string') continue
      expect(Object.keys(entry).sort()).toEqual(['en', 'vi'])
    }
    expect(routing.pathnames['/download']).toEqual({ vi: '/tai-ve', en: '/download' })
    expect(routing.pathnames['/install/[os]']).toEqual({ vi: '/huong-dan-cai-dat/[os]', en: '/install/[os]' })
  })
  test('vi and en messages have the same keys', () => {
    expect(flatten(en).sort()).toEqual(flatten(vi).sort())
  })
})
```

- [ ] **Step 2: Run** `pnpm test` → FAIL (modules missing).
- [ ] **Step 3: Implement**

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
export const routing = defineRouting({
  locales: ['vi', 'en'], defaultLocale: 'vi', localePrefix: 'as-needed', localeDetection: false,
  pathnames: {
    '/': '/',
    '/download': { vi: '/tai-ve', en: '/download' },
    '/install/[os]': { vi: '/huong-dan-cai-dat/[os]', en: '/install/[os]' },
    '/how-it-works': { vi: '/quy-trinh', en: '/how-it-works' },
    '/ai-transparency': { vi: '/minh-bach-ai', en: '/ai-transparency' },
    '/contact': { vi: '/lien-he', en: '/contact' },
    '/privacy': { vi: '/chinh-sach-bao-mat', en: '/privacy' },
  },
})
export type Locale = (typeof routing.locales)[number]
```

```ts
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
```

```ts
// i18n/request.ts  (Next 16.3: locale from next/root-params → static rendering, no setRequestLocale)
import * as rootParams from 'next/root-params'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const value = await rootParams.locale()
    if (hasLocale(routing.locales, value)) locale = value
    else notFound()
  }
  return { locale, messages: (await import(`../messages/${locale}.json`)).default }
})
```

```ts
// proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
export default createMiddleware(routing)
export const config = { matcher: '/((?!api|_next|_vercel|.*\\..*).*)' }
```

```ts
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
]
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  async redirects() {
    return [
      { source: '/xin-key', destination: '/lien-he', permanent: true },
      { source: '/login', destination: '/', permanent: true },
    ]
  },
  async headers() { return [{ source: '/(.*)', headers: securityHeaders }] },
}
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const withMDX = createMDX({ options: { remarkPlugins: ['remark-gfm'] } })
export default withNextIntl(withMDX(nextConfig))
```

```ts
// global.d.ts
import type { routing } from '@/i18n/routing'
import type messages from '@/messages/vi.json'
declare module 'next-intl' {
  interface AppConfig { Locale: (typeof routing.locales)[number]; Messages: typeof messages }
}
```

`app/layout.tsx` returns `children` only. `app/[locale]/layout.tsx`:

```tsx
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Be_Vietnam_Pro } from 'next/font/google'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'
const font = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], variable: '--font-be-vietnam', display: 'swap' })
export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })) }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  return (
    <html lang={locale} className={font.variable}>
      <body className="bg-page text-ink font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

`app/[locale]/[...rest]/page.tsx` → `import { notFound } from 'next/navigation'; export default function CatchAll() { notFound() }`. `not-found.tsx` and `error.tsx` ('use client', with `reset`) render `notFound.*` / `common.retry` messages. Seed `messages/vi.json` and `en.json` with the `common`, `nav`, `notFound`, `consent` namespaces now (other namespaces are added by the tasks that need them, keeping key parity).

- [ ] **Step 4: Run** `pnpm verify && pnpm build` → PASS; build log lists `/` and `/en` as static (○).
- [ ] **Step 5: Commit** `feat(i18n): routing vi/en với slug dịch, layout theo locale, proxy next-intl`

### Task 3: Design tokens, UI primitives, header and footer

**Files:**
- Create: `lib/site.ts`, `components/ui/Container.tsx`, `Section.tsx`, `Button.tsx`, `Card.tsx`, `Callout.tsx`, `Icon.tsx`, `components/site/Header.tsx`, `MobileNav.tsx`, `Footer.tsx`, `LocaleSwitcher.tsx`, `SkipLink.tsx`
- Modify: `app/globals.css`, `app/[locale]/layout.tsx`, `messages/*.json` (`nav`, `footer`, `common`)
- Test: `tests/unit/icon.test.ts`

**Interfaces:**
- Produces: `site` constants `{ name: 'Agentra DocOps', company: 'Agentra JSC', email: 'info@agentra.io.vn', city: 'Đà Nẵng', country: 'Việt Nam', companyUrl: 'https://agentra.io.vn', phone: '', zalo: '', address: '', siteUrl(): string, feedUrl(): string }`; `Button({ href, variant: 'primary'|'secondary'|'white'|'ghost', size: 'sm'|'md'|'lg', icon?, iconAfter?, full?, onClick?, ...})`; `Icon({ name: IconName, size?, className? })` with `ICON_NAMES` = the icon set of `docs/thiet-ke/gen.py` (`download`, `arrow-right`, `check`, `file`, `tag`, `search`, `graph`, `pen`, `user-check`, `clock`, `book`, `archive`, `shield`, `laptop`, `lock`, `mail`, `phone`, `pin`, `copy`, `chevron-down`, `chevron-right`, `key`, `menu`, `close`, `warning`, `info`, `chip`, `refresh`, `external`, `bug`, `monitor`, `wifi`, `hdd`, `windows`, `apple`); `Callout({ kind: 'info'|'warning'|'note', title?, children })`; `Header({ locale })`, `Footer({ locale })`.

- [ ] **Step 1: Failing test** — every icon renders an `<svg>` and none contains emoji

```ts
// tests/unit/icon.test.ts
import { expect, test } from 'vitest'
import { ICONS, ICON_NAMES } from '@/components/ui/icons'
test('every icon has SVG path data and no emoji', () => {
  for (const name of ICON_NAMES) {
    expect(ICONS[name]).toMatch(/<(path|circle|rect)/)
    expect(ICONS[name]).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
  }
})
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** `components/ui/icons.ts` (paths copied from `docs/thiet-ke/gen.py` `ICONS`, `APPLE`, `WINDOWS`), `Icon.tsx` (`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} … dangerouslySetInnerHTML>`; `apple`/`windows` use `fill="currentColor"`).

`app/globals.css` (Tailwind 4):

```css
@import "tailwindcss";
@theme {
  --color-page: #f9f9f7; --color-card: #fcfcfb; --color-card2: #ffffff; --color-sidebar: #f3f3f0;
  --color-ink: #0b0b0b; --color-ink2: #52514e; --color-muted: #898781; --color-line: #e1e0d9;
  --color-brand-light: #8cbf3c; --color-brand: #6a9c39; --color-accent: #567f2e; --color-accent-strong: #3e6b1f;
  --color-accent-soft: #eff5e3; --color-accent-line: #d9e6c4; --color-brand-deep: #1e3413;
  --color-good: #0ca30c; --color-warn-dot: #fab219; --color-warn-soft: #fdf3dc; --color-warn-text: #7a5200; --color-warn-border: #f0dfae;
  --color-crit: #d03b3b; --color-info-soft: #eaf2fc; --color-info-text: #1c5cab; --color-info-border: #c9dcf3;
  --radius-card: 10px; --radius-control: 8px; --radius-modal: 14px;
}
@theme inline { --font-sans: var(--font-be-vietnam), system-ui, -apple-system, "Segoe UI", sans-serif; }
```

Header: 72px bar, logo (SVG paths from `packages/ui/src/components/Logo.tsx`: `M213 0 L270 103 L110 354 L0 354 Z` fill `#8cbf3c`, `M288 133 L415 354 L302 354 L241 255 L209 253 Z` fill `#6a9c39`, viewBox `0 0 415 354`), nav from `nav.*` messages with `aria-current="page"`, `LocaleSwitcher` (client: `usePathname` + `useParams` + `useRouter().replace({pathname, params}, {locale})`, fires `locale_switch`), primary `Button` → `/download`. Below `md`: `MobileNav` (client, `<dialog>`-free: a full-screen panel toggled by a 44px button, `aria-expanded`). Footer: brand column, three link columns from `footer.*`, © line, `LocaleSwitcher`.

- [ ] **Step 4: Run** `pnpm verify && pnpm build` → PASS. Manual check at `pnpm dev`: header/footer render in vi and en, `/en` switch keeps the page.
- [ ] **Step 5: Commit** `feat(ui): token Tailwind theo tokens.css, primitives, header/footer hai ngôn ngữ`

### Task 4: Release feed library and snapshot

**Files:**
- Create: `lib/releases/types.ts`, `parse.ts`, `feed.ts`, `snapshot.ts`, `index.ts`, `content/releases.json`, `scripts/sync-releases.ts`, `tests/fixtures/latest.yml`, `tests/fixtures/latest-mac.yml` (copies of `docops-application/packages/desktop/release/latest*.yml`), `lib/format.ts`
- Test: `tests/unit/releases.test.ts`, `tests/unit/format.test.ts`

**Interfaces:**
- Produces:
```ts
export type Platform = 'windows-x64' | 'macos-arm64' | 'macos-x64'
export interface ReleaseAsset { platform: Platform; version: string; fileName: string; url: string; sizeBytes: number; sha512: string; releaseDate: string }
export type FeedSource = 'feed' | 'snapshot'
export interface ReleaseInfo { assets: ReleaseAsset[]; source: { windows: FeedSource; mac: FeedSource } }
export function parseFeeds(input: { windows?: unknown; mac?: unknown }, baseUrl: string): ReleaseAsset[]   // parse.ts, pure
export function getReleases(): Promise<ReleaseInfo>       // index.ts, React.cache'd; fetch + fallback
export function formatBytes(n: number, locale: 'vi'|'en'): string   // '150 MB' (1 decimal only when < 10 MB)
export function formatDate(iso: string, locale: 'vi'|'en'): string  // vi '15/09/2026', en '15 Sep 2026'
```

- [ ] **Step 1: Failing tests**

```ts
// tests/unit/releases.test.ts
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { describe, expect, test, vi } from 'vitest'
import { parseFeeds } from '@/lib/releases/parse'
import { fetchFeed } from '@/lib/releases/feed'
const BASE = 'https://download-docsopapp.agentra.io.vn/desktop/'
const win = parse(readFileSync('tests/fixtures/latest.yml', 'utf8'))
const mac = parse(readFileSync('tests/fixtures/latest-mac.yml', 'utf8'))
describe('parseFeeds', () => {
  test('maps the three platforms and skips zip/blockmap', () => {
    const assets = parseFeeds({ windows: win, mac }, BASE)
    expect(assets.map((a) => a.platform)).toEqual(['windows-x64', 'macos-arm64', 'macos-x64'])
    const w = assets[0]
    expect(w.fileName).toBe('DocOps Setup 1.0.0.exe')
    expect(w.url).toBe(BASE + 'DocOps%20Setup%201.0.0.exe')
    expect(w.sizeBytes).toBe(157058273)
    expect(w.sha512).toBe(win.sha512)
    expect(assets[1]).toMatchObject({ fileName: 'DocOps-1.0.0-arm64.dmg', sizeBytes: 194928638, version: '1.0.0' })
    expect(assets[2]).toMatchObject({ fileName: 'DocOps-1.0.0.dmg', sizeBytes: 199815749 })
    expect(assets.every((a) => a.releaseDate.startsWith('2026-09-15'))).toBe(true)
  })
  test('missing or malformed feed yields no asset for that platform, no throw', () => {
    expect(parseFeeds({ mac }, BASE).map((a) => a.platform)).toEqual(['macos-arm64', 'macos-x64'])
    expect(parseFeeds({ windows: { nonsense: true }, mac: null }, BASE)).toEqual([])
  })
})
describe('fetchFeed', () => {
  test('returns parsed YAML on 200 and null on 404 / network error', async () => {
    const ok = vi.fn().mockResolvedValue(new Response(readFileSync('tests/fixtures/latest.yml', 'utf8'), { status: 200 }))
    expect((await fetchFeed(BASE + 'latest.yml', ok))?.version).toBe('1.0.0')
    const nf = vi.fn().mockResolvedValue(new Response('nope', { status: 404 }))
    expect(await fetchFeed(BASE + 'latest.yml', nf)).toBeNull()
    const boom = vi.fn().mockRejectedValue(new Error('ECONNRESET'))
    expect(await fetchFeed(BASE + 'latest.yml', boom)).toBeNull()
  })
})
```

```ts
// tests/unit/format.test.ts
import { expect, test } from 'vitest'
import { formatBytes, formatDate } from '@/lib/format'
test('bytes', () => { expect(formatBytes(157058273, 'vi')).toBe('150 MB'); expect(formatBytes(194928638, 'en')).toBe('186 MB') })
test('dates', () => { expect(formatDate('2026-09-15T15:22:00.690Z', 'vi')).toBe('15/09/2026'); expect(formatDate('2026-09-15T15:22:00.690Z', 'en')).toBe('15 Sep 2026') })
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement**

`parse.ts`: type guards for `{ version, path?, sha512?, releaseDate, files: [{url, sha512, size}] }`; Windows asset from `path` ending `.exe` (size from `files[0].size`); mac assets from `files[]` whose `url` ends with `-arm64.dmg` (arm64) or `.dmg` without `arm64` (x64); `url = baseUrl + encodeURIComponent(fileName)`; ordered windows, arm64, x64.

`feed.ts`: `fetchFeed(url, fetchImpl = fetch)` → `fetchImpl(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 600 } })`; non-2xx or throw → `console.error('release_feed_unavailable', url)` and `null`; body → `parse()` from `yaml`.

`snapshot.ts`: `import snapshot from '@/content/releases.json'` typed `{ windows: unknown; mac: unknown }`. `index.ts`:

```ts
export const getReleases = cache(async (): Promise<ReleaseInfo> => {
  const base = site.feedUrl()
  const [windows, mac] = await Promise.all([fetchFeed(base + 'latest.yml'), fetchFeed(base + 'latest-mac.yml')])
  const source = { windows: windows ? 'feed' : 'snapshot', mac: mac ? 'feed' : 'snapshot' } as const
  return { assets: parseFeeds({ windows: windows ?? snapshot.windows, mac: mac ?? snapshot.mac }, base), source }
})
```

`content/releases.json` = `{ "windows": <latest.yml as JSON>, "mac": <latest-mac.yml as JSON> }` generated by `scripts/sync-releases.ts` (`--from <url|dir>`, default `DOWNLOAD_FEED_URL`; reads both yml, writes JSON with `JSON.stringify(_, null, 2)`). Run it once with `--from ../docops-application/packages/desktop/release`.

- [ ] **Step 4: Run** `pnpm test` → PASS. **Step 5: Commit** `feat(releases): parse feed latest*.yml, ISR fetch có dự phòng snapshot, script sync-releases`

### Task 5: Home page (nine blocks) with product images and platform detection

**Files:**
- Create: `components/home/Hero.tsx`, `PipelineStrip.tsx`, `CoreFlows.tsx`, `Benefits.tsx`, `TrustGrid.tsx`, `DownloadBlock.tsx`, `Faq.tsx`, `FinalCta.tsx`, `components/download/DownloadLink.tsx`, `lib/platform.ts`, `lib/seo/jsonld.ts`, `components/seo/JsonLd.tsx`, `scripts/capture-product-images.mjs`, `public/images/product/{rasoat,khovanban,tracuu,soanthao,dothi}.webp`
- Modify: `app/[locale]/page.tsx`, `messages/*.json` (`home` namespace, copied from `gen.py` `T`)
- Test: `tests/unit/platform.test.ts`, `tests/unit/jsonld.test.ts`

**Interfaces:**
- Produces: `detectPlatform(ua: string, uaDataPlatform?: string): 'windows' | 'macos' | null`; `DownloadLink({ asset, location, locale, children })` client `<a download>` firing `download_click`; `jsonld.organization()`, `jsonld.softwareApplication(assets, locale)`, `jsonld.faqPage(items)`, `jsonld.breadcrumb(items)`, `jsonld.howTo(...)` returning plain objects; `<JsonLd data={obj} />` renders `<script type="application/ld+json">` with `JSON.stringify` and `<`→`<` escaping.

- [ ] **Step 1: Failing tests**

```ts
// tests/unit/platform.test.ts
import { expect, test } from 'vitest'
import { detectPlatform } from '@/lib/platform'
test('detects from UA', () => {
  expect(detectPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64) …')).toBe('windows')
  expect(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) …')).toBe('macos')
  expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(null)
  expect(detectPlatform('Mozilla/5.0 (X11; Linux x86_64)')).toBe(null)
  expect(detectPlatform('', 'macOS')).toBe('macos')
})
```

```ts
// tests/unit/jsonld.test.ts
import { expect, test } from 'vitest'
import { faqPage, organization, softwareApplication } from '@/lib/seo/jsonld'
test('organization', () => { expect(organization()).toMatchObject({ '@type': 'Organization', name: 'Agentra JSC', email: 'info@agentra.io.vn' }) })
test('softwareApplication uses the feed version', () => {
  const asset = { platform: 'windows-x64', version: '1.0.0', fileName: 'x', url: 'u', sizeBytes: 1, sha512: 's', releaseDate: '2026-09-15' } as const
  expect(softwareApplication([asset], 'vi')).toMatchObject({ '@type': 'SoftwareApplication', softwareVersion: '1.0.0', operatingSystem: 'Windows 10, Windows 11, macOS 13+' })
})
test('faqPage', () => { expect(faqPage([{ q: 'A?', a: 'B' }])).toMatchObject({ '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'A?' }] }) })
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement**

`lib/platform.ts`: prefer `uaDataPlatform` (`'Windows'`→windows, `'macOS'`→macos), else regex `/Windows NT/`→windows, `/Macintosh|Mac OS X/` (and not `/iPhone|iPad/`)→macos, else null. `usePlatform()` client hook: `useState(null)` + `useEffect` calling `detectPlatform(navigator.userAgent, (navigator as any).userAgentData?.platform)`.

Product images: `scripts/capture-product-images.mjs` = `docs/thiet-ke/render-shots.mjs` logic (same DCLogic shim) writing PNG 2x to a temp dir, then `sharp` → `public/images/product/<name>.webp` (hero `rasoat` 2400×1500 q80 ≤ 200 KB; cards 1520×950 q78). Commit the WebP files.

Home composition (`app/[locale]/page.tsx`, async server component): `const releases = await getReleases()`; render `Hero(assets)` (client `HeroDownloadButton` swaps label to `home.hero.ctaMac`/`ctaWindows` after `usePlatform()`), `PipelineStrip`, `CoreFlows` (three `next/image` cards, `sizes="(min-width: 1024px) 384px, 100vw"`), `Benefits`, `TrustGrid`, `DownloadBlock(assets)`, `Faq` (`<details>` per item, `faq_open` on toggle), `FinalCta`, plus `<JsonLd>` for organization, softwareApplication, faqPage. Copy: every string from `home.*` messages; use `t.rich` only where the spec copy has inline emphasis.

- [ ] **Step 4: Run** `pnpm verify && pnpm build`; open `/` and `/en` — all nine blocks present, hero image is the LCP with `priority`. **Step 5: Commit** `feat(home): trang chủ 9 khối, ảnh sản phẩm, nhận hệ điều hành, JSON-LD`

### Task 6: Download page

**Files:**
- Create: `app/[locale]/download/page.tsx`, `components/download/PlatformCard.tsx`, `ChecksumField.tsx` (client, `navigator.clipboard.writeText`, "Đã sao chép" state 2 s), `SystemRequirements.tsx`
- Modify: `messages/*.json` (`download` namespace)

**Interfaces:**
- Consumes: `getReleases()`, `formatBytes`, `formatDate`, `DownloadLink`, `usePlatform`.
- Produces: `PlatformCard({ asset, locale, highlighted, guideHref })`.

- [ ] **Step 1:** Write the page: title/lead from `download.*` with version + date interpolated from the newest asset; client `PlatformGrid` orders assets so the detected OS comes first and marks matching cards with `download.detected` ("Máy bạn đang dùng macOS"); each card = platform icon, title, chip note, file name (mono), size · version · date, `ChecksumField` (SHA-512 truncated `first 14…last 10`, copy button `aria-label`), `DownloadLink`, guide link to `{ pathname: '/install/[os]', params: { os } }`. Below: chip note callout, `SystemRequirements` (two cards), unsigned-build warning callout linking both guides, "Đã cài rồi?" card, "Không tải được? Email …" line. `generateMetadata` via `buildMetadata` (Task 9) — until Task 9 lands, export a static `metadata` title and replace it in Task 9.
- [ ] **Step 2:** `pnpm verify && pnpm build`; e2e in Task 11 asserts three `.exe/.dmg` links on this page.
- [ ] **Step 3: Commit** `feat(download): trang Tải về từ feed, checksum, yêu cầu hệ thống`

### Task 7: Install guides in MDX

**Files:**
- Create: `mdx-components.tsx`, `content/install/vi/macos.mdx`, `content/install/vi/windows.mdx`, `content/install/en/macos.mdx`, `content/install/en/windows.mdx`, `components/guide/Steps.tsx`, `Step.tsx`, `Toc.tsx`, `OsTabs.tsx`, `app/[locale]/install/[os]/page.tsx`
- Modify: `messages/*.json` (`install` namespace: page titles, TOC label, tab labels, bottom CTA)
- Test: `tests/unit/guides.test.ts`

**Interfaces:**
- Produces: MDX files export `export const meta = { title, updated: '2026-09-15', minutes: 5, toc: [{ id, label }] }`; a static import map

```ts
// content/install/index.ts
export const GUIDES = {
  vi: { macos: () => import('./vi/macos.mdx'), windows: () => import('./vi/windows.mdx') },
  en: { macos: () => import('./en/macos.mdx'), windows: () => import('./en/windows.mdx') },
} as const
export type GuideOs = 'macos' | 'windows'
export const GUIDE_OS: GuideOs[] = ['macos', 'windows']
```

- [ ] **Step 1: Failing test** — every guide loads, exports `meta` with the required shape, and the macOS guides contain the quarantine command

```ts
// tests/unit/guides.test.ts  (Vitest cannot compile MDX without a plugin; test the raw files instead)
import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
for (const locale of ['vi', 'en']) for (const os of ['macos', 'windows']) {
  test(`${locale}/${os} guide has meta and no internal notes`, () => {
    const src = readFileSync(`content/install/${locale}/${os}.mdx`, 'utf8')
    expect(src).toMatch(/export const meta = \{/)
    expect(src).not.toMatch(/nội bộ|internal/i)
    if (os === 'macos') expect(src).toContain('xattr -dr com.apple.quarantine /Applications/DocOps.app')
    expect(src).toContain('DOCOPS-XXXX-XXXX-XXXX')
  })
}
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Write the MDX** from `docs/huong-dan/cai-dat-tester.md` and `cai-dat-tester-windows.md` (drop "Ghi chú cho nội bộ", replace "người gửi" with Agentra, use the copy in `docs/thiet-ke/gen.py` `page_caidat` for section titles), using `<Steps>`, `<Step n title>`, `<Callout kind>`, fenced code for the command; English guides translate the same structure. `mdx-components.tsx` maps `h2/h3/p/ol/ul/table/code/pre/a` to token-styled elements and exposes `Steps`, `Step`, `Callout`.

Page: `generateStaticParams` = locales × `GUIDE_OS`; `dynamicParams = false`; unknown `os` → `notFound()`; loads `GUIDES[locale][os]`, renders breadcrumb (`/download` → guide), `OsTabs`, sticky `Toc` from `meta.toc` (`lg:` two-column grid 260px + 1fr), the MDX, bottom CTA (`DownloadLink` for the matching asset + link to the other guide), `<JsonLd data={howTo(...)}>` built from `meta.toc`.

- [ ] **Step 4:** `pnpm verify && pnpm build` (4 static guide pages). **Step 5: Commit** `feat(install): hướng dẫn cài đặt macOS/Windows bằng MDX hai ngôn ngữ`

### Task 8: How-it-works, AI transparency, Contact, Privacy

**Files:**
- Create: `app/[locale]/how-it-works/page.tsx`, `app/[locale]/ai-transparency/page.tsx`, `app/[locale]/contact/page.tsx`, `app/[locale]/privacy/page.tsx`, `content/privacy/vi.mdx`, `content/privacy/en.mdx`, `components/site/ContactCard.tsx`, `components/site/CopyButton.tsx` (client)
- Modify: `messages/*.json` (`howItWorks`, `transparency`, `contact` namespaces)

- [ ] **Step 1:** How-it-works: copy from `gen.py` `page_quytrinh` (6 steps + sticky `dothi.webp` frame, three flows, four reliability cards, `FinalCta`). AI transparency: ten numbered sections from spec §6.5 (vi from the old site wording, en translated). Contact: three `ContactCard`s (email + `CopyButton`, phone/Zalo card rendered only when `site.phone` is non-empty, address card with `https://www.google.com/maps/search/?api=1&query=Agentra+JSC+%C4%90%C3%A0+N%E1%BA%B5ng` link), `#nhan-key` three steps, bug-report block; `contact_click` events on email/phone/zalo/maps. Privacy: MDX per locale (sections listed in spec §6.7) rendered inside a `prose`-like wrapper from `mdx-components`.
- [ ] **Step 2:** `pnpm verify && pnpm build` → 8 pages × 2 locales static. **Step 3: Commit** `feat(pages): Quy trình, Minh bạch AI, Liên hệ, Chính sách bảo mật`

### Task 9: SEO plumbing — metadata, sitemap, robots, manifest, OG images, icons

**Files:**
- Create: `lib/seo/metadata.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/[locale]/opengraph-image.tsx`, `app/[locale]/download/opengraph-image.tsx`, `app/icon.svg`, `app/apple-icon.png`, `assets/fonts/BeVietnamPro-Bold.ttf` (OFL, from https://github.com/google/fonts/raw/main/ofl/bevietnampro/BeVietnamPro-Bold.ttf)
- Modify: every `app/[locale]/**/page.tsx` (`generateMetadata`), `app/[locale]/layout.tsx` (`metadataBase`, title template, `verification.google`)
- Test: `tests/unit/seo.test.ts`

**Interfaces:**
- Produces:
```ts
export type PageKey = keyof typeof routing.pathnames
export function buildMetadata(opts: { locale: Locale; page: PageKey; params?: Record<string,string>; title: string; description: string; ogImagePath?: string }): Metadata
// sets: title, description, alternates.canonical (absolute, localized), alternates.languages { vi, en, 'x-default': vi }, openGraph { locale: 'vi_VN'|'en_US', siteName: 'Agentra DocOps', type: 'website', url }, twitter { card: 'summary_large_image' }
export function absoluteUrl(locale: Locale, page: PageKey, params?): string   // getPathname + site.siteUrl()
```

- [ ] **Step 1: Failing test**

```ts
// tests/unit/seo.test.ts
import { expect, test } from 'vitest'
import sitemap from '@/app/sitemap'
import { absoluteUrl, buildMetadata } from '@/lib/seo/metadata'
process.env.NEXT_PUBLIC_SITE_URL = 'https://docops.agentra.io.vn'
test('absoluteUrl localizes slugs', () => {
  expect(absoluteUrl('vi', '/download')).toBe('https://docops.agentra.io.vn/tai-ve')
  expect(absoluteUrl('en', '/install/[os]', { os: 'macos' })).toBe('https://docops.agentra.io.vn/en/install/macos')
})
test('buildMetadata emits canonical + hreflang with x-default = vi', () => {
  const m = buildMetadata({ locale: 'en', page: '/contact', title: 'Contact', description: 'd' })
  expect(m.alternates?.canonical).toBe('https://docops.agentra.io.vn/en/contact')
  expect(m.alternates?.languages).toEqual({ vi: 'https://docops.agentra.io.vn/lien-he', en: 'https://docops.agentra.io.vn/en/contact', 'x-default': 'https://docops.agentra.io.vn/lien-he' })
})
test('sitemap lists 16 urls with alternates', async () => {
  const entries = await sitemap()
  expect(entries).toHaveLength(16)
  const dl = entries.find((e) => e.url.endsWith('/tai-ve'))!
  expect(dl.alternates?.languages).toMatchObject({ en: 'https://docops.agentra.io.vn/en/download' })
})
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** `metadata.ts` with `getPathname({ locale, href: { pathname: page, params } })`; `sitemap.ts` iterates `routing.locales × pages` (install pages ×2 os) with `lastModified` = build time, download page = newest `releaseDate` from `getReleases()`; `robots.ts` `{ rules: { userAgent: '*', allow: '/' }, sitemap: siteUrl + '/sitemap.xml' }`; `manifest.ts` (name, short_name `DocOps`, theme `#567f2e`, background `#f9f9f7`, icons); `icon.svg` = logo mark; `apple-icon.png` 180px rendered with sharp from the SVG. OG image: `ImageResponse` 1200×630, background `#1e3413`, logo, page title + tagline per locale, font loaded with `readFile(join(process.cwd(), 'assets/fonts/BeVietnamPro-Bold.ttf'))`; download OG adds `v{version}`. Layout metadata: `metadataBase: new URL(site.siteUrl())`, `title: { default: 'Agentra DocOps', template: '%s · Agentra DocOps' }`, `verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }`.
- [ ] **Step 4:** `pnpm verify && pnpm build`; `curl -s localhost:3000/sitemap.xml | grep -c '<loc>'` = 16; `/robots.txt` OK; `/opengraph-image` renders. **Step 5: Commit** `feat(seo): metadata theo trang, hreflang, sitemap, robots, manifest, ảnh OG`

### Task 10: Analytics and consent bar

**Files:**
- Create: `lib/analytics.ts`, `components/site/AnalyticsGate.tsx`, `components/site/ConsentBar.tsx`, `lib/consent.ts`
- Modify: `app/[locale]/layout.tsx`, `components/download/DownloadLink.tsx`, `components/site/LocaleSwitcher.tsx`, `components/home/Faq.tsx`, `components/site/ContactCard.tsx`, `messages/*.json` (`consent`)
- Test: `tests/unit/consent.test.ts`, `tests/unit/analytics.test.ts`

**Interfaces:**
```ts
// lib/analytics.ts
export type AnalyticsEvent =
  | { name: 'download_click'; platform: Platform; version: string; location: 'hero' | 'home_block' | 'download_page' | 'guide' }
  | { name: 'cta_click'; id: string; location: string }
  | { name: 'contact_click'; channel: 'email' | 'phone' | 'zalo' | 'maps' }
  | { name: 'locale_switch'; from: Locale; to: Locale }
  | { name: 'faq_open'; id: string }
  | { name: 'consent_change'; value: 'granted' | 'denied' }
export function track(event: AnalyticsEvent, deps?: { ga?: typeof sendGAEvent; vercel?: typeof vercelTrack; gaLoaded?: () => boolean }): void
// lib/consent.ts
export type Consent = 'granted' | 'denied' | 'unset'
export function readConsent(storage: Pick<Storage,'getItem'> | null): Consent
export function writeConsent(storage: Pick<Storage,'setItem'> | null, value: 'granted'|'denied'): void   // key 'docops.consent', JSON { value, at }
export function consentBannerEnabled(env = process.env.NEXT_PUBLIC_CONSENT_BANNER): boolean   // 'off' → false
```

- [ ] **Step 1: Failing tests**

```ts
// tests/unit/consent.test.ts
import { expect, test } from 'vitest'
import { consentBannerEnabled, readConsent, writeConsent } from '@/lib/consent'
test('read/write round trip and robustness', () => {
  const store = new Map<string, string>()
  const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v) } }
  expect(readConsent(storage)).toBe('unset')
  writeConsent(storage, 'granted'); expect(readConsent(storage)).toBe('granted')
  store.set('docops.consent', '{broken'); expect(readConsent(storage)).toBe('unset')
  expect(readConsent(null)).toBe('unset'); expect(() => writeConsent(null, 'denied')).not.toThrow()
  const throwing = { getItem: () => { throw new Error('blocked') } }; expect(readConsent(throwing)).toBe('unset')
})
test('banner flag', () => { expect(consentBannerEnabled('off')).toBe(false); expect(consentBannerEnabled(undefined)).toBe(true) })
```

```ts
// tests/unit/analytics.test.ts
import { expect, test, vi } from 'vitest'
import { track } from '@/lib/analytics'
test('sends to GA only when loaded and always to Vercel', () => {
  const ga = vi.fn(); const vercel = vi.fn()
  track({ name: 'download_click', platform: 'windows-x64', version: '1.0.0', location: 'hero' }, { ga, vercel, gaLoaded: () => false })
  expect(ga).not.toHaveBeenCalled()
  expect(vercel).toHaveBeenCalledWith('download_click', { platform: 'windows-x64', version: '1.0.0', location: 'hero' })
  track({ name: 'faq_open', id: 'key' }, { ga, vercel, gaLoaded: () => true })
  expect(ga).toHaveBeenCalledWith('event', 'faq_open', { id: 'key' })
})
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** `AnalyticsGate` (client): renders `<Analytics />` (`@vercel/analytics/next`) and `<SpeedInsights />` (`@vercel/speed-insights/next`) always; renders `<GoogleAnalytics gaId={id} />` only when `id` is set and (`!consentBannerEnabled()` or consent === 'granted'); listens to a `docops:consent` CustomEvent to flip without reload. `ConsentBar` (client): hidden until mounted; shows when banner enabled and consent unset; two buttons (44px), link to `/privacy`; on click `writeConsent`, dispatch event, `track({ name: 'consent_change', value })`. Wire `track` into `DownloadLink`, `LocaleSwitcher`, `Faq` (`onToggle`), contact links, hero/CTA buttons (`cta_click`).
- [ ] **Step 4:** `pnpm verify && pnpm build`; in `pnpm dev` with `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST`: no `googletagmanager.com` request before accepting, one after. **Step 5: Commit** `feat(analytics): Vercel Analytics, Speed Insights, GA4 sau đồng ý, sự kiện tải/CTA/liên hệ`

### Task 11: End-to-end tests, Lighthouse CI, GitHub Actions

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/pages.spec.ts`, `tests/e2e/download.spec.ts`, `tests/e2e/consent.spec.ts`, `tests/e2e/redirects.spec.ts`, `lighthouserc.json`, `.github/workflows/ci.yml`

- [ ] **Step 1: Playwright config** — `webServer: { command: 'pnpm start', port: 3000, reuseExistingServer: !process.env.CI }`, `use: { baseURL: 'http://localhost:3000' }`, projects `desktop-chromium` (1280×800) and `mobile-chromium` (`devices['Pixel 7']`).
- [ ] **Step 2: Specs** (write first, then run against a fresh `pnpm build`):

```ts
// tests/e2e/pages.spec.ts
import { expect, test } from '@playwright/test'
const PAGES = [['/', 'vi'], ['/en', 'en'], ['/tai-ve', 'vi'], ['/en/download', 'en'], ['/huong-dan-cai-dat/macos', 'vi'], ['/huong-dan-cai-dat/windows', 'vi'], ['/en/install/macos', 'en'], ['/en/install/windows', 'en'], ['/quy-trinh', 'vi'], ['/en/how-it-works', 'en'], ['/minh-bach-ai', 'vi'], ['/en/ai-transparency', 'en'], ['/lien-he', 'vi'], ['/en/contact', 'en'], ['/chinh-sach-bao-mat', 'vi'], ['/en/privacy', 'en']] as const
for (const [path, lang] of PAGES) test(`${path} renders with SEO basics`, async ({ page }) => {
  const errors: string[] = []; page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  const res = await page.goto(path); expect(res?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', lang)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(3)
  for (const s of await page.locator('script[type="application/ld+json"]').allTextContents()) JSON.parse(s)
  expect(errors).toEqual([])
})
test('locale switch keeps the page', async ({ page }) => {
  await page.goto('/tai-ve'); await page.getByRole('button', { name: 'EN' }).click(); await expect(page).toHaveURL(/\/en\/download$/)
})
```

`download.spec.ts`: on `/tai-ve` expect exactly 3 links whose `href` matches `^https://download-docsopapp\.agentra\.io\.vn/desktop/.*\.(exe|dmg)$`, one containing `DocOps%20Setup`. `consent.spec.ts`: with `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST` set in `webServer.env`, collect requests; before clicking accept none to `googletagmanager.com`; after clicking, at least one. `redirects.spec.ts`: `request.get('/xin-key', { maxRedirects: 0 })` → 308/301 with `location` `/lien-he`; `/login` → `/`. Mobile project: `/` shows the menu button and opening it reveals 4 nav links.

- [ ] **Step 3: lighthouserc.json**

```json
{ "ci": { "collect": { "startServerCommand": "pnpm start", "url": ["http://localhost:3000/", "http://localhost:3000/tai-ve", "http://localhost:3000/huong-dan-cai-dat/macos", "http://localhost:3000/en"], "numberOfRuns": 1, "settings": { "preset": "mobile" } },
  "assert": { "assertions": { "categories:performance": ["error", { "minScore": 0.9 }], "categories:seo": ["error", { "minScore": 1 }], "categories:accessibility": ["error", { "minScore": 0.95 }], "categories:best-practices": ["error", { "minScore": 0.95 }] } },
  "upload": { "target": "temporary-public-storage" } } }
```

- [ ] **Step 4: `.github/workflows/ci.yml`** — on push/PR: checkout, pnpm/action-setup, setup-node 24 with pnpm cache, `pnpm install --frozen-lockfile`, `pnpm verify`, `pnpm build` (env `NEXT_PUBLIC_SITE_URL=https://docops.agentra.io.vn`), `pnpm exec playwright install --with-deps chromium`, `pnpm e2e`, `pnpm lhci`.
- [ ] **Step 5:** Run locally: `pnpm build && pnpm e2e && pnpm lhci`; fix every failure (typical: missing `alt`, low contrast on muted text, unsized images). **Step 6: Commit** `test(e2e): Playwright hai ngôn ngữ, Lighthouse CI, GitHub Actions`

### Task 12: README, ops docs, final verification

**Files:**
- Modify: `README.md`, `.env.example`; Create: `docs/van-hanh.md` (release + domain cutover runbooks, Vietnamese)

- [ ] **Step 1:** README (Vietnamese): what the site is, `pnpm dev/build/verify/e2e/lhci`, structure, how to edit copy (`messages/*.json`, `content/**/*.mdx`, `lib/site.ts`), env table (spec §11), Vercel settings (framework Next.js, Node 24, function region `sin1`), release flow (upload to VPS → site refreshes ≤ 10 min → optional `pnpm sync-releases` + commit), domain cutover checklist (spec §14), and the design canvas link.
- [ ] **Step 2:** Full run: `pnpm verify && pnpm build && pnpm e2e && pnpm lhci` green; `git status` clean. **Step 3: Commit** `docs: README vận hành, quy trình phát hành và chuyển domain`

## Self-review notes

- Spec coverage: §5 → Task 2; §6.1 → Task 5; §6.2 → Task 6; §6.3 → Task 7; §6.4–6.7 → Task 8; §6.8 → Task 2; §7 → Task 4; §8 → Tasks 3, 5; §9 → Tasks 5, 9; §10 → Task 10; §11 → Tasks 1, 12; §12 → Tasks 4, 6; §13 → Tasks 4–11; §14 → Tasks 2, 11, 12.
- Type consistency: `ReleaseAsset`/`Platform` (Task 4) are consumed unchanged by Tasks 5, 6, 10; `PageKey`/`absoluteUrl` (Task 9) by Tasks 5–8 metadata; `track`/`AnalyticsEvent` (Task 10) by components introduced in Tasks 3, 5, 6, 8.
