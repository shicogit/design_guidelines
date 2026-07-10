import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { triggerDownload, normalizeSvg, svgToRaster } from './downloadUtils';
import { FONT, COLOR, DownloadIcon, DsIcon } from './brandKit';

// Icons are loaded at runtime from melio/penny on GitHub via the Vite dev-server
// proxy plugin at /penny-gh/* (see vite.config.ts).
// medium/ = 24px icons, small/ = 16px icons.

// Icons to suppress — American-spelling duplicates that exist alongside the British form.
const EXCLUDED = new Set(['favorite']);

type IconEntry = { name: string; url: string };
type SetKey = '24 - Large' | '16 - Small';

const GITHUB_FOLDER: Record<SetKey, string> = {
  '24 - Large': 'medium',
  '16 - Small': 'small',
};

const PURPLE = COLOR.purple;

type FmtKey = 'svg' | 'png' | 'jpeg';
const FORMATS: { key: FmtKey; label: string; ext: string }[] = [
  { key: 'svg', label: 'SVG', ext: 'vector' },
  { key: 'png', label: 'PNG', ext: 'transparent' },
  { key: 'jpeg', label: 'JPEG', ext: 'flattened' },
];

async function fetchRawSvg(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    return res.ok ? await res.text() : undefined;
  } catch {
    return undefined;
  }
}

