// One-command publish for the public Storybook site.
//   npm run deploy
// Steps: refresh the Penny icon snapshot -> build Storybook -> strip heavy/private
// bits -> force-push the built site to the shicogit.github.io repo (served at root).
// The source repo stays separate; only the compiled site is published.
import { execSync } from 'node:child_process';
import { cpSync, rmSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SITE_REMOTE = 'git@github.com:shicogit/shicogit.github.io.git';
const BUILD_DIR = path.resolve('storybook-static');
const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

// 1. Refresh icons from Penny (so each publish picks up the latest icon set).
sh('node scripts/snapshot-penny-icons.mjs');

// 2. Build the static Storybook.
sh('npm run build-storybook');

// 3. Stage a clean copy of the build.
const stage = mkdtempSync(path.join(tmpdir(), 'melio-site-'));
cpSync(BUILD_DIR, stage, { recursive: true });
// Drop After-Effects .mov deliverables (too large for Pages; not used for display).
sh(`find "${stage}" -name '*.mov' -delete`);
// Drop orphaned employee headshots (contacts block was removed from the pages).
rmSync(path.join(stage, 'contacts'), { recursive: true, force: true });
// .nojekyll so GitHub Pages serves the Storybook assets verbatim.
writeFileSync(path.join(stage, '.nojekyll'), '');

// 4. Publish: fresh single-commit branch (no history bloat), force-push to the site repo.
const git = `git -c user.email="shira.giladi@xero.com" -c user.name="shicogit"`;
sh(`git init -q && git checkout -q -b main && git add -A && ${git} commit -q -m "Publish Storybook"`, { cwd: stage });
sh(`git remote add origin ${SITE_REMOTE} && git push -f origin main`, { cwd: stage });

console.log('\nDeployed. Live shortly at https://shicogit.github.io/ (Pages rebuilds in ~1 min).');
