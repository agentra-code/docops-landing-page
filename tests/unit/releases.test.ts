import { readFileSync } from 'node:fs'
import { describe, expect, test, vi } from 'vitest'
import { parse } from 'yaml'
import { fetchFeed } from '@/lib/releases/feed'
import { parseFeeds } from '@/lib/releases/parse'

const BASE = 'https://download-docsopapp.agentra.io.vn/desktop/'
const winYaml = readFileSync('tests/fixtures/latest.yml', 'utf8')
const win = parse(winYaml)
const mac = parse(readFileSync('tests/fixtures/latest-mac.yml', 'utf8'))

describe('parseFeeds', () => {
  test('maps the three platforms and skips zip/blockmap', () => {
    const assets = parseFeeds({ windows: win, mac }, BASE)
    expect(assets.map((a) => a.platform)).toEqual(['windows-x64', 'macos-arm64', 'macos-x64'])
    const w = assets[0]
    expect(w.fileName).toBe('DocOps Setup 1.0.0.exe')
    expect(w.url).toBe(`${BASE}DocOps%20Setup%201.0.0.exe`)
    expect(w.sizeBytes).toBe(157058273)
    expect(w.sha512).toBe(win.sha512)
    expect(w.version).toBe('1.0.0')
    expect(assets[1]).toMatchObject({ fileName: 'DocOps-1.0.0-arm64.dmg', sizeBytes: 194928638, version: '1.0.0' })
    expect(assets[2]).toMatchObject({ fileName: 'DocOps-1.0.0.dmg', sizeBytes: 199815749 })
    expect(assets.every((a) => a.releaseDate.startsWith('2026-09-15'))).toBe(true)
    expect(assets.every((a) => a.sha512.length > 80)).toBe(true)
  })

  test('missing or malformed feed yields no asset for that platform, no throw', () => {
    expect(parseFeeds({ mac }, BASE).map((a) => a.platform)).toEqual(['macos-arm64', 'macos-x64'])
    expect(parseFeeds({ windows: { nonsense: true }, mac: null }, BASE)).toEqual([])
    expect(parseFeeds({ windows: 'garbage', mac: 42 }, BASE)).toEqual([])
  })

  test('base url without trailing slash still joins correctly', () => {
    const [w] = parseFeeds({ windows: win }, BASE.replace(/\/$/, ''))
    expect(w.url).toBe(`${BASE}DocOps%20Setup%201.0.0.exe`)
  })
})

describe('fetchFeed', () => {
  const url = `${BASE}latest.yml`
  test('returns parsed YAML on 200', async () => {
    const ok = vi.fn().mockResolvedValue(new Response(winYaml, { status: 200 }))
    const data = (await fetchFeed(url, ok)) as { version: string }
    expect(data.version).toBe('1.0.0')
    expect(ok).toHaveBeenCalledWith(url, expect.objectContaining({ next: { revalidate: 600 } }))
  })
  test('returns null on 404, on network error and on invalid YAML', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await fetchFeed(url, vi.fn().mockResolvedValue(new Response('nope', { status: 404 })))).toBeNull()
    expect(await fetchFeed(url, vi.fn().mockRejectedValue(new Error('ECONNRESET')))).toBeNull()
    expect(await fetchFeed(url, vi.fn().mockResolvedValue(new Response('a: [b', { status: 200 })))).toBeNull()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
