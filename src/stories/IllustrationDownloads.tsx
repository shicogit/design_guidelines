import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { SETS, ALL_NAMES, type Entry, type SetKey } from './IllustrationGallery';
import { COLOR } from './brandKit';

const PURPLE = COLOR.purple;

// ---------- download helpers ----------
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Return a standalone, correctly-sized SVG string from a rendered <svg> or raw markup. */
function normalizeSvg(svgEl: SVGSVGElement | null, raw?: string): string | null {
  let svg: Element | null = svgEl;
  if (!svg && raw) svg = new DOMParser().parseFromString(raw, 'image/svg+xml').documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  let w = 0;
  let h = 0;
  const vb = clone.getAttribute('viewBox');
  if (vb) {
    const p = vb.split(/[\s,]+/).map(Number);
    if (p.length === 4) {
      w = p[2];
      h = p[3];
    }
  }
  if (!w) {
    w = parseFloat(clone.getAttribute('width') || '') || 0;
    h = parseFloat(clone.getAttribute('height') || '') || 0;
  }
  if (!w || !h) w = h = 500;
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(clone);
}

async function svgToCanvas(svgStr: string, size: number, bg?: string): Promise<HTMLCanvasElement> {
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('svg load failed'));
      img.src = url;
    });
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d')!;
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
    }
    ctx.drawImage(img, 0, 0, size, size);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Capture a looping Lottie frame-by-frame and encode an animated GIF (returns the blob). */
async function encodeGifBlob(anim: AnimationItem, box: HTMLDivElement, size = 360): Promise<Blob> {
  const enc = GIFEncoder();
  const total = Math.floor(anim.totalFrames) || 1;
  const compFps = anim.frameRate || 30;
  const step = Math.max(1, Math.round(compFps / 20)); // ~20fps output
  const delay = Math.round((step / compFps) * 1000);
  for (let f = 0; f < total; f += step) {
    anim.goToAndStop(f, true);
    const svgStr = normalizeSvg(box.querySelector('svg') as SVGSVGElement | null);
    if (!svgStr) continue;
    const canvas = await svgToCanvas(svgStr, size, '#FFFFFF');
    const { data, width, height } = canvas.getContext('2d')!.getImageData(0, 0, size, size);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    enc.writeFrame(index, width, height, { palette, delay });
  }
  enc.finish();
  return new Blob([enc.bytes()], { type: 'image/gif' });
}

/** Render a Lottie offscreen, run a callback against its instance, then clean up. */
async function withOffscreenLottie<T>(url: string, fn: (anim: AnimationItem, div: HTMLDivElement) => T | Promise<T>): Promise<T> {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;left:-99999px;top:0;width:500px;height:500px;pointer-events:none;opacity:0;';
  document.body.appendChild(div);
  const anim = lottie.loadAnimation({ container: div, renderer: 'svg', loop: false, autoplay: false, path: url });
  try {
    await new Promise<void>((res) => anim.addEventListener('DOMLoaded', () => res()));
    return await fn(anim, div);
  } finally {
    anim.destroy();
    div.remove();
  }
}

/** Produce a downloadable blob for one illustration in the given format (used by "Download all"). */
async function entryToBlob(entry: Entry, fmt: FmtKey, _name: string): Promise<{ blob: Blob; ext: string } | null> {
  if (fmt === 'json') {
    if (entry.kind !== 'lottie') return null;
    const txt = await (await fetch(entry.url)).text();
    return { blob: new Blob([txt], { type: 'application/json' }), ext: 'json' };
  }
  if (fmt === 'gif') {
    if (entry.kind !== 'lottie') return null;
    const blob = await withOffscreenLottie(entry.url, (anim, div) => encodeGifBlob(anim, div));
    return { blob, ext: 'gif' };
  }
  // svg / png / jpeg → need a static SVG string (last frame for Lottie, raw for static twins)
  const svgStr =
    entry.kind === 'svg'
      ? normalizeSvg(null, entry.raw)
      : await withOffscreenLottie(entry.url, (anim, div) => {
          anim.goToAndStop(Math.max(0, Math.floor(anim.totalFrames) - 1), true);
          return normalizeSvg(div.querySelector('svg') as SVGSVGElement | null);
        });
  if (!svgStr) return null;
  if (fmt === 'svg') return { blob: new Blob([svgStr], { type: 'image/svg+xml' }), ext: 'svg' };
  const canvas = await svgToCanvas(svgStr, 512, fmt === 'jpeg' ? '#FFFFFF' : undefined);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), fmt === 'jpeg' ? 'image/jpeg' : 'image/png', 0.92),
  );
  return blob ? { blob, ext: fmt === 'jpeg' ? 'jpg' : 'png' } : null;
}

