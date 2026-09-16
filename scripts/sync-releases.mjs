// Cập nhật content/releases.json từ feed phát hành (URL) hoặc từ thư mục release cục bộ.
// Dùng: node scripts/sync-releases.mjs [--from <url|thư mục>]   (mặc định: DOWNLOAD_FEED_URL hoặc URL VPS)
import { readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse } from 'yaml'

const DEFAULT_URL = 'https://download-docsopapp.agentra.io.vn/desktop/'
const idx = process.argv.indexOf('--from')
const from = idx > -1 ? process.argv[idx + 1] : process.env.DOWNLOAD_FEED_URL || DEFAULT_URL

async function readSource(name) {
  const isDir = await stat(from).then((s) => s.isDirectory()).catch(() => false)
  if (isDir) return readFile(join(from, name), 'utf8')
  const base = from.endsWith('/') ? from : `${from}/`
  const res = await fetch(base + name, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`${base}${name}: HTTP ${res.status}`)
  return res.text()
}

const [windows, mac] = await Promise.all([readSource('latest.yml'), readSource('latest-mac.yml')])
const out = { windows: parse(windows), mac: parse(mac) }
await writeFile('content/releases.json', `${JSON.stringify(out, null, 2)}\n`)
console.log(`content/releases.json ← ${from} (Windows ${out.windows?.version}, macOS ${out.mac?.version})`)
