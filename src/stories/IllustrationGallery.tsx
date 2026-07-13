import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { triggerDownload, normalizeSvg, svgToRaster } from './downloadUtils';
import { ColorChip } from './ColorChip';
import { FONT, COLOR, DownloadIcon, DsIcon } from './brandKit';

// Each Melio illustration has a Partners twin (same name). We render the UNION of both
// sets so every illustration keeps the same grid position; the set that lacks a given
// illustration shows a "missing" placeholder in that spot.
// Animated illustrations are Lottie .json; a few twins are static .svg. We load json as a URL
// (lottie fetches it) and svg as raw text (so we can string-swap its accent color).
const MELIO_S3 = 'https://platform-static.meliopayments.com/assets/melio';
const MELIO_NAMES = [
  'academy', 'add', 'add-card', 'add-user', 'announce', 'approval-workflows', 'approve',
  'bank', 'bank-success', 'blocked', 'calendar', 'camera', 'card', 'celebration',
  'construction', 'create-invoice', 'customer-add', 'customize', 'customize-invoice',
  'declined', 'discount', 'edit', 'error', 'expired', 'faq', 'fast', 'fun-fact', 'gift',
  'grow', 'invoice', 'missing', 'mobile', 'money-success', 'network-download', 'network-error',
  'network-pay', 'new-email', 'no-items', 'notification', 'page-not-found', 'paper-check',
  'pay', 'payment-link', 'payout-add', 'pending', 'processing', 'processing 2', 'product',
  'question', 'save-money', 'security', 'sent', 'set-up-account', 'single-use-card',
  'small-business', 'success', 'sync-accounts', 'sync-user', 'tax-form', 'troubleshooting',
  'under-review', 'upgrade-plan', 'user-approve', 'user-management', 'vendor-add', 'warning',
];
const melioJson: Record<string, string> = Object.fromEntries(
  MELIO_NAMES.map(name => [`../assets/illustrations/melio/${name}.json`, `${MELIO_S3}/${name}.lottie.json`])
);
const partnersJson = import.meta.glob('../assets/illustrations/partners/*.json', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const melioSvg = import.meta.glob('../assets/illustrations/melio/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;
const partnersSvg = import.meta.glob('../assets/illustrations/partners/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const baseName = (path: string) => decodeURIComponent(path.split('/').pop()!.replace(/\.(json|svg)$/, ''));

// Partner app logos (drop SVG/PNG into ../assets/partner-logos/, named by slug). Optional -
// the reminder modal falls back to a color swatch when a logo is missing.
const partnerLogoMods = import.meta.glob('../assets/partner-logos/*.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const LOGO_BY_PARTNER: Record<string, string> = Object.fromEntries(
  Object.entries(partnerLogoMods).map(([p, url]) => [slug(p.split('/').pop()!.replace(/\.(svg|png)$/, '')), url]),
);
const partnerLogo = (name: string): string | undefined => LOGO_BY_PARTNER[slug(name)];

export type Entry = { kind: 'lottie'; url: string } | { kind: 'svg'; raw: string };
const buildSet = (json: Record<string, string>, svg: Record<string, string>): Record<string, Entry> => {
  const out: Record<string, Entry> = {};
  for (const [p, raw] of Object.entries(svg)) out[baseName(p)] = { kind: 'svg', raw };
  for (const [p, url] of Object.entries(json)) out[baseName(p)] = { kind: 'lottie', url }; // animated wins on collision
  return out;
};

export const SETS: Record<'Melio' | 'Partners', Record<string, Entry>> = {
  Melio: buildSet(melioJson, melioSvg),
  Partners: buildSet(partnersJson, partnersSvg),
};
export type SetKey = keyof typeof SETS;
export const ALL_NAMES = [...new Set([...Object.keys(SETS.Melio), ...Object.keys(SETS.Partners)])].sort((a, b) =>
  a.localeCompare(b),
);

const PURPLE = COLOR.purple; // Melio's accent - the single customizable color in every illustration.

// Partners are brand-agnostic: each partner swaps the one accent (#7849FF) for its own brand
// color, while the dark stroke (#212124) and white fill stay put. Real partner brand colors:
const PARTNERS: { name: string; color: string; domain?: string }[] = [
  { name: 'Default', color: PURPLE },
  { name: 'CFC', color: '#00508D' }, // domain unconfirmed - add to show its logo
  { name: 'Capital One', color: '#0276B1', domain: 'capitalone.com' },
  { name: 'PayPal', color: '#0551B5', domain: 'paypal.com' },
  { name: 'Gusto', color: '#0A8080', domain: 'gusto.com' },
  { name: 'US Bank', color: '#235AE4', domain: 'usbank.com' },
  { name: 'WaFd', color: '#186CE2', domain: 'wafdbank.com' },
  { name: 'Wells Fargo', color: '#5A469B', domain: 'wellsfargo.com' },
  { name: 'ADP', color: '#476BC3', domain: 'adp.com' },
];

// Logo for a partner: a local file in ../assets/partner-logos/ if present, otherwise the partner's
// app icon via Google's favicon service (by domain). Undefined → no logo shown.
const partnerLogoSrc = (name: string): string | undefined => {
  const local = partnerLogo(name);
  if (local) return local;
  const d = PARTNERS.find((p) => p.name === name)?.domain;
  return d ? `https://www.google.com/s2/favicons?domain=${d}&sz=128` : undefined;
};

// ---- Exact recolor: swap the source accent (#7849FF) for the partner's brand color ----
// Illustrations carry one strong accent (#7849FF) plus a faint light tint (#EFE9FF). We map the
// strong one to the partner color and the faint one to a light tint of that same color.
const SRC_RGB = [120 / 255, 73 / 255, 1]; // #7849FF
const TINT_RGB = [239 / 255, 233 / 255, 1]; // #EFE9FF
const hexToNorm = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const near = (o: number[], ref: number[]) =>
  Math.abs(o[0] - ref[0]) < 0.04 && Math.abs(o[1] - ref[1]) < 0.04 && Math.abs(o[2] - ref[2]) < 0.04;

/** Deep-clone a Lottie doc and swap the purple accent + its light tint for the target color. */
function recolor(data: unknown, hex: string): unknown {
  const [tr, tg, tb] = hexToNorm(hex);
  const tint = (c: number) => c * 0.12 + 1 * 0.88; // 12% color over white → faint brand tint
  const clone = JSON.parse(JSON.stringify(data));
  const walk = (o: any) => {
    if (Array.isArray(o)) {
      if (o.length >= 3 && typeof o[0] === 'number' && typeof o[1] === 'number' && typeof o[2] === 'number') {
        if (near(o, SRC_RGB)) {
          o[0] = tr;
          o[1] = tg;
          o[2] = tb;
          return;
        }
        if (near(o, TINT_RGB)) {
          o[0] = tint(tr);
          o[1] = tint(tg);
          o[2] = tint(tb);
          return;
        }
      }
      o.forEach(walk);
    } else if (o && typeof o === 'object') {
      Object.values(o).forEach(walk);
    }
  };
  walk(clone);
  return clone;
}

/** Recolor a static SVG twin: swap its accent (#7849FF) for the partner's brand color. */
const recolorSvg = (raw: string, hex: string) => raw.replace(/#7849FF/gi, hex);

// Cache the raw JSON per url so switching partners doesn't refetch.
const rawCache = new Map<string, Promise<unknown>>();
const loadRaw = (url: string) => {
  let p = rawCache.get(url);
  if (!p) {
    p = fetch(url).then((r) => r.json());
    rawCache.set(url, p);
  }
  return p;
};

// ---------- downloads (recolor-aware: exports use the active partner color) ----------
type FmtKey = 'svg' | 'png' | 'jpeg' | 'gif' | 'json';
const FORMATS: { key: FmtKey; label: string; ext: string }[] = [
  { key: 'svg', label: 'SVG', ext: 'vector' },
  { key: 'png', label: 'PNG', ext: 'transparent' },
  { key: 'jpeg', label: 'JPEG', ext: 'flattened' },
  { key: 'gif', label: 'GIF', ext: 'animated' },
  { key: 'json', label: 'Lottie JSON', ext: 'animation' },
];
const fmtAvailable = (entry: Entry, k: FmtKey) => (entry.kind === 'lottie' ? true : k !== 'gif' && k !== 'json');

const dlItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 8,
  padding: '9px 10px',
  fontSize: 14,
  fontFamily: FONT,
  textAlign: 'left',
  background: 'transparent',
};

async function encodeGifBlob(anim: AnimationItem, box: HTMLDivElement, size = 360): Promise<Blob> {
  const enc = GIFEncoder();
  const total = Math.floor(anim.totalFrames) || 1;
  const compFps = anim.frameRate || 30;
  const step = Math.max(1, Math.round(compFps / 20));
  const delay = Math.round((step / compFps) * 1000);
  for (let f = 0; f < total; f += step) {
    anim.goToAndStop(f, true);
    const svgStr = normalizeSvg(box.querySelector('svg') as SVGSVGElement | null);
    if (!svgStr) continue;
    const canvas = await (await import('./downloadUtils')).svgToCanvas(svgStr, size, '#FFFFFF');
    const { data, width, height } = canvas.getContext('2d')!.getImageData(0, 0, size, size);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    enc.writeFrame(index, width, height, { palette, delay });
  }
  enc.finish();
  return new Blob([enc.bytes()], { type: 'image/gif' });
}

/** Render Lottie animationData offscreen, run a callback, then clean up. */
async function withOffscreenLottie<T>(animationData: unknown, fn: (anim: AnimationItem, div: HTMLDivElement) => T | Promise<T>): Promise<T> {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;left:-99999px;top:0;width:500px;height:500px;opacity:0;pointer-events:none;';
  document.body.appendChild(div);
  const anim = lottie.loadAnimation({ container: div, renderer: 'svg', loop: false, autoplay: false, animationData: animationData as object });
  try {
    await new Promise<void>((res) => anim.addEventListener('DOMLoaded', () => res()));
    return await fn(anim, div);
  } finally {
    anim.destroy();
    div.remove();
  }
}

/** Build a downloadable blob for one illustration in the given format, recolored to `color`. */
export async function entryToBlob(entry: Entry, fmt: FmtKey, color: string): Promise<{ blob: Blob; ext: string } | null> {
  if (fmt === 'json') {
    if (entry.kind !== 'lottie') return null;
    const data = recolor(await loadRaw(entry.url), color);
    return { blob: new Blob([JSON.stringify(data)], { type: 'application/json' }), ext: 'json' };
  }
  if (fmt === 'gif') {
    if (entry.kind !== 'lottie') return null;
    const data = recolor(await loadRaw(entry.url), color);
    const blob = await withOffscreenLottie(data, (anim, div) => encodeGifBlob(anim, div));
    return { blob, ext: 'gif' };
  }
  // svg / png / jpeg → a recolored static SVG (last frame for Lottie, recolored raw for static twins)
  const svgStr =
    entry.kind === 'svg'
      ? normalizeSvg(null, recolorSvg(entry.raw, color))
      : await withOffscreenLottie(recolor(await loadRaw(entry.url), color), (anim, div) => {
          anim.goToAndStop(Math.max(0, Math.floor(anim.totalFrames) - 1), true);
          return normalizeSvg(div.querySelector('svg') as SVGSVGElement | null);
        });
  if (!svgStr) return null;
  if (fmt === 'svg') return { blob: new Blob([svgStr], { type: 'image/svg+xml' }), ext: 'svg' };
  return svgToRaster(svgStr, fmt);
}

/** One illustration cell: auto-playing looped Lottie or static SVG, recolored to the active partner. */
function Cell({ name, entry, color, gate }: { name: string; entry?: Entry; color?: string; gate: (run: () => void) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimationItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const missing = !entry;
  const lottieUrl = entry?.kind === 'lottie' ? entry.url : undefined;

  useEffect(() => {
    if (!lottieUrl || !box.current) return;
    let killed = false;
    let a: AnimationItem | null = null;
    loadRaw(lottieUrl).then((raw) => {
      if (killed || !box.current) return;
      const data = recolor(raw, color || PURPLE); // always a fresh clone (lottie mutates animationData)
      a = lottie.loadAnimation({
        container: box.current,
        renderer: 'svg',
        loop: true,
        autoplay: true, // play + loop by default (not only on hover)
        animationData: data,
      });
      anim.current = a;
    });
    return () => {
      killed = true;
      a?.destroy();
      anim.current = null;
    };
  }, [lottieUrl, color]);

  const copy = () => {
    navigator.clipboard?.writeText(name);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [busy, setBusy] = useState<FmtKey | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
      setMenu(null);
    };
    const onScroll = () => setMenu(null);
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [menu]);
  const openMenu = () => {
    if (missing || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setMenu({ x: Math.min(r.left, window.innerWidth - 210), y: r.bottom + 6 });
  };
  const download = (fmt: FmtKey) => {
    if (!entry) return;
    setMenu(null);
    gate(async () => {
      setBusy(fmt);
      try {
        const o = await entryToBlob(entry, fmt, color || PURPLE);
        if (o) triggerDownload(o.blob, `${name}.${o.ext}`);
      } catch (err) {
        console.error('download failed', err);
      }
      setBusy(null);
    });
  };

  return (
    <>
    <button
      ref={btnRef}
      onClick={missing ? undefined : openMenu}
      disabled={missing}
      title={missing ? `No Partners version of “${name}” yet` : `Download or copy “${name}”`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        border: missing ? '1.5px dashed #CFCFD8' : menu ? '1px solid #7849FF' : '1px solid #ECECF1',
        borderRadius: 14,
        background: missing ? '#F1F1F4' : '#FFFFFF',
        cursor: missing ? 'default' : 'pointer',
        opacity: missing ? 0.7 : 1,
        transition: 'background 120ms, border-color 120ms',
        fontFamily: FONT,
        position: 'relative',
      }}
      onMouseOver={
        missing
          ? undefined
          : (e) => {
              if (menu) return;
              e.currentTarget.style.background = '#FAFAFB';
              e.currentTarget.style.borderColor = '#D9D9E0';
            }
      }
      onMouseOut={
        missing
          ? undefined
          : (e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = menu ? '#7849FF' : '#ECECF1';
            }
      }
      onMouseEnter={missing ? undefined : () => setHovered(true)}
      onMouseLeave={missing ? undefined : () => setHovered(false)}
    >
      {missing ? (
        // Distinct key + separate node from the lottie container: lottie's destroy() clears its
        // container, so React must NOT reuse that DOM node for the placeholder (or the icon gets wiped).
        <div
          key="placeholder"
          style={{ width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="#B6B9C2" strokeWidth="1.5" />
            <circle cx="8.5" cy="9.5" r="1.6" fill="#B6B9C2" />
            <path d="M4 18l5-5 3.5 3.5L16 12l4 4" stroke="#B6B9C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : entry!.kind === 'svg' ? (
        // Static twin: recolored inline SVG (no animation). The wrapper forces it to 96px.
        <div
          key="svg"
          className="ill-svg"
          style={{ width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: recolorSvg(entry!.raw, color || PURPLE) }}
        />
      ) : (
        <div key="anim" ref={box} style={{ width: 112, height: 112 }} />
      )}
      {hovered && !missing && !menu && (
        <span style={{
          position: 'absolute', top: 8, right: 8, width: 22, height: 22,
          borderRadius: 7, background: '#FFFFFF', border: '1px solid #E0E0E8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', pointerEvents: 'none',
        }}>
          <DownloadIcon size={11} />
        </span>
      )}
      <span style={{ fontSize: 12, color: copied ? PURPLE : '#6B7280', wordBreak: 'break-word', textAlign: 'center' }}>
        {copied ? 'Copied!' : busy ? `${busy.toUpperCase()}…` : name}
      </span>
    </button>

    {menu && entry && (
      <div
        ref={menuRef}
        style={{ position: 'fixed', left: menu.x, top: menu.y, minWidth: 188, background: '#FFFFFF', borderRadius: 12, border: '1px solid #ECECF1', boxShadow: '0 12px 32px rgba(20,20,40,0.18)', padding: 6, zIndex: 1000, fontFamily: FONT }}
      >
        <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>Download {name}</div>
        {FORMATS.map((f) => {
          const ok = fmtAvailable(entry, f.key);
          return (
            <button
              key={f.key}
              onClick={() => ok && download(f.key)}
              disabled={!ok || busy !== null}
              style={{ ...dlItemStyle, cursor: ok ? 'pointer' : 'not-allowed', color: ok ? '#1A1A1A' : '#BFC3CC' }}
              onMouseOver={(e) => ok && (e.currentTarget.style.background = '#F4F4F6')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontWeight: 500 }}>{f.label}</span>
              <span style={{ fontSize: 11, color: ok ? '#9AA0AA' : '#CFCFD8' }}>{busy === f.key ? 'preparing…' : ok ? f.ext : '-'}</span>
            </button>
          );
        })}
        <div style={{ height: 1, background: '#F0F0F4', margin: '6px 4px' }} />
        <button
          onClick={() => { copy(); setMenu(null); }}
          style={{ ...dlItemStyle, color: '#1A1A1A' }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontWeight: 500 }}>Copy name</span>
          <span style={{ fontSize: 11, color: '#9AA0AA' }}>{name}</span>
        </button>
      </div>
    )}
    </>
  );
}

/** Custom partner picker: brush-icon trigger + a menu of partners with brand-color swatches. */
function PartnerPicker({ idx, onPick }: { idx: number; onPick: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const active = PARTNERS[idx];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={wrap} style={{ position: 'relative', fontFamily: FONT }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: 'none',
          cursor: 'pointer',
          borderRadius: 999,
          padding: '6px 18px 6px 14px', // extra room to the right of the chevron
          fontSize: 13,
          fontWeight: 500,
          fontFamily: 'inherit',
          background: '#F6F8FE',
          color: active.color,
        }}
      >
        {/* the active brand color shown as a swatch inside the trigger */}
        <span
          aria-hidden
          style={{ width: 14, height: 14, borderRadius: 4, background: active.color, flex: '0 0 auto' }}
        />
        {active.name}
        <DsIcon name="chevron down" size={12} style={{ marginLeft: 2, opacity: 0.7, color: active.color }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 220,
            background: '#FFFFFF',
            borderRadius: 14,
            border: '1px solid #ECECF1',
            boxShadow: '0 12px 32px rgba(20,20,40,0.16)',
            padding: 8,
            zIndex: 30,
          }}
        >
          {PARTNERS.map((p, i) => {
            const on = i === idx;
            return (
              <button
                key={p.name}
                onClick={() => {
                  onPick(i);
                  setOpen(false);
                }}
                style={menuItemStyle(on)}
                onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')}
                onMouseOut={(e) => (e.currentTarget.style.background = on ? '#F6F8FE' : 'transparent')}
              >
                <span style={{ color: on ? p.color : '#1A1A1A', fontWeight: on ? 600 : 400 }}>{p.name}</span>
                <span style={{ width: 16, height: 16, borderRadius: 999, background: p.color, flex: '0 0 auto' }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const menuItemStyle = (active: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 9,
  padding: '9px 12px',
  fontSize: 14,
  fontFamily: FONT,
  textAlign: 'left',
  background: active ? '#F6F8FE' : 'transparent',
});

export function IllustrationGallery({
  set,
  onSetChange,
}: {
  set: SetKey;
  onSetChange: (k: SetKey) => void;
}) {
  const [query, setQuery] = useState('');
  const [partnerIdx, setPartnerIdx] = useState(0);
  const partnerColor = set === 'Partners' ? PARTNERS[partnerIdx].color : undefined;
  const partnerName = PARTNERS[partnerIdx].name;
  const nonDefaultPartner = set === 'Partners' && partnerIdx !== 0;

  // Downloads: a reminder modal warns when exporting a non-default partner color (once per partner).
  const acked = useRef<Set<number>>(new Set());
  const [confirm, setConfirm] = useState<{ run: () => void } | null>(null);
  const [dlMenu, setDlMenu] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const dlWrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!dlMenu) return;
    const onDoc = (e: MouseEvent) => {
      if (!dlWrap.current?.contains(e.target as Node)) setDlMenu(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [dlMenu]);

  // Gate any download inside the Partners set with a reminder (once per option):
  //  - a real partner → "downloading in <partner>'s color"
  //  - Default (Melio purple) → a disclaimer that Melio doesn't actually use the Partners illustrations.
  // The Melio set downloads with no modal.
  const gate = (run: () => void) => {
    if (set === 'Partners' && !acked.current.has(partnerIdx)) setConfirm({ run });
    else run();
  };

  const downloadAll = (fmt: FmtKey) => {
    setDlMenu(false);
    gate(async () => {
      const names = filtered.filter((n) => {
        const e = entryByName[n];
        if (!e) return false;
        if ((fmt === 'gif' || fmt === 'json') && e.kind !== 'lottie') return false;
        return true;
      });
      if (!names.length) return;
      setProgress({ done: 0, total: names.length });
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const tag = nonDefaultPartner ? partnerName.toLowerCase().replace(/\s+/g, '-') : set.toLowerCase();
        const folderName = `${tag}-illustrations-${fmt === 'jpeg' ? 'jpg' : fmt}`;
        const folder = zip.folder(folderName)!;
        for (let i = 0; i < names.length; i++) {
          try {
            const o = await entryToBlob(entryByName[names[i]], fmt, partnerColor || PURPLE);
            if (o) folder.file(`${names[i]}.${o.ext}`, o.blob);
          } catch (err) {
            console.error('skip', names[i], err);
          }
          setProgress({ done: i + 1, total: names.length });
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerDownload(zipBlob, `${folderName}.zip`);
      } catch (err) {
        console.error('zip failed', err);
      }
      setProgress(null);
    });
  };

  // Keep the scroll position steady when switching Melio <-> Partners.
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = savedScroll.current;
  }, [set]);
  const changeSet = (k: SetKey) => {
    if (scrollRef.current) savedScroll.current = scrollRef.current.scrollTop;
    onSetChange(k);
  };

  // Custom always-visible scrollbar (native overlay one is invisible here).
  const [thumb, setThumb] = useState({ top: 0, height: 40, show: false });
  const updateThumb = () => {
    const el = scrollRef.current;
    if (!el) return;
    const trackH = el.clientHeight - 24;
    const h = Math.max(28, Math.round((el.clientHeight / el.scrollHeight) * trackH));
    const maxScroll = el.scrollHeight - el.clientHeight;
    const top = maxScroll > 0 ? Math.round((el.scrollTop / maxScroll) * (trackH - h)) : 0;
    setThumb({ top, height: h, show: el.scrollHeight > el.clientHeight + 2 });
  };
  useLayoutEffect(updateThumb, [set, query]);

  // Draggable scrollbar thumb.
  const [dragging, setDragging] = useState(false);
  const dragData = useRef<{ startY: number; startThumbTop: number } | null>(null);
  const startThumbDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragData.current = { startY: e.clientY, startThumbTop: thumb.top };
    setDragging(true);
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const el = scrollRef.current;
      if (!el || !dragData.current) return;
      const trackH = el.clientHeight - 24;
      const h = thumb.height;
      const maxThumb = trackH - h;
      if (maxThumb <= 0) return;
      const delta = e.clientY - dragData.current.startY;
      const newTop = Math.max(0, Math.min(maxThumb, dragData.current.startThumbTop + delta));
      el.scrollTop = Math.round((newTop / maxThumb) * (el.scrollHeight - el.clientHeight));
    };
    const onUp = () => { setDragging(false); dragData.current = null; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, [dragging, thumb.height]);

  const entryByName = SETS[set];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_NAMES.filter((n) => n.toLowerCase().includes(q)) : ALL_NAMES;
  }, [query]);

  return (
    <div style={{ fontFamily: FONT, color: '#1A1A1A' }}>
      <style>{`
        .ill-scroll { scrollbar-width: none; }
        .ill-scroll::-webkit-scrollbar { display: none; }
        .ill-svg svg { width: 112px; height: 112px; display: block; }
      `}</style>

      {/* Unified panel: fixed controls header + scrolling illustration grid */}
      <div style={{ marginTop: 16, borderRadius: 14, border: '1px solid #E6E6EC', background: '#F4F4F6', overflow: 'visible' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            padding: '14px 16px',
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E2E8',
            borderRadius: '14px 14px 0 0',
          }}
        >
          {/* Left: search with count beneath */}
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ position: 'relative', width: 240, maxWidth: '100%' }}>
              <DsIcon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8A8A99' }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search illustrations…"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '6px 14px 6px 36px',
                  borderRadius: 8,
                  border: '1px solid #E5E5EA',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
            <span style={{ color: '#8A8A99', fontSize: 12, lineHeight: 1, whiteSpace: 'nowrap', paddingLeft: 2, marginTop: 3 }}>{filtered.length} shown</span>
          </div>

          {/* Right: partner dropdown (Partners) → kit toggle → Download all.
              Dropdown is leftmost so its show/hide doesn't shove the right-anchored toggle. */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {set === 'Partners' && <PartnerPicker idx={partnerIdx} onPick={setPartnerIdx} />}

            <div style={{ display: 'inline-flex', border: '1px solid #E5E5EA', borderRadius: 999, padding: 2, background: '#FFFFFF' }}>
              {(Object.keys(SETS) as SetKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => changeSet(k)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 999,
                    padding: '5px 16px',
                    fontWeight: 500,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    background: set === k ? '#1A1A1A' : 'transparent',
                    color: set === k ? '#FFFFFF' : '#6B7280',
                  }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Download all → zip the current set in the active color */}
            <div ref={dlWrap} style={{ position: 'relative' }}>
              <button
                onClick={() => (progress ? null : setDlMenu((o) => !o))}
                disabled={!!progress}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  border: '1px solid #E5E5EA',
                  cursor: progress ? 'default' : 'pointer',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  background: '#FFFFFF',
                  color: progress ? '#9AA0AA' : '#1A1A1A',
                }}
              >
                <DownloadIcon size={14} />
                {progress ? `Preparing ${progress.done}/${progress.total}…` : 'Download all'}
              </button>
              {dlMenu && !progress && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 190, background: '#FFFFFF', borderRadius: 12, border: '1px solid #ECECF1', boxShadow: '0 12px 32px rgba(20,20,40,0.18)', padding: 6, zIndex: 50 }}>
                  <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    All {filtered.filter((n) => entryByName[n]).length} · {nonDefaultPartner ? partnerName : set}
                  </div>
                  {FORMATS.map((f) => (
                    <button key={f.key} onClick={() => downloadAll(f.key)} style={{ ...dlItemStyle, color: '#1A1A1A' }} onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ fontWeight: 500 }}>{f.label}</span>
                      <span style={{ fontSize: 11, color: '#9AA0AA' }}>{f.key === 'gif' ? 'slow' : f.ext}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrolling grid */}
        <div style={{ position: 'relative' }}>
          <div
            ref={scrollRef}
            className="ill-scroll"
            onScroll={updateThumb}
            style={{
              boxSizing: 'border-box',
              height: 412, // ~2.5 illustration rows (row ≈ 147px at 96px illos) + 16px top padding
              overflowY: 'scroll',
              padding: '16px 30px 24px 16px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(124px, 1fr))', gap: 14 }}>
              {filtered.map((name) => (
                <Cell key={name} name={name} entry={entryByName[name]} color={partnerColor} gate={gate} />
              ))}
            </div>
          </div>

          {/* Custom scrollbar */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              bottom: 12,
              width: 8,
              borderRadius: 999,
              background: '#E2E2E8',
            }}
          >
            {thumb.show && (
              <div
                onMouseDown={startThumbDrag}
                style={{ position: 'absolute', left: 0, width: 8, top: thumb.top, height: thumb.height, borderRadius: 999, background: '#A8A8B4', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
              />
            )}
          </div>
        </div>
      </div>

      {confirm && (
        <div
          onMouseDown={() => setConfirm(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,40,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, fontFamily: FONT }}
        >
          {(() => {
            const isDefault = partnerIdx === 0;
            const logo = isDefault ? 'https://www.google.com/s2/favicons?domain=meliopayments.com&sz=128' : partnerLogoSrc(partnerName);
            return (
              <div onMouseDown={(e) => e.stopPropagation()} style={{ width: 'min(420px, 92vw)', background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px rgba(20,20,40,0.30)' }}>
                <div style={{ marginBottom: 12 }}>
                  {logo && (
                    <img
                      src={logo}
                      alt={isDefault ? 'Melio' : `${partnerName} logo`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 9, display: 'block', marginBottom: 10 }}
                    />
                  )}
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1A1A1A' }}>
                    {isDefault ? "A note on Melio's default" : `Downloading in ${partnerName}'s color`}
                  </h3>
                </div>
                {isDefault ? (
                  <>
                    <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.6, color: '#4B4B57' }}>
                      You're downloading the Partners illustrations in Melio's purple <ColorChip hex={PURPLE} />.
                    </p>
                    <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.6, color: '#4B4B57' }}>
                      <span style={{ fontWeight: 500, fontSize: 'inherit', lineHeight: 'inherit' }}>Note:</span> Melio doesn't actually use the Partners kit - its own surfaces use the custom Mel illustrations.
                    </p>
                  </>
                ) : (
                  <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.6, color: '#4B4B57' }}>
                    These files use <span style={{ fontWeight: 500, fontSize: 'inherit', lineHeight: 'inherit' }}>{partnerName}'s</span> brand color <ColorChip hex={partnerColor!} />.
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button onClick={() => setConfirm(null)} style={{ border: '1px solid #D9D9E0', background: '#FFFFFF', color: '#1A1A1A', borderRadius: 10, padding: '9px 16px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      acked.current.add(partnerIdx);
                      const r = confirm.run;
                      setConfirm(null);
                      r();
                    }}
                    style={{ border: 'none', background: '#1A1A1A', color: '#FFFFFF', borderRadius: 10, padding: '9px 16px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}
                  >
                    {isDefault ? 'Download anyway' : `Download in ${partnerName}`}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