type FmtKey = 'svg' | 'png' | 'jpeg' | 'gif' | 'json';
const FORMATS: { key: FmtKey; label: string; ext: string }[] = [
  { key: 'svg', label: 'SVG', ext: 'vector' },
  { key: 'png', label: 'PNG', ext: 'transparent' },
  { key: 'jpeg', label: 'JPEG', ext: 'flattened' },
  { key: 'gif', label: 'GIF', ext: 'animated' },
  { key: 'json', label: 'Lottie JSON', ext: 'animation' },
];

/** One downloadable cell: shows the looping illustration; clicking opens a format menu. */
function DownloadCell({ name, entry }: { name: string; entry?: Entry }) {
  const box = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimationItem | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [busy, setBusy] = useState<FmtKey | null>(null);
  const [copying, setCopying] = useState(false);
  const missing = !entry;
  const isLottie = entry?.kind === 'lottie';

  useEffect(() => {
    if (!isLottie || !box.current) return;
    const a = lottie.loadAnimation({
      container: box.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: (entry as { kind: 'lottie'; url: string }).url,
    });
    anim.current = a;
    return () => {
      a.destroy();
      anim.current = null;
    };
  }, [entry, isLottie]);

  // Close the menu on outside click or scroll.
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

  const getSvg = () =>
    entry?.kind === 'svg' ? normalizeSvg(null, entry.raw) : normalizeSvg(box.current?.querySelector('svg') as SVGSVGElement | null);

  const handlers: Record<FmtKey, () => Promise<void> | void> = {
    svg: () => {
      const s = getSvg();
      if (s) triggerDownload(new Blob([s], { type: 'image/svg+xml' }), `${name}.svg`);
    },
    png: async () => {
      const s = getSvg();
      if (!s) return;
      const c = await svgToCanvas(s, 512);
      await new Promise<void>((res) => c.toBlob((b) => { if (b) triggerDownload(b, `${name}.png`); res(); }, 'image/png'));
    },
    jpeg: async () => {
      const s = getSvg();
      if (!s) return;
      const c = await svgToCanvas(s, 512, '#FFFFFF');
      await new Promise<void>((res) => c.toBlob((b) => { if (b) triggerDownload(b, `${name}.jpg`); res(); }, 'image/jpeg', 0.92));
    },
    gif: async () => {
      if (entry?.kind !== 'lottie' || !anim.current || !box.current) return;
      const blob = await encodeGifBlob(anim.current, box.current);
      triggerDownload(blob, `${name}.gif`);
      anim.current.goToAndPlay(0, true);
    },
    json: async () => {
      if (entry?.kind !== 'lottie') return;
      const txt = await (await fetch(entry.url)).text();
      triggerDownload(new Blob([txt], { type: 'application/json' }), `${name}.json`);
    },
  };

  const available = (k: FmtKey) => (isLottie ? true : k !== 'gif' && k !== 'json'); // static SVGs: no GIF/JSON

  const run = async (k: FmtKey) => {
    if (!available(k)) return;
    setBusy(k);
    try {
      await handlers[k]();
    } catch (err) {
      console.error('download failed', err);
    }
    setBusy(null);
    setMenu(null);
  };

  const openMenu = () => {
    if (missing || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const x = Math.min(r.left, window.innerWidth - 200);
    setMenu({ x, y: r.bottom + 6 });
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={missing ? undefined : openMenu}
        disabled={missing}
        title={missing ? `No version of “${name}” in this set` : `Download “${name}”`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          padding: 12,
          border: missing ? '1.5px dashed #CFCFD8' : menu ? `1px solid ${PURPLE}` : '1px solid #ECECF1',
          borderRadius: 14,
          background: missing ? '#F1F1F4' : '#FFFFFF',
          cursor: missing ? 'default' : 'pointer',
          opacity: missing ? 0.7 : 1,
          transition: 'background 120ms, border-color 120ms',
          fontFamily: '"Poppins", sans-serif',
          position: 'relative',
        }}
        onMouseOver={missing ? undefined : (e) => { if (!menu) e.currentTarget.style.background = '#FAFAFB'; }}
        onMouseOut={missing ? undefined : (e) => { e.currentTarget.style.background = '#FFFFFF'; }}
      >
        {missing ? (
          <div key="ph" style={{ width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="#B6B9C2" strokeWidth="1.5" />
              <circle cx="8.5" cy="9.5" r="1.6" fill="#B6B9C2" />
              <path d="M4 18l5-5 3.5 3.5L16 12l4 4" stroke="#B6B9C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : entry!.kind === 'svg' ? (
          <div
            key="svg"
            className="dl-svg"
            style={{ width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: entry!.raw }}
          />
        ) : (
          <div key="anim" ref={box} style={{ width: 96, height: 96 }} />
        )}

        <span style={{ fontSize: 12, color: '#6B7280', wordBreak: 'break-word', textAlign: 'center', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {/* download glyph */}
          {!missing && (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8m0 0 3-3m-3 3L5 7" stroke="#9AA0AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12.5h10" stroke="#9AA0AA" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {name}
        </span>
      </button>

      {menu && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: menu.x,
            top: menu.y,
            minWidth: 180,
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #ECECF1',
            boxShadow: '0 12px 32px rgba(20,20,40,0.18)',
            padding: 6,
            zIndex: 1000,
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
            Download {name}
          </div>
          {FORMATS.map((f) => {
            const ok = available(f.key);
            const isBusy = busy === f.key;
            return (
              <button
                key={f.key}
                onClick={() => run(f.key)}
                disabled={!ok || busy !== null}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  width: '100%',
                  border: 'none',
                  cursor: ok ? 'pointer' : 'not-allowed',
                  borderRadius: 8,
                  padding: '9px 10px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  background: 'transparent',
                  color: ok ? '#1A1A1A' : '#BFC3CC',
                }}
                onMouseOver={(e) => ok && (e.currentTarget.style.background = '#F4F4F6')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontWeight: 500 }}>{f.label}</span>
                <span style={{ fontSize: 11, color: ok ? '#9AA0AA' : '#CFCFD8' }}>
                  {isBusy ? 'preparing…' : ok ? f.ext : '-'}
                </span>
              </button>
            );
          })}
          <div style={{ height: 1, background: '#F0F0F4', margin: '6px 4px' }} />
          <button
            onClick={async () => {
              if (copying || busy) return;
              setCopying(true);
              try {
                const s = getSvg();
                if (s) {
                  const c = await svgToCanvas(s, 512);
                  await new Promise<void>((res) => c.toBlob(async (b) => {
                    if (b) {
                      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); } catch { /* denied */ }
                    }
                    res();
                  }, 'image/png'));
                }
              } finally {
                setCopying(false);
                setMenu(null);
              }
            }}
            disabled={copying || busy !== null}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', border: 'none', cursor: copying ? 'default' : 'pointer', borderRadius: 8, padding: '9px 10px', fontSize: 14, fontFamily: 'inherit', textAlign: 'left', background: 'transparent', color: '#1A1A1A' }}
            onMouseOver={(e) => !copying && (e.currentTarget.style.background = '#F4F4F6')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontWeight: 500 }}>{copying ? 'Copied!' : 'Copy PNG'}</span>
            <span style={{ fontSize: 11, color: '#9AA0AA' }}>to clipboard</span>
          </button>
        </div>
      )}
    </>
  );
}

