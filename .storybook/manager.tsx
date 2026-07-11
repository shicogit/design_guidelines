import { addons } from 'storybook/manager-api';
import lottie, { AnimationItem } from 'lottie-web';
import melioTheme from './melio-theme';

addons.setConfig({
  theme: melioTheme,
});

/* "Visual Assets" is a non-clickable grouping label (no landing page) - swallow its
   clicks so it neither navigates nor collapses, keeping its children always listed.
   Identity / Foundations / Standards are plain collapsible group headers. */
addons.register('melio/section-links', () => {
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest?.('button') as HTMLElement | null;
      if (!btn) return;

      if (btn.id === 'identity-visual-assets') {
        // a one-shot synthetic click we fire to re-expand it — let it through
        if (btn.hasAttribute('data-melio-expanding')) {
          btn.removeAttribute('data-melio-expanding');
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
});

/* Default state: groups start collapsed (Overview is the landing page). On first render we
   collapse each group that doesn't contain the currently-selected page, so at most the group
   you deep-linked into stays open - and on Overview, all of them close. Runs once. */
addons.register('melio/default-collapsed', () => {
  const GROUPS = ['foundations', 'identity', 'standards', 'writing'];
  setTimeout(() => {
    GROUPS.forEach((id) => {
      const root = document.getElementById(id);
      if (!root) return;
      const hasSelected = !!root.querySelector('[data-selected="true"]');
      const btn = root.querySelector('button[data-action="collapse-root"]') as HTMLElement | null;
      if (!hasSelected && btn && btn.getAttribute('aria-expanded') === 'true') btn.click();
    });
  }, 1000);
});

/* Clicking a collapsed group header navigates to its first child page.
   Sidebar items are a flat list — group children are next-siblings of the heading div,
   not descendants. We click the first child item directly so Storybook handles routing. */
addons.register('melio/section-navigate', () => {
  const GROUPS = ['foundations', 'identity', 'standards', 'writing'];
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement | null)?.closest?.('button[data-action="collapse-root"]') as HTMLElement | null;
    if (!btn) return;
    // The button's direct parent is the group heading div (has data-item-id)
    const groupEl = btn.parentElement as HTMLElement | null;
    const groupId = groupEl?.getAttribute('data-item-id') ?? '';
    if (!GROUPS.includes(groupId)) return;
    // Only act when expanding (was collapsed before this click)
    if (btn.getAttribute('aria-expanded') !== 'false') return;
    // Retry until children appear in DOM (they render asynchronously after expand)
    const tryClick = (attemptsLeft: number) => {
      let sib = groupEl!.nextElementSibling as HTMLElement | null;
      while (sib) {
        if (sib.classList.contains('sidebar-item')) {
          const link = sib.querySelector('a[href]') as HTMLAnchorElement | null;
          if (link) link.click();
          return;
        }
        if (sib.classList.contains('sidebar-subheading') && GROUPS.includes(sib.getAttribute('data-item-id') ?? '')) break;
        sib = sib.nextElementSibling as HTMLElement | null;
      }
      // Children not yet in DOM — retry
      if (attemptsLeft > 0) setTimeout(() => tryClick(attemptsLeft - 1), 60);
    };
    setTimeout(() => tryClick(8), 100);
  });
});

/* Accordion: opening one top-level group collapses the others, so only one is open at a time. */
addons.register('melio/accordion', () => {
  const GROUPS = ['foundations', 'identity', 'standards', 'writing'];
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement | null)?.closest?.('button[data-action="collapse-root"]') as HTMLElement | null;
    if (!btn) return;
    const root = btn.parentElement as HTMLElement | null;
    if (!root || !GROUPS.includes(root.id)) return;
    // After the native toggle settles, if this group is now open, collapse the others.
    setTimeout(() => {
      if (btn.getAttribute('aria-expanded') !== 'true') return;
      GROUPS.forEach((id) => {
        if (id === root.id) return;
        const ob = document.getElementById(id)?.querySelector(
          'button[data-action="collapse-root"]',
        ) as HTMLElement | null;
        if (ob && ob.getAttribute('aria-expanded') === 'true') ob.click();
      });
    }, 0);
  });
});

/* Mark a section title as "pressed" (data-melio-active) while its Overview
   page is the open one — so CSS can turn its text/icon purple. */
