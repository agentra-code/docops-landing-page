import { expect, test } from 'vitest'
import { breadcrumb, faqPage, howTo, organization, softwareApplication } from '@/lib/seo/jsonld'

const asset = {
  platform: 'windows-x64' as const,
  version: '1.0.0',
  fileName: 'DocOps Setup 1.0.0.exe',
  url: 'https://download-docsopapp.agentra.io.vn/desktop/DocOps%20Setup%201.0.0.exe',
  sizeBytes: 157058273,
  sha512: 'abc',
  releaseDate: '2026-09-15T15:22:00.690Z',
}

test('organization', () => {
  expect(organization()).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Agentra JSC',
    email: 'info@agentra.io.vn',
    url: 'https://agentra.io.vn',
  })
})

test('softwareApplication uses the feed version and both OS families', () => {
  const app = softwareApplication([asset], 'vi', 'https://docops.agentra.io.vn/tai-ve')
  expect(app).toMatchObject({
    '@type': 'SoftwareApplication',
    name: 'DocOps',
    softwareVersion: '1.0.0',
    operatingSystem: 'Windows 10, Windows 11, macOS 13+',
    applicationCategory: 'BusinessApplication',
    downloadUrl: 'https://docops.agentra.io.vn/tai-ve',
    inLanguage: 'vi',
  })
  expect(softwareApplication([], 'en', 'x')).not.toHaveProperty('softwareVersion')
})

test('faqPage, breadcrumb, howTo', () => {
  expect(faqPage([{ q: 'A?', a: 'B' }])).toMatchObject({
    '@type': 'FAQPage',
    mainEntity: [{ '@type': 'Question', name: 'A?', acceptedAnswer: { '@type': 'Answer', text: 'B' } }],
  })
  expect(breadcrumb([{ name: 'Home', url: 'https://x/' }, { name: 'Download', url: 'https://x/tai-ve' }]).itemListElement).toHaveLength(2)
  const h = howTo({ name: 'Install', description: 'd', steps: [{ name: 's1', text: 't1' }] })
  expect(h).toMatchObject({ '@type': 'HowTo', step: [{ '@type': 'HowToStep', name: 's1', text: 't1', position: 1 }] })
})
