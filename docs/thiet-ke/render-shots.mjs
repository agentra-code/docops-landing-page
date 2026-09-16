// Chụp artboard của app desktop (docops-application/docs/thiet-ke/*.dc.html) thành ảnh PNG 2x.
// Artboard là Design Component: có <sc-for> và lỗ {{...}} do renderVals() cấp. Bộ render tối giản
// dưới đây khai triển chúng đủ để chụp ảnh tĩnh — không phải runtime thật của Claude Design.
// Dùng: node docs/thiet-ke/render-shots.mjs <thư mục artboard> <thư mục ra> <Ten1> <Ten2> ...
import { createRequire } from 'node:module';
import { join } from 'node:path';
const require = createRequire('/Users/lehuuphu/Documents/workspace/AGENTRA-JSC/docops-application/packages/desktop/package.json');
const { chromium } = require('@playwright/test');

const [srcDir, outDir, ...names] = process.argv.slice(2);
if (!srcDir || !outDir || names.length === 0) {
  console.error('usage: render-shots.mjs <artboard dir> <out dir> <Name...>');
  process.exit(2);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.addInitScript(() => {
  window.DCLogic = class DCLogic { constructor(props) { this.props = props || {}; this.state = {}; } setState() {} forceUpdate() {} };
});
for (const name of names) {
  const file = join(srcDir, `${name}.dc.html`);
  await page.goto('file://' + file, { waitUntil: 'load' });
  await page.evaluate(() => {
    const vals = (typeof Component === 'function') ? (new Component({}).renderVals?.() ?? {}) : {};
    const lookup = (scope, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
    const fill = (html, scope) => html.replace(/\{\{\s*([\w$.]+)\s*\}\}/g, (m, p) => { const v = lookup(scope, p); return v === undefined ? m : String(v); });
    const outermost = (root) => Array.from(root.querySelectorAll('sc-for')).filter((n) => !n.parentElement?.closest('sc-for'));
    const renderFor = (el, scope) => {
      const listPath = (el.getAttribute('list') || '').replace(/[{}\s]/g, '');
      const alias = el.getAttribute('as') || 'item';
      const list = lookup(scope, listPath) || [];
      const tpl = el.innerHTML;
      return list.map((item, i) => {
        const s = Object.assign({}, scope, { [alias]: item, $index: i });
        const tmp = document.createElement('div');
        tmp.innerHTML = tpl;
        for (const n of outermost(tmp)) n.outerHTML = renderFor(n, s);
        return fill(tmp.innerHTML, s);
      }).join('');
    };
    for (const n of outermost(document.body)) n.outerHTML = renderFor(n, vals);
    for (const n of Array.from(document.querySelectorAll('sc-if'))) n.outerHTML = n.innerHTML;
    document.body.innerHTML = fill(document.body.innerHTML, vals);
  });
  await page.waitForTimeout(500);
  const out = join(outDir, `${name}.png`);
  await page.screenshot({ path: out, fullPage: false, type: 'png' });
  console.log('wrote', out);
}
await browser.close();
