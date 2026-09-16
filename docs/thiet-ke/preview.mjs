// Xem thử artboard bằng Playwright: đo chiều cao thật (→ heights.json) và chụp toàn trang.
// Dùng: node docs/thiet-ke/preview.mjs <thư mục ảnh ra> [Ten1 Ten2 ...]   (mặc định: mọi *.dc.html)
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('/Users/lehuuphu/Documents/workspace/AGENTRA-JSC/docops-application/packages/desktop/package.json');
const { chromium } = require('@playwright/test');

const here = dirname(fileURLToPath(import.meta.url));
const [outDir, ...only] = process.argv.slice(2);
const names = (only.length ? only.map((n) => `${n}.dc.html`) : readdirSync(here).filter((f) => f.endsWith('.dc.html'))).sort();
const canvas = JSON.parse(readFileSync(join(here, 'canvas.json'), 'utf8'));
const widthOf = (file) => canvas.artboards.find((a) => a.file === file)?.w ?? 1440;

const browser = await chromium.launch();
const heights = existsSync(join(here, 'heights.json')) ? JSON.parse(readFileSync(join(here, 'heights.json'), 'utf8')) : {};
for (const file of names) {
  const page = await browser.newPage({ viewport: { width: widthOf(file), height: 900 }, deviceScaleFactor: 1 });
  await page.route('**/*.{jpg,jpeg,png,webp,svg}', (route) => {
    const p = join(here, 'images', basename(new URL(route.request().url()).pathname));
    existsSync(p) ? route.fulfill({ path: p }) : route.abort();
  });
  await page.route('**/support.js', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await page.goto('file://' + join(here, file), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  heights[file] = h;
  if (outDir) await page.screenshot({ path: join(outDir, file.replace('.dc.html', '.png')), fullPage: true });
  console.log(`${file}: ${widthOf(file)}×${h}`);
  await page.close();
}
await browser.close();
writeFileSync(join(here, 'heights.json'), JSON.stringify(heights, null, 2) + '\n');
