// Snapshot the Penny icon set into public/penny-gh/ so the icons ship as static
// files in the published build (the /penny-gh dev proxy in vite.config.ts only
// exists on the dev server). Run before `build-storybook` when publishing.
//
// Mirrors the dev proxy: lists come from the GitHub contents API, SVGs from raw.
// Auth token comes from `gh auth token` (same as the proxy). Requires read access
// to the private melio/penny repo.
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const REPO = 'melio/penny';
const BRANCH = 'main';
const ICON_BASE = 'packages/penny-assets/src/assets/icons';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${ICON_BASE}`;
const API_BASE = `https://api.github.com/repos/${REPO}/contents/${ICON_BASE}`;
const FOLDERS = ['medium', 'small'];
const OUT = path.resolve('public/penny-gh');
const CONCURRENCY = 12;

let token = '';
try { token = execSync('gh auth token 2>/dev/null', { timeout: 5000 }).toString().trim(); } catch {}
if (!token) { console.error('No `gh auth token` found - run `gh auth login` (needs access to melio/penny).'); process.exit(1); }
const authHeaders = { Authorization: `token ${token}` };
const apiHeaders = { ...authHeaders, Accept: 'application/vnd.github.v3+json' };

async function pool(items, fn, size = CONCURRENCY) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

async function run() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(path.join(OUT, 'list'), { recursive: true });
  mkdirSync(path.join(OUT, 'icon'), { recursive: true });

  const byName = new Map(); // name.svg -> svg text (small wins, for /icon/)
  let total = 0;

  for (const folder of FOLDERS) {
    const apiRes = await fetch(`${API_BASE}/${folder}`, { headers: apiHeaders });
    if (!apiRes.ok) { console.error(`list ${folder}: HTTP ${apiRes.status}`); process.exit(1); }
    const items = await apiRes.json();
    const names = items.filter((f) => f.name.endsWith('.svg')).map((f) => f.name);
    writeFileSync(path.join(OUT, 'list', `${folder}.json`), JSON.stringify(names));
    mkdirSync(path.join(OUT, 'raw', folder), { recursive: true });

    await pool(names, async (name) => {
      const r = await fetch(`${RAW_BASE}/${folder}/${encodeURIComponent(name)}`, { headers: authHeaders });
      if (!r.ok) { console.warn(`  skip ${folder}/${name}: HTTP ${r.status}`); return; }
      const svg = await r.text();
      writeFileSync(path.join(OUT, 'raw', folder, name), svg);
      // /icon/<name> mirrors the proxy: small preferred, medium fallback.
      if (folder === 'small' || !byName.has(name)) byName.set(name, svg);
      total++;
    });
    console.log(`${folder}: ${names.length} icons`);
  }

  for (const [name, svg] of byName) writeFileSync(path.join(OUT, 'icon', name), svg);
  console.log(`Snapshot complete: ${total} raw SVGs, ${byName.size} /icon entries -> public/penny-gh/`);
}

run().catch((e) => { console.error(e); process.exit(1); });
