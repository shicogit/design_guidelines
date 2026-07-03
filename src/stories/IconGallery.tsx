import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { triggerDownload, normalizeSvg, svgToRaster } from './downloadUtils';
import { COLOR, DownloadIcon, DsIcon } from './brandKit';

// Load every icon as a URL (for <img>) and as raw text (for downloads) via Vite's glob import.
const largeMods = import.meta.glob('../assets/icons/large/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const smallMods = import.meta.glob('../assets/icons/small/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const largeRaw = import.meta.glob('../assets/icons/large/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const smallRaw = import.meta.glob('../assets/icons/small/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

type IconEntry = { name: string; url: string };

// Normalize a filename to the hyphenated, lowercase-variant style:
//   "ai Type=Fill"               -> "ai-fill"
//   "heart-circle Variant=Outline" -> "heart-circle-outline"
//   "add-circle-outline Type=Fill" -> "add-circle-fill"  (redundant base "-outline" dropped)
//   "add-circle-outline Type=Outline" -> "add-circle-outline"
// Names already in this style (e.g. "play-circle-fill", "clock-fill") are left untouched.
function cleanName(file: string): string {
  const m = file.match(/(?:Type|Variant)=(Fill|Outline)/i);
  if (!m) return file;
  const variant = m[1].toLowerCase();
  const base = file
    .replace(/\s*(?:Type|Variant)=\w+/i, '')
    .trim()
    .replace(/-(?:outline|fill)$/i, ''); // drop a redundant variant word baked into the base
  return `${base}-${variant}`;
}

const baseName = (path: string) => cleanName(decodeURIComponent(path.split('/').pop()!.replace(/\.svg$/, '')));

function toEntries(mods: Record<string, string>): IconEntry[] {
  return Object.entries(mods)
    .map(([path, url]) => ({ name: baseName(path), url }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const SETS = {
  '24 - Large': toEntries(largeMods),
  '16 - Small': toEntries(smallMods),
} as const;

type SetKey = keyof typeof SETS;

// Name -> url / raw lookup per size, and the union of all names (sorted).
const byName = (entries: IconEntry[]): Record<string, string> => Object.fromEntries(entries.map((e) => [e.name, e.url]));
const rawByName = (mods: Record<string, string>): Record<string, string> =>
  Object.fromEntries(Object.entries(mods).map(([path, raw]) => [baseName(path), raw]));

const URL_BY_SIZE: Record<SetKey, Record<string, string>> = {
  '24 - Large': byName(SETS['24 - Large']),
  '16 - Small': byName(SETS['16 - Small']),
};
const RAW_BY_SIZE: Record<SetKey, Record<string, string>> = {
  '24 - Large': rawByName(largeRaw),
  '16 - Small': rawByName(smallRaw),
};
const ALL_NAMES = [
  ...new Set([...Object.keys(URL_BY_SIZE['24 - Large']), ...Object.keys(URL_BY_SIZE['16 - Small'])]),
].sort((a, b) => a.localeCompare(b));

const PURPLE = COLOR.purple;

type FmtKey = 'svg' | 'png' | 'jpeg';
const FORMATS: { key: FmtKey; label: string; ext: string }[] = [
  { key: 'svg', label: 'SVG', ext: 'vector' },
  { key: 'png', label: 'PNG', ext: 'transparent' },
  { key: 'jpeg', label: 'JPEG', ext: 'flattened' },
];

/** One icon cell: shows the icon; clicking opens a menu to download (SVG/PNG/JPEG) or copy the name. */
function IconCell({ name, url, raw, px, copied, onCopy }: { name: string; url?: string; raw?: string; px: number; copied: boolean; onCopy: (n: string) => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [busy, setBusy] = useState<FmtKey | null>(null);
  const [hovered, setHovered] = useState(false);
  const missing = !url;

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

  const handlers: Record<FmtKey, () => Promise<void> | void> = {
    svg: () => {
      const s = normalizeSvg(null, raw);
      if (s) triggerDownload(new Blob([s], { type: 'image/svg+xml' }), `${name}.svg`);
    },
    png: async () => {
      const s = normalizeSvg(null, raw);
      const o = s && (await svgToRaster(s, 'png'));
      if (o) triggerDownload(o.blob, `${name}.${o.ext}`);
    },
    jpeg: async () => {
      const s = normalizeSvg(null, raw);
      const o = s && (await svgToRaster(s, 'jpeg'));
      if (o) triggerDownload(o.blob, `${name}.${o.ext}`);
    },
  };

  const run = async (k: FmtKey) => {
    setBusy(k);
    try {
      await handlers[k]();
    } catch (err) {
      console.error('icon download failed', err);
    }
    setBusy(null);
    setMenu(null);
  };

  const openMenu = () => {
    if (missing || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setMenu({ x: Math.min(r.left, window.innerWidth - 200), y: r.bottom + 6 });
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={missing ? undefined : openMenu}
        disabled={missing}
        title={missing ? `“${name}” has no ${px}px version` : `Download or copy “${name}”`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          padding: '18px 8px 12px',
          border: menu ? `1px solid ${PURPLE}` : '1px solid #ECECF1',
          borderRadius: 12,
          background: copied ? '#F4F1FF' : '#FFFFFF',
          cursor: missing ? 'default' : 'pointer',
          opacity: missing ? 0.45 : 1,
          transition: 'background 120ms, border-color 120ms',
          fontFamily: 'inherit',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          if (missing || menu) return;
          setHovered(true);
          e.currentTarget.style.background = '#FAFAFB';
          e.currentTarget.style.borderColor = '#D9D9E0';
        }}
        onMouseLeave={(e) => {
          if (missing) return;
          setHovered(false);
          e.currentTarget.style.background = copied ? '#F4F1FF' : '#FFFFFF';
          e.currentTarget.style.borderColor = menu ? PURPLE : '#ECECF1';
        }}
      >
        {hovered && !missing && !menu && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 20,
            height: 20,
            borderRadius: 6,
            background: '#FFFFFF',
            border: '1px solid #E0E0E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
          }}>
            <DownloadIcon size={10} />
          </span>
        )}
        <span style={{ height: 28, display: 'flex', alignItems: 'center' }}>
          {url ? <img src={url} width={px - 4} height={px - 4} alt={name} /> : null}
        </span>
        <span style={{ fontSize: 11, lineHeight: 1.3, color: copied ? PURPLE : '#6B7280', wordBreak: 'break-word', textAlign: 'center' }}>
          {copied ? 'Copied!' : name}
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
          <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>Download {name}</div>
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => run(f.key)}
              disabled={busy !== null}
              style={menuItemStyle}
              onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontWeight: 500 }}>{f.label}</span>
              <span style={{ fontSize: 11, color: '#9AA0AA' }}>{busy === f.key ? 'preparing…' : f.ext}</span>
            </button>
          ))}
          <div style={{ height: 1, background: '#F0F0F4', margin: '6px 4px' }} />
          <button
            onClick={async () => {
              const s = normalizeSvg(null, raw);
              if (s) await navigator.clipboard.writeText(s).catch(() => {});
              onCopy(name);
              setMenu(null);
            }}
            disabled={busy !== null}
            style={menuItemStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontWeight: 500 }}>Copy SVG</span>
            <span style={{ fontSize: 11, color: '#9AA0AA' }}>code</span>
          </button>
          <button
            onClick={() => {
              onCopy(name);
              setMenu(null);
            }}
            style={menuItemStyle}
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

