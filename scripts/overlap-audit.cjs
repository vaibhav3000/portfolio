/* Overlap audit v2: effective-opacity aware. */
const { chromium, devices } = require('playwright-core');
const path = require('path');
const os = require('os');

(async () => {
  const browser = await chromium.launch({ executablePath: path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1228', 'chrome-win64', 'chrome.exe') });
  const LABS = { 's4-to-mamba': 8, aire: 10, 'repo-engineer': 10 };
  let found = 0;
  for (const dark of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.evaluate(() => { history.scrollRestoration = 'manual'; });
    if (dark) await page.click('button[aria-label="Switch to dark mode"]');
    await page.waitForTimeout(1200);
    for (const slug of Object.keys(LABS)) {
      await page.click('#dd-tab-' + slug);
      await page.waitForTimeout(1400);
      for (let s2 = 0; s2 < LABS[slug]; s2++) {
        await page.evaluate((k) => { const segs = document.querySelectorAll('[role=group][aria-label="Lab controls"] button'); segs[7 + k]?.click(); }, s2);
        await page.waitForTimeout(700);
        const issues = await page.evaluate(() => {
          const panel = document.querySelector('[role=tabpanel]');
          const els = Array.from(panel.querySelectorAll('*')).filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width < 4 || r.height < 4 || el.children.length > 0 || !el.textContent.trim()) return false;
            let p = el, op = 1;
            while (p && p !== document.body) { op *= parseFloat(getComputedStyle(p).opacity || 1); if (op < 0.1) return false; p = p.parentElement; }
            return true;
          });
          const out = [];
          for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
            const a = els[i].getBoundingClientRect(), b = els[j].getBoundingClientRect();
            const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (ox > 3 && oy > 3 && !els[i].contains(els[j]) && !els[j].contains(els[i]))
              out.push(els[i].textContent.trim().slice(0, 15) + ' x ' + els[j].textContent.trim().slice(0, 15));
          }
          return out.slice(0, 3);
        });
        if (issues.length) { found++; console.log('[dark=' + dark + '] ' + slug + ' step ' + (s2 + 1) + ':', JSON.stringify(issues)); }
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log(found === 0 ? 'AUDIT CLEAN - zero overlaps' : found + ' overlaps found');
})();
