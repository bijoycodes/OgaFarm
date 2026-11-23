// Turns dist/index.html into dist/artifact.html: page content without <!doctype>/<html>/<head>/<body>,
// because the artifact host adds its own document skeleton when publishing.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? '';
const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? '';
const keep = head
  .split('\n')
  .map(l => l.trim())
  .filter(l => l && !/^<meta (charset|name="viewport")/i.test(l));
const title = keep.find(l => l.startsWith('<title>'));
const rest = keep.filter(l => l !== title);
writeFileSync('dist/artifact.html', [title, ...rest, body.trim()].join('\n') + '\n');
console.log('dist/artifact.html written');
