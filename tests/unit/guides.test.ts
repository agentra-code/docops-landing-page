import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { GUIDE_OS, isGuideOs } from '@/content/install'

for (const locale of ['vi', 'en']) {
  for (const os of GUIDE_OS) {
    test(`${locale}/${os} guide exports meta, has no internal notes and carries the key facts`, () => {
      const src = readFileSync(`content/install/${locale}/${os}.mdx`, 'utf8')
      expect(src).toMatch(/export const meta = \{/)
      expect(src).toMatch(/toc: \[/)
      expect(src).not.toMatch(/nội bộ|internal note|người gửi/i)
      expect(src).toContain('DOCOPS-XXXX-XXXX-XXXX')
      if (os === 'macos') expect(src).toContain('xattr -dr com.apple.quarantine /Applications/DocOps.app')
      if (os === 'windows') expect(src).toMatch(/Run anyway/)
    })
  }
}

test('isGuideOs', () => {
  expect(isGuideOs('macos')).toBe(true)
  expect(isGuideOs('linux')).toBe(false)
})