/** One icon cell: shows the icon; clicking opens a menu to download (SVG/PNG/JPEG) or copy the name. */
function IconCell({ name, url, px, copied, onCopy }: { name: string; url?: string; px: number; copied: boolean; onCopy: (n: string) => void }) {
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

  const handlers: Record<FmtKey, () => Promise<void>> = {
    svg: async () => {
      const rawText = url ? await fetchRawSvg(url) : undefined;
      const s = normalizeSvg(null, rawText);
      if (s) triggerDownload(new Blob([s], { type: 'image/svg+xml' }), `${name}.svg`);
    },
    png: async () => {
      const rawText = url ? await fetchRawSvg(url) : undefined;
      const s = normalizeSvg(null, rawText);
      const o = s && (await svgToRaster(s, 'png'));
      if (o) triggerDownload(o.blob, `${name}.${o.ext}`);
    },
    jpeg: async () => {
      const rawText = url ? await fetchRawSvg(url) : undefined;
      const s = normalizeSvg(null, rawText);
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
        title={missing ? `"${name}" has no ${px}px version` : `Download or copy "${name}"`}
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
            fontFamily: FONT,
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
              <span style={{ fontSize: 11, color: '#9AA0AA' }}>{busy === f.key ? 'preparing...' : f.ext}</span>
            </button>
          ))}
          <div style={{ height: 1, background: '#F0F0F4', margin: '6px 4px' }} />
          <button
            onClick={async () => {
              const rawText = url ? await fetchRawSvg(url) : undefined;
              const s = normalizeSvg(null, rawText);
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
  fontFamily: FONT,
  textAlign: 'left',
  background: 'transparent',
  color: '#1A1A1A',
};

export function IconGallery() {
  const [sets, setSets] = useState<Record<SetKey, IconEntry[]>>({ '24 - Large': [], '16 - Small': [] });
  const [loading, setLoading] = useState(true);
  const [set, setSet] = useState<SetKey>('24 - Large');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Load icon lists from GitHub via Vite proxy.
  useEffect(() => {
    Promise.all([
      fetch('/penny-gh/list/medium.json').then((r) => r.json() as Promise<string[]>),
      fetch('/penny-gh/list/small.json').then((r) => r.json() as Promise<string[]>),
    ])
      .then(([mediumFiles, smallFiles]) => {
        const toEntries = (files: string[], folder: string): IconEntry[] =>
          files
            .filter((f) => f.endsWith('.svg'))
            .map((f) => ({ name: f.replace(/\.svg$/, ''), url: `/penny-gh/raw/${folder}/${f}` }))
            .filter((e) => !EXCLUDED.has(e.name))
            .sort((a, b) => a.name.localeCompare(b.name));

        setSets({
          '24 - Large': toEntries(mediumFiles, 'medium'),
          '16 - Small': toEntries(smallFiles, 'small'),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('[IconGallery] Failed to load icons from GitHub:', err);
        setLoading(false);
      });
  }, []);

  const ALL_NAMES = useMemo(() => {
    const names = new Set([
      ...sets['24 - Large'].map((e) => e.name),
      ...sets['16 - Small'].map((e) => e.name),
    ]);
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [sets]);

  const urlBySize = useMemo<Record<SetKey, Record<string, string>>>(() => ({
    '24 - Large': Object.fromEntries(sets['24 - Large'].map((e) => [e.name, e.url])),
    '16 - Small': Object.fromEntries(sets['16 - Small'].map((e) => [e.name, e.url])),
  }), [sets]);

  // "Download all" -> zip every icon in the current size.
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

  // Keep scroll position steady when switching icon size.
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = savedScroll.current;
  }, [set]);
  const changeSet = (k: SetKey) => {
    if (scrollRef.current) savedScroll.current = scrollRef.current.scrollTop;
    setSet(k);
  };

  // Custom always-visible scrollbar.
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
  useLayoutEffect(updateThumb, [set, query, loading]);

  // Draggable thumb.
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

  const urlByCurrentSize = urlBySize[set];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_NAMES;
    return ALL_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query, ALL_NAMES]);

  const copy = (name: string) => {
    navigator.clipboard?.writeText(name);
    setCopied(name);
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  const downloadAll = async (fmt: FmtKey) => {
    setAllMenu(false);
    const names = filtered.filter((n) => urlByCurrentSize[n]);
    if (!names.length) return;
    setProgress({ done: 0, total: names.length });
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const sizeLabel = set.startsWith('24') ? '24-large' : '16-small';
      const folderName = `icons-${sizeLabel}-${fmt === 'jpeg' ? 'jpg' : fmt}`;
      const folder = zip.folder(folderName)!;
      for (let i = 0; i < names.length; i++) {
        const svgUrl = urlByCurrentSize[names[i]];
        const rawText = svgUrl ? await fetchRawSvg(svgUrl) : undefined;
        const svgStr = normalizeSvg(null, rawText);
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
    <div style={{ fontFamily: FONT, color: '#1A1A1A' }}>
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
                placeholder="Search icons..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 14px 9px 36px', borderRadius: 8, border: '1px solid #E5E5EA', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <span style={{ color: '#8A8A99', fontSize: 13, whiteSpace: 'nowrap' }}>
              {loading ? 'Loading...' : `${filtered.length} shown`}
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Download all */}
            <div ref={allWrap} style={{ position: 'relative' }}>
              <button
                onClick={() => (progress ? null : setAllMenu((o) => !o))}
                disabled={!!progress || loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  border: '1px solid #E5E5EA',
                  cursor: progress || loading ? 'default' : 'pointer',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  background: '#FFFFFF',
                  color: progress || loading ? '#9AA0AA' : '#1A1A1A',
                }}
              >
                <DownloadIcon size={14} />
                {progress ? `Preparing ${progress.done}/${progress.total}...` : 'Download all'}
              </button>
              {allMenu && !progress && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 190, background: '#FFFFFF', borderRadius: 12, border: '1px solid #ECECF1', boxShadow: '0 12px 32px rgba(20,20,40,0.18)', padding: 6, zIndex: 50 }}>
                  <div style={{ fontSize: 11, color: '#9AA0AA', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    All {px}px - {filtered.filter((n) => urlByCurrentSize[n]).length} files
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
              {(['24 - Large', '16 - Small'] as SetKey[]).map((k) => (
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
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9AA0AA', fontSize: 13 }}>
                Loading icons from GitHub...
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                {filtered.map((name) => (
                  <IconCell key={name} name={name} url={urlByCurrentSize[name]} px={px} copied={copied === name} onCopy={copy} />
                ))}
              </div>
            )}
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
