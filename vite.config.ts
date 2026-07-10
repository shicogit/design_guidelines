/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { execSync } from 'node:child_process';
import type { Plugin } from 'vite';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const REPO = 'melio/penny';
const BRANCH = 'main';
const ICON_BASE = 'packages/penny-assets/src/assets/icons';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${ICON_BASE}`;
const API_BASE = `https://api.github.com/repos/${REPO}/contents/${ICON_BASE}`;

function pennyGitHubPlugin(): Plugin {
  let token = '';
  try {
    token = execSync('gh auth token 2>/dev/null', { timeout: 3000 }).toString().trim();
  } catch {
    // no gh token found — will fetch without auth (fails for private repos)
  }

  const authHeaders: Record<string, string> = token ? { Authorization: `token ${token}` } : {};
  const apiHeaders = { ...authHeaders, Accept: 'application/vnd.github.v3+json' };

  // Server-side cache so each unique icon is fetched from GitHub only once per session.
  const svgCache = new Map<string, string>();
  const listCache = new Map<string, string[]>();

  return {
    name: 'penny-github',
    configureServer(server) {
      server.middlewares.use('/penny-gh', async (req, res, next) => {
        const url = req.url ?? '';

        try {
          // /penny-gh/list/medium.json  or  /penny-gh/list/small.json
          if (url.startsWith('/list/')) {
            const folder = url.replace('/list/', '').replace('.json', '');
            if (!listCache.has(folder)) {
              const apiRes = await fetch(`${API_BASE}/${folder}`, { headers: apiHeaders });
              const items: Array<{ name: string }> = await apiRes.json();
              listCache.set(folder, items.filter((f) => f.name.endsWith('.svg')).map((f) => f.name));
            }
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'max-age=300');
            res.end(JSON.stringify(listCache.get(folder)));
            return;
          }

          // /penny-gh/raw/medium/academy.svg  or  /penny-gh/raw/small/search.svg
          if (url.startsWith('/raw/')) {
            const iconPath = url.replace('/raw/', '');
            if (!svgCache.has(iconPath)) {
              const rawRes = await fetch(`${RAW_BASE}/${iconPath}`, { headers: authHeaders });
              if (!rawRes.ok) { res.statusCode = 404; res.end(''); return; }
              svgCache.set(iconPath, await rawRes.text());
            }
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'max-age=300');
            res.end(svgCache.get(iconPath));
            return;
          }

          // /penny-gh/icon/{name}.svg — tries small first, then medium (for DsIcon)
          if (url.startsWith('/icon/')) {
            const filename = url.replace('/icon/', '');
            const cacheKey = `icon/${filename}`;
            if (!svgCache.has(cacheKey)) {
              let svg = '';
              for (const folder of ['small', 'medium']) {
                const rawRes = await fetch(`${RAW_BASE}/${folder}/${filename}`, { headers: authHeaders });
                if (rawRes.ok) { svg = await rawRes.text(); break; }
              }
              if (!svg) { res.statusCode = 404; res.end(''); return; }
              svgCache.set(cacheKey, svg);
            }
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'max-age=300');
            res.end(svgCache.get(cacheKey));
            return;
          }

          next();
        } catch (err) {
          console.error('[penny-github]', err);
          res.statusCode = 500;
          res.end('');
        }
      });
    },
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), pennyGitHubPlugin()],
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
