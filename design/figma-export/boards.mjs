// Builds Figma-ready SVG boards from the captured screens (output/manifest.json).
// One SVG per group; drag it into Figma and it becomes one board with named layers:
// a row per screen, a pair of phone frames (Day · Night) per demo state, with titles.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'output');
const { screens } = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));

const W = 390, H = 844, R = 36;           // phone screen size (points) and corner radius
const PAIR_GAP = 24, STATE_GAP = 72, ROW_GAP = 120, PAD = 120;
const CAP_H = 76, LOOK_H = 30, HEAD_H = 190;
const C = { bg: '#F5FAF6', ink: '#173D2A', muted: '#536A5D', line: '#DCEADF', green: '#2D7A4E', soft: '#E5F2E9', v2: '#285F92', v2bg: '#E7F0F8' };
const FONT = "'Nunito Sans', 'Helvetica Neue', Arial, sans-serif";
const DISPLAY = "'Lora', Georgia, serif";

const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = file => `data:image/png;base64,${fs.readFileSync(path.join(OUT, 'screens', file)).toString('base64')}`;
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const groups = [...new Set(screens.map(s => s.groupIndex))].sort((a, b) => a - b);
const written = [];

for (const gi of groups) {
  const items = screens.filter(s => s.groupIndex === gi);
  const group = items[0].group;
  // rows: one per screen; columns: its states (each a Day/Night pair)
  const rows = [...new Set(items.map(s => s.screenIndex))].sort((a, b) => a - b).map(si => {
    const of = items.filter(s => s.screenIndex === si);
    const states = [...new Set(of.map(s => s.stateIndex))].sort((a, b) => a - b).map(ti => ({
      name: of.find(s => s.stateIndex === ti).state,
      day: of.find(s => s.stateIndex === ti && s.look === 'Day'),
      night: of.find(s => s.stateIndex === ti && s.look === 'Night')
    }));
    return { title: of[0].title, version: of[0].version, href: of[0].href, states };
  });

  const pairW = W * 2 + PAIR_GAP;
  const width = PAD * 2 + Math.max(...rows.map(r => r.states.length * pairW + (r.states.length - 1) * STATE_GAP));
  const rowH = CAP_H + LOOK_H + H;
  const height = PAD + HEAD_H + rows.length * rowH + (rows.length - 1) * ROW_GAP + PAD;
  const totalImages = rows.reduce((n, r) => n + r.states.length * 2, 0);

  let defs = '', body = '';
  let y = PAD + HEAD_H;
  rows.forEach((r, ri) => {
    let x = PAD;
    let rowSvg = '';
    r.states.forEach((st, ti) => {
      const id = `${ri}-${ti}`;
      const v2 = r.version === 'V2';
      // caption: screen name, version badge, state
      let card = `<text x="${x}" y="${y + 30}" font-family="${FONT}" font-size="26" font-weight="800" fill="${C.ink}">${esc(r.title)}</text>`;
      card += `<rect x="${x}" y="${y + 44}" width="40" height="24" rx="6" fill="${v2 ? C.v2bg : C.soft}"/>`;
      card += `<text x="${x + 20}" y="${y + 61}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="${v2 ? C.v2 : C.green}">${r.version}</text>`;
      card += `<text x="${x + 52}" y="${y + 62}" font-family="${FONT}" font-size="18" font-weight="700" fill="${C.muted}">${esc(st.name)}${r.states.length > 1 ? ` · state ${ti + 1} of ${r.states.length}` : ''}</text>`;
      for (const [k, shot] of [['Day', st.day], ['Night', st.night]]) {
        if (!shot) continue;
        const fx = k === 'Day' ? x : x + W + PAIR_GAP, fy = y + CAP_H + LOOK_H;
        defs += `<clipPath id="c${id}${k}"><rect x="${fx}" y="${fy}" width="${W}" height="${H}" rx="${R}"/></clipPath>`;
        card += `<g id="${esc(`${k}`)}">`
          + `<text x="${fx}" y="${fy - 10}" font-family="${FONT}" font-size="14" font-weight="800" letter-spacing="1.5" fill="${C.muted}">${k.toUpperCase()}</text>`
          + `<rect x="${fx - 1}" y="${fy - 1}" width="${W + 2}" height="${H + 2}" rx="${R + 1}" fill="none" stroke="${C.line}" stroke-width="2"/>`
          + `<image x="${fx}" y="${fy}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#c${id}${k})" href="${img(shot.file)}"/>`
          + `</g>`;
      }
      rowSvg += `<g id="${esc(`${r.title} — ${st.name}`)}">${card}</g>`;
      x += pairW + STATE_GAP;
    });
    body += `<g id="${esc(r.title)}">${rowSvg}</g>`;
    y += rowH + ROW_GAP;
  });

  const head = `<g id="Header">`
    + `<text x="${PAD}" y="${PAD + 56}" font-family="${DISPLAY}" font-size="64" font-weight="600" fill="${C.ink}">OgaFarm app · ${esc(group)}</text>`
    + `<text x="${PAD}" y="${PAD + 104}" font-family="${FONT}" font-size="24" fill="${C.muted}">${rows.length} screens · ${totalImages} frames (every demo state, day and night) · iPhone ${W}×${H} · sample data</text>`
    + `<rect x="${PAD}" y="${PAD + 134}" width="${width - PAD * 2}" height="2" fill="${C.line}"/></g>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
    + `<title>OgaFarm app · ${esc(group)}</title><defs>${defs}</defs>`
    + `<rect id="Background" width="${width}" height="${height}" fill="${C.bg}"/>${head}${body}</svg>`;
  const name = `OgaFarm-app-${String(gi + 1).padStart(2, '0')}-${slug(group)}.svg`;
  fs.writeFileSync(path.join(OUT, name), svg);
  written.push(`${name}  (${rows.length} screens, ${totalImages} frames, ${(Buffer.byteLength(svg) / 1048576).toFixed(1)} MB)`);
}
console.log(written.join('\n'));