addons.register('melio/active-section', (api) => {
  // Keep Visuals expanded so it reads as a static (non-collapsable) title with
  // its children always listed. If it ever collapses, fire its own native
  // toggle (flagged so the click-interceptor lets it through) to re-open it.
  const keepExpanded = () => {
    const visBtn = document.getElementById('identity-visual-assets');
    if (visBtn && visBtn.getAttribute('aria-expanded') === 'false') {
      visBtn.setAttribute('data-melio-expanding', '');
      visBtn.click();
    }
  };
  const sync = () => {
    // Visual Assets pressed (purple text) — its own Overview page is open
    const visActive = !!document.querySelector(
      '[data-item-id="identity-visual-assets-overview--docs"][data-selected="true"]'
    );
    // Visual Assets "child active" — any page under Visual Assets is open
    const visSection = !!document.querySelector(
      '[data-item-id^="identity-visual-assets"][data-selected="true"]'
    );
    const visBtn = document.getElementById('identity-visual-assets');
    if (visBtn) {
      visBtn.toggleAttribute('data-melio-active', visActive);
      visBtn.toggleAttribute('data-melio-section', visSection);
      // Visual Assets is non-collapsable: if it ever collapses, force it open again.
      if (visBtn.getAttribute('aria-expanded') === 'false') keepExpanded();
    }
  };
  setTimeout(() => {
    keepExpanded();
    const tree = document.getElementById('storybook-explorer-tree') || document.body;
    new MutationObserver(sync).observe(tree, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ['data-selected', 'aria-expanded'],
    });
    sync();
  }, 800);
});

/* Move the standalone reference pages ("Marketing", then "Changelog") to the very bottom of the
   sidebar. Storybook hoists single-doc roots above grouped roots, so storySort alone can't push
   them below "Identity" — we re-append them after Identity once the tree renders.
   Order in the array = final order at the bottom. Defensive: only acts when an item shares the
   Identity container, so it can never break the tree layout. */
addons.register('melio/move-bottom-pages', () => {
  const BOTTOM = ['collaborators--docs', 'changelog--docs', 'penny-test--docs'];
  const moveLast = () => {
    const be = document.getElementById('identity');
    if (!be || !be.parentElement) return;
    const parent = be.parentElement;
    // Collect the bottom items, in desired order, only if all share the Identity container.
    const items: Element[] = [];
    for (const id of BOTTOM) {
      const item = document.querySelector(`.sidebar-item[data-item-id="${id}"]`);
      if (!item || item.parentElement !== parent) return; // not all present in the shared container yet
      items.push(item);
    }
    // Idempotency guard: if they already sit, in order, as the final children, do nothing.
    // (Appending unconditionally each tick would make the two items swap "last" forever -> a
    //  MutationObserver loop that hangs the manager and blanks the whole UI.)
    const tail = Array.prototype.slice.call(parent.children, -items.length);
    const alreadyOrdered = items.every((it, i) => tail[i] === it);
    if (alreadyOrdered) return;
    items.forEach((it) => parent.appendChild(it));
  };
  setTimeout(() => {
    const tree = document.getElementById('storybook-explorer-tree') || document.body;
    new MutationObserver(moveLast).observe(tree, { childList: true, subtree: true });
    moveLast();
  }, 800);
});

/* Yellow "WIP" pill next to pages that are still in progress. */
addons.register('melio/wip-labels', () => {
  const WIP = [
    'identity-visual-assets-motion--docs',
    'identity-visual-assets-simplified-ui--docs',
    'identity-visual-assets-imagery--docs',
    'writing-voice-tone--docs',
  ];
  const PILL = 'display:inline-block;margin-left:6px;padding:1px 5px;font-size:10px;font-weight:600;line-height:1.5;border-radius:999px;background:#FEF9C3;color:#854D0E;border:1px solid #FDE047;vertical-align:middle;flex-shrink:0;font-family:inherit';
  const paint = () => {
    WIP.forEach((id) => {
      const item = document.querySelector(`.sidebar-item[data-item-id="${id}"]`);
      if (!item || item.querySelector('[data-melio-wip]')) return;
      const link = item.querySelector('a');
      if (!link) return;
      const pill = document.createElement('span');
      pill.setAttribute('data-melio-wip', '');
      pill.style.cssText = PILL;
      pill.textContent = 'WIP';
      link.appendChild(pill);
    });
  };
  setTimeout(() => {
    const tree = document.getElementById('storybook-explorer-tree') || document.body;
    new MutationObserver(paint).observe(tree, { childList: true, subtree: true });
    paint();
  }, 900);
});

/* Section sub-tabs in the sidebar (Option B): a page that uses in-page section tabs
   (BrandPage `sections`) gets matching sidebar links injected beneath it. Clicking one
   selects that page's story and tells the live page (via postMessage) to switch to the
   section. The page reports its active section back, so the right link stays highlighted.
   Add a page here to give it sidebar sub-tabs. */