const menuItemStyle: React.CSSProperties = {
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
  fontFamily: '"Poppins", sans-serif',
  textAlign: 'left',
  background: 'transparent',
  color: '#1A1A1A',
};

export function IconGallery() {
  const [set, setSet] = useState<SetKey>('24 - Large');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // "Download all" → zip every icon in the current size into a folder.
  const [allMenu, setAllMenu] = useState(false);
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

  // Keep the scroll position steady when switching icon size.
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = savedScroll.current;
  }, [set]);
  const changeSet = (k: SetKey) => {
    if (scrollRef.current) savedScroll.current = scrollRef.current.scrollTop;
    setSet(k);
  };

  // Custom always-visible scrollbar (the native overlay one is invisible here).
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

  // Draggable thumb
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
      const maxThumb = trackH - thumb.height;
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

  const urlBySize = URL_BY_SIZE[set];
  const rawBySize = RAW_BY_SIZE[set];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_NAMES;
    return ALL_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query]);

  const copy = (name: string) => {
    navigator.clipboard?.writeText(name);
    setCopied(name);
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  const downloadAll = async (fmt: FmtKey) => {
    setAllMenu(false);
    const names = filtered.filter((n) => rawBySize[n]);
    if (!names.length) return;
    setProgress({ done: 0, total: names.length });
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const sizeLabel = set.startsWith('24') ? '24-large' : '16-small';
      const folderName = `icons-${sizeLabel}-${fmt === 'jpeg' ? 'jpg' : fmt}`;
      const folder = zip.folder(folderName)!;
      for (let i = 0; i < names.length; i++) {
        const svgStr = normalizeSvg(null, rawBySize[names[i]]);
        try {
          if (svgStr) {
            if (fmt === 'svg') folder.file(`${names[i]}.svg`, svgStr);
            else {
              const o = await svgToRaster(svgStr, fmt);
              if (o) folder.file(`${names[i]}.${o.ext}`, o.blob);
            }
          }
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

  const px = set.startsWith('24') ? 24 : 16;

  return (
    <div style={{ fontFamily: '"Poppins", sans-serif', color: '#1A1A1A' }}>
      <style>{`
        .icon-scroll { scrollbar-width: none; }
        .icon-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ marginTop: 16, borderRadius: 14, border: '1px solid #E6E6EC', background: '#F4F4F6', overflow: 'hidden' }}>
        {/* Header: search + count on the left, Download all + size toggle on the right */}
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
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 240, maxWidth: '100%' }}>
              <DsIcon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8A8A99' }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 14px 9px 36px', borderRadius: 8, border: '1px solid #E5E5EA', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <span style={{ color: '#8A8A99', fontSize: 13, whiteSpace: 'nowrap' }}>{filtered.length} shown</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Download all */}
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
                <DownloadIcon size={14} />
                {progress ? `Preparing ${progress.done}/${progress.total}…` : 'Download all'}
              </button>
              {allMenu && !progress && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 190, background: '#FFFFFF', borderRadius: 12, border: '1px solid #ECECF1', boxShadow: '0 12px 32px rgba(20,20,40,0.18)', padding: 6, zIndex: 50 }}>
                  <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    All {px}px · {filtered.filter((n) => rawBySize[n]).length} files
                  </div>
                  {FORMATS.map((f) => (
                    <button key={f.key} onClick={() => downloadAll(f.key)} style={menuItemStyle} onMouseOver={(e) => (e.currentTarget.style.background = '#F4F4F6')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ fontWeight: 500 }}>{f.label}</span>
                      <span style={{ fontSize: 11, color: '#9AA0AA' }}>{f.ext}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Icon size toggle */}
            <div style={{ display: 'inline-flex', border: '1px solid #E5E5EA', borderRadius: 999, padding: 2, background: '#FFFFFF' }}>
              {(Object.keys(SETS) as SetKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => changeSet(k)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 999,
                    padding: '5px 14px',
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

        {/* Scrolling grid (custom always-visible scrollbar) */}
        <div style={{ position: 'relative' }}>
          <div
            ref={scrollRef}
            className="icon-scroll"
            onScroll={updateThumb}
            style={{ boxSizing: 'border-box', height: 354, overflowY: 'scroll', padding: '16px 30px 24px 16px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
              {filtered.map((name) => (
                <IconCell key={name} name={name} url={urlBySize[name]} raw={rawBySize[name]} px={px} copied={copied === name} onCopy={copy} />
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, width: 8, borderRadius: 999, background: '#E2E2E8' }}>
            {thumb.show && (
              <div
                onMouseDown={startThumbDrag}
                style={{ position: 'absolute', left: 0, width: 8, top: thumb.top, height: thumb.height, borderRadius: 999, background: '#A8A8B4', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
