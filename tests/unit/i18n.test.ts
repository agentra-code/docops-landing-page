import { describe, expect, test } from 'vitest'
import { routing } from '@/i18n/routing'
import en from '@/messages/en.json'
import vi from '@/messages/vi.json'

const flatten = (o: unknown, p = ''): string[] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o).flatMap(([k, v]) => flatten(v, p ? `${p}.${k}` : k))
    : [p]

describe('i18n', () => {
  test('pathnames cover every page in both locales', () => {
    const expected = ['/', '/download', '/install/[os]', '/how-it-works', '/ai-transparency', '/contact', '/privacy']
    expect(Object.keys(routing.pathnames).sort()).toEqual([...expected].sort())
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

  test('vi is the default locale without prefix', () => {
    expect(routing.defaultLocale).toBe('vi')
    expect(routing.localePrefix).toBe('as-needed')
    expect(routing.localeDetection).toBe(false)
  })
})