addons.register('melio/section-subtabs', (api) => {
  const PAGES: { id: string; sections: string[] }[] = [
    { id: 'writing-brand-narrative--docs',                sections: ['Principles', 'The Melio Difference', 'Brand Personality', 'Samples'] },
    { id: 'identity-logo--docs',                          sections: ['melio', 'Co-Branding', 'Resources'] },
    { id: 'identity-color--docs',                         sections: ['Guidelines', 'Resources'] },
    { id: 'identity-typography--docs',                    sections: ['Guidelines', 'Resources'] },
    { id: 'identity-visual-assets-motion--docs',          sections: ['Guidelines', 'Resources'] },
    { id: 'identity-visual-assets-illustrations--docs',   sections: ['Mel', 'Product', 'Devs', 'Resources'] },
    { id: 'identity-visual-assets-icons--docs',           sections: ['Guidelines', 'Resources'] },
    { id: 'identity-visual-assets-simplified-ui--docs',   sections: ['Guidelines', 'Resources'] },
    { id: 'identity-visual-assets-imagery--docs',         sections: ['Guidelines', 'Mel in images', 'Resources'] },
    { id: 'identity-visual-assets-agent-mel--docs',       sections: ['Guidelines', 'Resources'] },
  ];
  let activeSec = '';

  const previewWindow = () => {
    const f = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null;
    return f && f.contentWindow;
  };

  const go = (pageId: string, label: string) => {
    activeSec = label;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('sec', label);
      window.history.replaceState(window.history.state, '', url.toString());
    } catch {
      /* ignore */
    }
    api.selectStory(pageId);
    // Switch the live page's tab — retry a few times to cover the page mounting.
    [60, 220, 500].forEach((t) =>
      setTimeout(() => previewWindow()?.postMessage({ type: 'melio:setsection', sec: label }, '*'), t)
    );
    paintActive();
  };

  const paintActive = () => {
    document.querySelectorAll('.melio-subtabs a').forEach((a) => {
      a.toggleAttribute('data-active', (a as HTMLElement).dataset.sec === activeSec);
    });
  };

  const render = () => {
    PAGES.forEach((page) => {
      const item = document.querySelector(`.sidebar-item[data-item-id="${page.id}"]`);
      const wrapId = `melio-subtabs-${page.id}`;
      const existing = document.getElementById(wrapId);
      const selected = !!item && item.getAttribute('data-selected') === 'true';
      if (!item || !selected) {
        existing?.remove();
        return;
      }
      if (existing) return; // already present
      const wrap = document.createElement('div');
      wrap.id = wrapId;
      wrap.className = 'melio-subtabs';
      page.sections.forEach((label) => {
        const a = document.createElement('a');
        a.className = 'melio-subtab';
        a.textContent = label;
        a.href = 'javascript:void 0';
        a.dataset.sec = label;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          go(page.id, label);
        });
        wrap.appendChild(a);
      });
      item.insertAdjacentElement('afterend', wrap);
      paintActive();
    });
  };

  // Page reports its active section → keep the matching link highlighted.
  window.addEventListener('message', (e: MessageEvent) => {
    if (e?.data?.type === 'melio:sectionchanged' && typeof e.data.sec === 'string') {
      activeSec = e.data.sec;
      paintActive();
    }
  });

  // Poll every 400 ms — more reliable than attributeFilter MutationObserver
  // across Storybook's virtual-DOM re-renders.
  setInterval(render, 400);
  setTimeout(render, 900);
});

/* Show the Melio "missing" Lottie animation above "No components found" in the sidebar empty state.
   The empty state lives in #storybook-explorer-menu (the search dropdown OL), not in the tree. */
addons.register('melio/empty-state-animation', () => {
  const CONTAINER_ID = 'melio-empty-state-lottie';
  let anim: AnimationItem | null = null;

  const inject = (liEl: HTMLElement) => {
    if (document.getElementById(CONTAINER_ID)) return;
    const wrap = document.createElement('li');
    wrap.id = CONTAINER_ID;
    wrap.style.cssText = 'display:flex;justify-content:center;padding:20px 0 4px;list-style:none;';
    const player = document.createElement('div');
    player.style.cssText = 'width:96px;height:96px;flex-shrink:0;';
    wrap.appendChild(player);
    liEl.parentElement?.insertBefore(wrap, liEl);
    anim = lottie.loadAnimation({
      container: player,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/illustrations/missing.json',
    });
  };

  const remove = () => {
    const el = document.getElementById(CONTAINER_ID);
    if (el) {
      anim?.destroy();
      anim = null;
      el.remove();
    }
  };

  const check = () => {
    const menu = document.getElementById('storybook-explorer-menu');
    if (!menu) { remove(); return; }
    const strong = Array.from(menu.querySelectorAll('strong')).find(
      (el) => el.textContent?.trim() === 'No components found'
    ) as HTMLElement | undefined;
    if (strong) {
      // Walk up to the <li> ancestor inside the OL
      let li: HTMLElement | null = strong.parentElement;
      while (li && li.tagName !== 'LI') li = li.parentElement as HTMLElement | null;
      if (li) inject(li);
    } else {
      remove();
    }
  };

  setTimeout(() => {
    new MutationObserver(check).observe(document.body, { childList: true, subtree: true });
    check();
  }, 800);
});
