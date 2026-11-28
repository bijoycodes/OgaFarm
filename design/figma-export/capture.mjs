// Captures every OgaFarm app screen, in every demo state, in day and night, as 2x PNGs.
// Reads the screen list (read-only) from the app; drives the app's own "Screens" helper to switch states.
// Usage: start the app web preview (staging on :8090), then `npm run capture` (APP_URL to override).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_URL = (process.env.APP_URL ?? 'http://localhost:8090').replace(/\/$/, '');
const OUT = path.join(HERE, 'output', 'screens');
const W = 390, H = 844, SCALE = 2;
const LOOKS = ['light', 'dark'];

/* ---------- screen list from the app (read-only) ---------- */
const registrySrc = fs.readFileSync(path.join(HERE, '..', 'app-prototype-staging', 'src', 'proto', 'registry.ts'), 'utf8');
const groups = [];
for (const m of registrySrc.matchAll(/\{ title: '([^']+)', screens: \[([\s\S]*?)\] \}/g)) {
  const screens = [...m[2].matchAll(/\{ href: '([^']+)', title: '([^']+)', version: '(V\d)'/g)].map(s => ({ href: s[1], title: s[2], version: s[3] }));
  groups.push({ title: m[1] === 'Account and sign-in' ? 'Sign-in & account' : m[1], screens });
}
// Sheets and menus the app's list leaves out
const EXTRA = { '/buyer/browse': [{ href: '/buyer/filters', title: 'Filters (sheet)', version: 'V1' }], '/account': [{ href: '/role-menu?from=buyer', title: 'Avatar menu (sheet)', version: 'V1' }] };
for (const g of groups) g.screens = g.screens.flatMap(s => [s, ...(EXTRA[s.href] ?? []).filter(e => !g.screens.some(x => x.href === e.href))]);
// ONLY=/buyer/browse captures just matching screens (for a quick test)
if (process.env.ONLY) for (const g of groups) g.screens = g.screens.filter(s => s.href.includes(process.env.ONLY));

const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pause = ms => new Promise(r => setTimeout(r, ms));
const SCREENS_BTN = '[aria-label="Prototype: open the screens list"]';
const HIDE_HELPERS = `${SCREENS_BTN}{display:none!important}`;

/* ---------- capture ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });
// No entrance animations (the app's own web-only switch), so every capture is final
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('noanim', '1'); } catch {} });

const settle = async (ms = 900) => {
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await pause(ms);
  // wait for images in view to finish loading
  await page.waitForFunction(() => [...document.images].every(i => i.complete), { timeout: 8000 }).catch(() => {});
  await pause(200);
};
const shoot = async file => {
  const style = await page.addStyleTag({ content: HIDE_HELPERS });
  await pause(80);
  await page.screenshot({ path: path.join(OUT, file), type: 'png' });
  await style.evaluate(n => n.remove());
};
const openScreens = async () => {
  const btn = await page.$(SCREENS_BTN);
  if (!btn) return false;
  await btn.click();
  await page.waitForFunction(() => location.pathname === '/screens', { timeout: 5000 }).catch(() => {});
  await pause(500);
  return true;
};

// The state chips live in the helper's "State of …" section (the page below may have chips of its own)
const stateLabels = () => page.evaluate(() => {
  const head = [...document.querySelectorAll('div')].find(d => d.childElementCount === 0 && /^State of /.test(d.textContent ?? ''));
  return head ? [...head.parentElement.querySelectorAll('[role="checkbox"]')].map(e => e.getAttribute('aria-label')).filter(Boolean) : [];
});
const pickState = label => page.evaluate(l => {
  const head = [...document.querySelectorAll('div')].find(d => d.childElementCount === 0 && /^State of /.test(d.textContent ?? ''));
  const chip = head && [...head.parentElement.querySelectorAll('[role="checkbox"]')].find(e => e.getAttribute('aria-label') === l);
  chip?.click();
  return !!chip;
}, label);

const manifest = [];
let n = 0;
for (const [gi, g] of groups.entries()) {
  for (const [si, s] of g.screens.entries()) {
    for (const look of LOOKS) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: look }]);
      await page.goto(APP_URL + s.href, { waitUntil: 'networkidle0', timeout: 60000 });
      await settle();

      // Which demo states does this screen have? (chips in the Screens helper)
      let states = [];
      if (await page.$(SCREENS_BTN)) {
        await openScreens();
        states = await stateLabels();
        await page.goBack(); await settle(600);
      }
      if (!states.length) states = ['Default'];

      for (const [ti, state] of states.entries()) {
        if (ti > 0) {
          await openScreens();
          if (!(await pickState(state))) console.warn(`\n  could not pick state "${state}" on ${s.href}`);
          await pause(250);
          await page.goBack();
          await settle(500); // short: some states move on by themselves after a few seconds
        }
        const file = `${String(gi + 1).padStart(2, '0')}-${String(si + 1).padStart(2, '0')}-${slug(s.title)}--${slug(state)}--${look === 'light' ? 'day' : 'night'}.png`;
        await shoot(file);
        manifest.push({ group: g.title, groupIndex: gi, screenIndex: si, title: s.title, version: s.version, href: s.href, state, stateIndex: ti, look: look === 'light' ? 'Day' : 'Night', file, width: W, height: H, scale: SCALE });
        n++;
        process.stdout.write(`\r${n} captured · ${g.title} · ${s.title} · ${state} · ${look}          `);
      }
    }
  }
}
await browser.close();
fs.writeFileSync(path.join(HERE, 'output', 'manifest.json'), JSON.stringify({ app: APP_URL, captured: new Date().toISOString(), screens: manifest }, null, 2));
console.log(`\nDone: ${n} images in ${path.relative(process.cwd(), OUT)}`);