/** Small autoplaying looped Lottie (used as the modal's processing illustration). */
function MelLoop({ url, size }: { url?: string; size: number }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!url || !box.current) return;
    const a = lottie.loadAnimation({ container: box.current, renderer: 'svg', loop: true, autoplay: true, path: url });
    return () => a.destroy();
  }, [url]);
  return <div ref={box} style={{ width: size, height: size, flex: '0 0 auto' }} />;
}

export function IllustrationDownloads() {
  const [set, setSet] = useState<SetKey>('Melio');
  const [query, setQuery] = useState('');

  // "Download all" → zip every illustration in the current set into a folder.
  const [allMenu, setAllMenu] = useState(false);
  const [gifConfirm, setGifConfirm] = useState(false); // size/time heads-up before a GIF-all run
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const allWrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!allMenu) return;
    const onDoc = (e: MouseEvent) => {
      if (!allWrap.current?.contains(e.target as Node)) setAllMenu(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [allMenu]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = savedScroll.current;
  }, [set]);
  const changeSet = (k: SetKey) => {
    if (scrollRef.current) savedScroll.current = scrollRef.current.scrollTop;
    setSet(k);
  };

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

  const entryByName = SETS[set];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_NAMES.filter((n) => n.toLowerCase().includes(q)) : ALL_NAMES;
  }, [query]);

  const downloadAll = async (fmt: FmtKey) => {
    setAllMenu(false);
    const names = filtered.filter((n) => {
      const e = entryByName[n];
      if (!e) return false;
      if ((fmt === 'gif' || fmt === 'json') && e.kind !== 'lottie') return false; // static twins skip these
      return true;
    });
    if (!names.length) return;
    setProgress({ done: 0, total: names.length });
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const folderName = `${set.toLowerCase()}-illustrations-${fmt === 'jpeg' ? 'jpg' : fmt}`;
      const folder = zip.folder(folderName)!;
      for (let i = 0; i < names.length; i++) {
        try {
          const out = await entryToBlob(entryByName[names[i]], fmt, names[i]);
          if (out) folder.file(`${names[i]}.${out.ext}`, out.blob);
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
  };

  return (
    <div style={{ fontFamily: '"Poppins", sans-serif', color: '#1A1A1A' }}>
      <style>{`
        .dl-scroll { scrollbar-width: none; }
        .dl-scroll::-webkit-scrollbar { display: none; }
        .dl-svg svg { width: 96px; height: 96px; display: block; }
      `}</style>

      <div style={{ marginTop: 4, borderRadius: 14, border: '1px solid #E6E6EC', background: '#F4F4F6', overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            padding: '14px 16px',
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E2E8',
            borderRadius: '14px 14px 0 0',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 240, maxWidth: '100%' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="7" cy="7" r="5" stroke="#8A8A99" strokeWidth="1.5" />
                <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="#8A8A99" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search illustrations…"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 14px 9px 36px', borderRadius: 8, border: '1px solid #E5E5EA', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <span style={{ color: '#8A8A99', fontSize: 13, whiteSpace: 'nowrap' }}>{filtered.length} shown</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Download all → zip the current set into a folder */}
          <div ref={allWrap} style={{ position: 'relative' }}>
            <button
              onClick={() => (progress ? null : setAllMenu((o) => !o))}
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
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2v8m0 0 3-3m-3 3L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {progress ? `Preparing ${progress.done}/${progress.total}…` : 'Download all'}
            </button>
            {allMenu && !progress && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  minWidth: 190,
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #ECECF1',
                  boxShadow: '0 12px 32px rgba(20,20,40,0.18)',
                  padding: 6,
                  zIndex: 50,
                }}
              >
                <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                  All {set} · {filtered.length} files
                </div>
                {FORMATS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      if (f.key === 'gif') {
                        setAllMenu(false);
                        setGifConfirm(true);
                      } else {
                        downloadAll(f.key);
                      }
                    }}
                    style={{
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
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      background: 'transparent',
                      color: '#1A1A1A',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 500 }}>{f.label}</span>
                    <span style={{ fontSize: 11, color: '#9AA0AA' }}>{f.key === 'gif' ? 'slow' : f.ext}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
          </div>
        </div>

        {/* Scrolling grid */}
        <div style={{ position: 'relative' }}>
          <div
            ref={scrollRef}
            className="dl-scroll"
            onScroll={updateThumb}
            style={{ boxSizing: 'border-box', height: 412, overflowY: 'scroll', padding: '16px 30px 24px 16px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(124px, 1fr))', gap: 14 }}>
              {filtered.map((name) => (
                <DownloadCell key={name} name={name} entry={entryByName[name]} />
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, width: 8, borderRadius: 999, background: '#E2E2E8', pointerEvents: 'none' }}>
            {thumb.show && <div style={{ position: 'absolute', left: 0, width: 8, top: thumb.top, height: thumb.height, borderRadius: 999, background: '#A8A8B4' }} />}
          </div>
        </div>
      </div>

      {gifConfirm && (() => {
        const gifCount = filtered.filter((n) => entryByName[n]?.kind === 'lottie').length;
        const sizeEst = Math.max(1, Math.round(gifCount * 0.6)); // ~0.6 MB per GIF (observed)
        const minutes = Math.max(1, Math.round((gifCount * 2.5) / 60)); // ~2–3s per GIF
        const procUrl = SETS.Melio['processing']?.kind === 'lottie' ? SETS.Melio['processing'].url : undefined;
        return (
          <div
            onMouseDown={() => setGifConfirm(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20,20,40,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              style={{ width: 'min(440px, 92vw)', background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 24px 60px rgba(20,20,40,0.30)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <MelLoop url={procUrl} size={96} />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1A1A1A' }}>Download all {gifCount} as GIF?</h3>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6, color: '#4B4B57' }}>
                GIFs are rendered frame-by-frame right here in your browser. For {gifCount} animations that means:
              </p>
              <ul style={{ margin: '0 0 16px', paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: '#4B4B57' }}>
                <li>roughly <span style={{ fontWeight: 500 }}>~{sizeEst} MB</span> total in one zip</li>
                <li>about <span style={{ fontWeight: 500 }}>~{minutes} min</span> to generate (keep this tab open)</li>
                <li>for a single illustration, the other formats are instant</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setGifConfirm(false)}
                  style={{ border: '1px solid #D9D9E0', background: '#FFFFFF', color: '#1A1A1A', borderRadius: 10, padding: '9px 16px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setGifConfirm(false);
                    downloadAll('gif');
                  }}
                  style={{ border: 'none', background: PURPLE, color: '#FFFFFF', borderRadius: 10, padding: '9px 16px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  Download {gifCount} GIFs
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
