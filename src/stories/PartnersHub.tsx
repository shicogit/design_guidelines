import { useState, useEffect, type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Body, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon, DownloadIcon } from './brandKit';
import { triggerDownload } from './downloadUtils';
import { MelAnim, melioUrl } from './IllustrationsGuidelines';

/* For Partners - a starting point for freelancers & agencies working with the Melio
   marketing team: a short orientation, the non-negotiables, and every file to download
   in one place. */


// Melio product illustration Lottie files.
const melioIllustMods = import.meta.glob('../assets/illustrations/melio/*.json', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
// Partners illustration Lottie files.
const partnersIllustMods = import.meta.glob('../assets/illustrations/partners/*.json', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Agent Mel MOV alpha files (for card button).
const agentMelMovMods = import.meta.glob('../assets/agent-mel/*.mov', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const agentMelLottieMods = import.meta.glob('../assets/agent-mel/*.json', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const agentMelIconUrl = agentMelLottieMods['../assets/agent-mel/icon-thinking.json'];
// Agent Mel _mov alpha deliverables (for download all zip).
const agentMelAlphaMods = import.meta.glob('../assets/agent-mel/mov-alpha/*.mov', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Logo files (filenames look like "Mode=Full Logo, Color=Black.png").
const logoMods = import.meta.glob('../assets/logos/melio/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Parse every logo variant into { mode, color, url, file }, ordered mode-then-color.
const MODE_ORDER = ['Full Logo', 'App Symbol', 'IO', 'Circle', 'Square'];
const COLOR_ORDER = ['Purple', 'Black', 'White'];
const LOGOS = Object.entries(logoMods)
  .map(([path, url]) => {
    const name = decodeURIComponent(path.split('/').pop()!.replace(/\.png$/, ''));
    const mode = (name.match(/Mode=([^,]+)/)?.[1] || '').trim();
    const color = (name.match(/Color=([^,]+)/)?.[1] || '').trim();
    return { mode, color, url, file: `melio-${mode.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase()}.png` };
  })
  .sort((a, b) => MODE_ORDER.indexOf(a.mode) - MODE_ORDER.indexOf(b.mode) || COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color));

const POLY = "'PolySans', 'Poppins', sans-serif";
const POLY_MONO = "'PolySans Mono', 'PolySans', monospace";
const POLY_WIDE = "'PolySans Wide', 'PolySans', sans-serif";

type FontFile = { label: string; file: string; family: string; weight: number; italic: boolean };

const POLYSANS_FILES: FontFile[] = [
  { label: 'Slim',         file: 'PolySans-Slim.woff2',         family: POLY, weight: 300, italic: false },
  { label: 'Slim Italic',  file: 'PolySans-SlimItalic.woff2',   family: POLY, weight: 300, italic: true  },
  { label: 'Neutral',      file: 'PolySans-Neutral.woff2',      family: POLY, weight: 400, italic: false },
  { label: 'Neutral Italic', file: 'PolySans-NeutralItalic.woff2', family: POLY, weight: 400, italic: true },
  { label: 'Median',       file: 'PolySans-Median.woff2',       family: POLY, weight: 500, italic: false },
  { label: 'Median Italic', file: 'PolySans-MedianItalic.woff2', family: POLY, weight: 500, italic: true },
  { label: 'Bulky',        file: 'PolySans-Bulky.woff2',        family: POLY, weight: 700, italic: false },
  { label: 'Bulky Italic', file: 'PolySans-BulkyItalic.woff2',  family: POLY, weight: 700, italic: true  },
];

const MONO_FILES: FontFile[] = [
  { label: 'Slim',         file: 'PolySans-SlimMono.otf',         family: POLY_MONO, weight: 300, italic: false },
  { label: 'Slim Italic',  file: 'PolySans-SlimMonoItalic.otf',   family: POLY_MONO, weight: 300, italic: true  },
  { label: 'Neutral',      file: 'PolySans-NeutralMono.otf',      family: POLY_MONO, weight: 400, italic: false },
  { label: 'Neutral Italic', file: 'PolySans-NeutralMonoItalic.otf', family: POLY_MONO, weight: 400, italic: true },
  { label: 'Median',       file: 'PolySans-MedianMono.otf',       family: POLY_MONO, weight: 500, italic: false },
  { label: 'Median Italic', file: 'PolySans-MedianMonoItalic.otf', family: POLY_MONO, weight: 500, italic: true },
  { label: 'Bulky',        file: 'PolySans-BulkyMono.otf',        family: POLY_MONO, weight: 700, italic: false },
  { label: 'Bulky Italic', file: 'PolySans-BulkyMonoItalic.otf',  family: POLY_MONO, weight: 700, italic: true  },
];

const WIDE_FILES: FontFile[] = [
  { label: 'Slim',         file: 'PolySans-SlimWide.otf',         family: POLY_WIDE, weight: 300, italic: false },
  { label: 'Slim Italic',  file: 'PolySans-SlimWideItalic.otf',   family: POLY_WIDE, weight: 300, italic: true  },
  { label: 'Neutral',      file: 'PolySans-NeutralWide.otf',      family: POLY_WIDE, weight: 400, italic: false },
  { label: 'Neutral Italic', file: 'PolySans-NeutralWideItalic.otf', family: POLY_WIDE, weight: 400, italic: true },
  { label: 'Median',       file: 'PolySans-MedianWide.otf',       family: POLY_WIDE, weight: 500, italic: false },
  { label: 'Median Italic', file: 'PolySans-MedianWideItalic.otf', family: POLY_WIDE, weight: 500, italic: true },
  { label: 'Bulky',        file: 'PolySans-BulkyWide.otf',        family: POLY_WIDE, weight: 700, italic: false },
  { label: 'Bulky Italic', file: 'PolySans-BulkyWideItalic.otf',  family: POLY_WIDE, weight: 700, italic: true  },
];

// Page IDs for deep links into the rest of the Storybook.
const PAGES = {
  logo: 'identity-logo--docs',
  color: 'identity-color--docs',
  type: 'identity-typography--docs',
  illustrations: 'identity-visual-assets-illustrations--docs',
  icons: 'identity-visual-assets-icons--docs',
  agentMel: 'identity-visual-assets-agent-mel--docs',
};

// ---------- small building blocks ----------

function CountPill({ count }: { count: number }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, color: '#8A8A99',
      background: '#F1F1F4', borderRadius: 999,
      padding: '2px 8px', lineHeight: 1.5,
    }}>
      {count}
    </span>
  );
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        border: `1px solid ${COLOR.cardBorder}`,
        borderRadius: RADIUS.lg,
        padding: 18,
        background: COLOR.white,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A pill button that links to a downloadable file, an external URL, or triggers an action.
    Pass `dark` for white/inverse content that needs a dark pill background.
    Pass `onClick` (no `href`) to render a button instead of an anchor. */
function DownloadButton({ href, download, title, dark, disabled, onClick, children }: {
  href?: string; download?: string; title?: string; dark?: boolean; disabled?: boolean;
  onClick?: () => void; children: ReactNode;
}) {
  const bg     = dark ? COLOR.ink : COLOR.white;
  const fg     = dark ? COLOR.white : COLOR.ink;
  const border = dark ? 'rgba(255,255,255,0.2)' : COLOR.outline;
  const hoverBg     = dark ? '#2e2e2e' : COLOR.hover;
  const hoverBorder = dark ? 'rgba(255,255,255,0.45)' : COLOR.purple;
  const shared: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px',
    borderRadius: 999, border: `1px solid ${border}`, background: bg, color: fg,
    fontSize: 13, fontWeight: 500, fontFamily: FONT, textDecoration: 'none',
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.6 : 1,
    transition: 'background 120ms, border-color 120ms',
  };
  const hover = disabled ? {} : {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.background = hoverBg;
      e.currentTarget.style.borderColor = hoverBorder;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.background = bg;
      e.currentTarget.style.borderColor = border;
    },
  };
  const inner = <><DownloadIcon />{children}</>;
  if (onClick) {
    return <button onClick={onClick} disabled={disabled} style={shared} {...hover}>{inner}</button>;
  }
  return (
    <a href={href} download={download} title={title}
      target={download ? undefined : '_blank'} rel={download ? undefined : 'noreferrer'}
      style={shared} {...hover}>{inner}</a>
  );
}

/** A link into another Storybook page (opens in the top window so the sidebar updates). */
function PageLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a
      href={`/?path=/docs/${id}`}
      target="_top"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: COLOR.purple,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
      }}
    >
      {children}
      <DsIcon name="arrow right" size={14} style={{ color: COLOR.purple }} />
    </a>
  );
}

function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      title={copied ? 'Copied!' : 'Copy hex'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        color: copied ? COLOR.purple : COLOR.muted,
        fontSize: 13, fontVariantNumeric: 'tabular-nums', fontFamily: FONT,
        transition: 'color 120ms',
      }}
    >
      {hex.toUpperCase()}
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: copied ? 1 : 0.45 }}>
        {copied ? (
          <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="5" y="1" width="9" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 5H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}

// A single checklist line.
function Check({ children }: { children: ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <span style={{ flex: '0 0 auto', marginTop: 1 }}>
        <DsIcon name="checked" size={18} style={{ color: COLOR.purple }} />
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.55, color: COLOR.body }}>{children}</span>
    </li>
  );
}

function MiniDownloadCard({
  visual, label, count, onClick, href, download: dl, disabled, dark,
}: {
  visual: ReactNode; label: string; count?: number;
  onClick?: () => void; href?: string; download?: string; disabled?: boolean; dark?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const borderColor = hov && !disabled ? COLOR.outline : COLOR.cardBorder;
  const inner = (
    <>
      <div style={{
        background: dark ? COLOR.ink : COLOR.panel,
        height: 76,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {visual}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 9px',
        borderTop: `1px solid ${COLOR.cardBorder}`,
        background: COLOR.white,
      }}>
        <DsIcon name="download" size={13} style={{ color: COLOR.ink, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 500, flex: 1, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
        {count !== undefined && <CountPill count={count} />}
      </div>
    </>
  );
  const base: React.CSSProperties = {
    borderRadius: 10, border: `1px solid ${borderColor}`, overflow: 'hidden',
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
    transition: 'border-color 120ms', display: 'block', textDecoration: 'none',
    color: 'inherit', fontFamily: FONT, background: 'none', padding: 0,
    width: '100%', textAlign: 'left' as const,
  };
  const evts = { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) };
  if (onClick) return <button style={base as any} onClick={disabled ? undefined : onClick} {...evts}>{inner}</button>;
  if (href) return <a href={href} download={dl} style={base} {...evts}>{inner}</a>;
  return <div style={{ ...base, cursor: 'default' }}>{inner}</div>;
}

function MiniColorCard({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false);
  const [hov, setHov] = useState(false);
  const isLight = hex.toUpperCase() === '#F6F8FE' || hex.toUpperCase() === '#EAEDFE' || hex.toUpperCase() === '#D8DEFE';
  return (
    <div
      title="Click to copy hex"
      onClick={() => { navigator.clipboard.writeText(hex).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}
      style={{
        cursor: 'pointer',
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${hov ? COLOR.outline : COLOR.cardBorder}`,
        transition: 'border-color 120ms',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ height: 76, background: hex, borderBottom: isLight ? `1px solid ${COLOR.hairline}` : undefined }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 9px', borderTop: `1px solid ${COLOR.cardBorder}`, background: COLOR.white }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: COLOR.ink }}>
          <rect x="5" y="1" width="9" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 5H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 500, flex: 1, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        <span style={{ fontSize: 10, color: copied ? COLOR.purple : COLOR.muted, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{copied ? 'Copied!' : hex.toUpperCase()}</span>
      </div>
    </div>
  );
}

const SAMPLE_ICONS = ['home', 'settings', 'chat', 'get-started', 'search', 'notification'];

const COLOR_TOKENS: { name: string; hex: string }[] = [
  { name: 'Primary / Purple', hex: COLOR.purple },
  { name: 'lilac-400', hex: COLOR.lilac400 },
  { name: 'lilac-300', hex: COLOR.lilac300 },
  { name: 'lilac-200', hex: COLOR.lilac200 },
  { name: 'lilac-100', hex: COLOR.lilac100 },
  { name: 'Ink', hex: COLOR.ink },
];

export function PartnersHub() {
  const [kitState, setKitState] = useState<'idle' | 'busy' | 'error'>('idle');
  const [fontZipState, setFontZipState] = useState<Record<string, 'idle' | 'busy'>>({});

  // Icon lists loaded from melio/penny on GitHub via Vite proxy.
  // Keys use the path segment so path.split('/').pop() still yields the filename.
  const [iconLargeMods, setIconLargeMods] = useState<Record<string, string>>({});
  const [iconSmallMods, setIconSmallMods] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch('/penny-gh/list/medium.json')
      .then((r) => r.json() as Promise<string[]>)
      .then((files) => {
        const mods: Record<string, string> = {};
        files.forEach((f) => { mods[`medium/${f}`] = `/penny-gh/raw/medium/${f}`; });
        setIconLargeMods(mods);
      })
      .catch(console.error);
    fetch('/penny-gh/list/small.json')
      .then((r) => r.json() as Promise<string[]>)
      .then((files) => {
        const mods: Record<string, string> = {};
        files.forEach((f) => { mods[`small/${f}`] = `/penny-gh/raw/small/${f}`; });
        setIconSmallMods(mods);
      })
      .catch(console.error);
  }, []);

  const downloadFontZip = async (id: string, zipName: string, files: FontFile[]) => {
    setFontZipState((s) => ({ ...s, [id]: 'busy' }));
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (const f of files) {
        const res = await fetch(`/fonts/polysans/${f.file}`);
        zip.file(f.file, await res.blob());
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, zipName);
    } catch (err) {
      console.error('font zip failed', err);
    } finally {
      setFontZipState((s) => ({ ...s, [id]: 'idle' }));
    }
  };

  const downloadAssetZip = async (id: string, zipName: string, mods: Record<string, string>) => {
    setFontZipState((s) => ({ ...s, [id]: 'busy' }));
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (const [path, url] of Object.entries(mods)) {
        const name = decodeURIComponent(path.split('/').pop()!);
        const res = await fetch(url);
        zip.file(name, await res.blob());
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, zipName);
    } catch (err) {
      console.error('zip failed', err);
    } finally {
      setFontZipState((s) => ({ ...s, [id]: 'idle' }));
    }
  };

  // Download everything: all font families, logos, illustrations, icons, and Agent Mel.
  const downloadLogoColor = (color: string) => {
    const mods: Record<string, string> = {};
    LOGOS.filter((l) => l.color === color).forEach((l) => { mods[l.file] = l.url; });
    downloadAssetZip(`logos-${color.toLowerCase()}`, `melio-logos-${color.toLowerCase()}.zip`, mods);
  };

  const downloadStarterKit = async () => {
    setKitState('busy');
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Fonts - all three PolySans families
      for (const [subdir, files] of [
        ['polysans', POLYSANS_FILES],
        ['polysans-mono', MONO_FILES],
        ['polysans-wide', WIDE_FILES],
      ] as [string, FontFile[]][]) {
        const folder = zip.folder(`fonts/${subdir}`)!;
        for (const f of files) {
          const res = await fetch(`/fonts/polysans/${f.file}`);
          if (res.ok) folder.file(f.file, await res.blob());
        }
      }

      // Logos - all modes and colors
      const logoFolder = zip.folder('logos')!;
      for (const [path, url] of Object.entries(logoMods)) {
        const name = decodeURIComponent(path.split('/').pop()!);
        const res = await fetch(url);
        if (res.ok) logoFolder.file(name, await res.blob());
      }

      // Illustrations
      const illustFolder = zip.folder('illustrations')!;
      for (const [path, url] of Object.entries(melioIllustMods)) {
        const name = decodeURIComponent(path.split('/').pop()!);
        const res = await fetch(url);
        if (res.ok) illustFolder.file(name, await res.blob());
      }

      // Icons
      const icons24 = zip.folder('icons/24px')!;
      for (const [path, url] of Object.entries(iconLargeMods)) {
        const name = decodeURIComponent(path.split('/').pop()!);
        const res = await fetch(url);
        if (res.ok) icons24.file(name, await res.blob());
      }
      const icons16 = zip.folder('icons/16px')!;
      for (const [path, url] of Object.entries(iconSmallMods)) {
        const name = decodeURIComponent(path.split('/').pop()!);
        const res = await fetch(url);
        if (res.ok) icons16.file(name, await res.blob());
      }

      // Agent Mel - use the _mov alpha deliverables
      const melFolder = zip.folder('agent-mel')!;
      for (const [path, url] of Object.entries(agentMelAlphaMods)) {
        const name = decodeURIComponent(path.split('/').pop()!);
        const res = await fetch(url);
        if (res.ok) melFolder.file(name, await res.blob());
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'melio-brand-assets.zip');
      setKitState('idle');
    } catch (err) {
      console.error('download all failed', err);
      setKitState('error');
    }
  };

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      {/* Hero */}
      <Hero title="Working with the Melio brand" visual={<MelAnim url={melioUrl('announce')} size={200} />}>
        <Lead style={{ margin: 0 }}>
          Welcome - this page is for <Med>freelancers and agencies</Med> partnering with the Melio marketing team. It's a
          five-minute orientation to how we work, plus every file you'll need in one place. The deeper rules live in the
          rest of these guidelines; start here.
        </Lead>
      </Hero>

      {/* How we work */}
      <SectionTitle sub="A few principles that keep partner work unmistakably Melio.">How we work</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {([
          { n: '1', label: "Use what's here", text: "Use the provided assets and tokens. Don't recreate from scratch." },
          { n: '2', label: 'Keep assets as-is', text: 'Never redraw, recolor, or resize. Use the files exactly as supplied.' },
          { n: '3', label: 'Match type & color', text: 'PolySans for marketing, Poppins for product. Use the exact hex tokens.' },
        ] as const).map(({ n, label, text }) => (
          <div key={n} style={{ background: COLOR.panel, borderRadius: RADIUS.lg, padding: '16px 18px' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: COLOR.purple, fontFamily: FONT, lineHeight: 1, marginBottom: 8 }}>{n}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLOR.ink, fontFamily: FONT, marginBottom: 4 }}>{label}</div>
            <p style={{ fontSize: 13, color: COLOR.muted, fontFamily: FONT, margin: 0, lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Downloads hub */}
      <SectionTitle sub="Every file you'll need, grouped by type. Bulk sets (all illustrations, all icons) live on their own pages - linked below.">
        Files to download
      </SectionTitle>

      <div style={{ background: COLOR.panel, borderRadius: RADIUS.lg, padding: '18px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <span style={{ fontSize: 13, color: COLOR.muted }}>Fonts, logos, color tokens, icons &amp; illustrations</span>
          <button
            onClick={downloadStarterKit}
            disabled={kitState === 'busy'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 999,
              border: `1px solid ${COLOR.outline}`,
              background: COLOR.white,
              color: COLOR.ink,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: kitState === 'busy' ? 'default' : 'pointer',
              opacity: kitState === 'busy' ? 0.7 : 1,
              flexShrink: 0,
            }}
          >
            <DownloadIcon />
            {kitState === 'busy' ? 'Zipping...' : kitState === 'error' ? 'Try again' : 'Download all'}
          </button>
        </div>
        {kitState === 'error' && (
          <p style={{ fontSize: 12, color: COLOR.muted, margin: '-8px 2px 14px' }}>
            Couldn't build the zip just now - you can still grab each file from the sections below.
          </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {/* Fonts */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DsIcon name="file" size={16} style={{ color: COLOR.ink }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Fonts</div>
            <CountPill count={POLYSANS_FILES.length + MONO_FILES.length + WIDE_FILES.length} />
          </div>
          <Body style={{ margin: '0 0 12px' }}>
            <Med>PolySans</Med> for marketing assets, <Med>Poppins</Med> for product (free on Google Fonts).
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {([
              { id: 'polysans', label: 'PolySans', family: POLY, files: POLYSANS_FILES, zip: 'polysans.zip' },
              { id: 'mono', label: 'PolySans Mono', family: POLY_MONO, files: MONO_FILES, zip: 'polysans-mono.zip' },
              { id: 'wide', label: 'PolySans Wide', family: POLY_WIDE, files: WIDE_FILES, zip: 'polysans-wide.zip' },
            ] as const).map(({ id, label, family, files, zip }) => {
              const busy = fontZipState[id] === 'busy';
              return (
                <MiniDownloadCard
                  key={id}
                  label={busy ? 'Zipping…' : label}
                  count={files.length}
                  disabled={busy}
                  onClick={() => downloadFontZip(id, zip, files)}
                  visual={
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: family, fontWeight: 500, fontSize: 28, lineHeight: 1, color: COLOR.ink }}>Ag</div>
                      <div style={{ fontFamily: family, fontWeight: 400, fontSize: 10, color: COLOR.muted, marginTop: 5 }}>Aa Bb Cc</div>
                    </div>
                  }
                />
              );
            })}
            <MiniDownloadCard
              label="Poppins"
              href="https://fonts.google.com/specimen/Poppins"
              visual={
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 28, lineHeight: 1, color: COLOR.ink }}>Ag</div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 10, color: COLOR.muted, marginTop: 5 }}>Aa Bb Cc</div>
                </div>
              }
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <PageLink id={PAGES.type}>Typography guidelines</PageLink>
          </div>
        </Card>

        {/* Logos */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DsIcon name="image-add" size={16} style={{ color: COLOR.ink }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Logos</div>
          </div>
          <Body style={{ margin: '0 0 14px' }}>
            All modes and colors as PNG - click any to download. Full rules on the Logo page.
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {COLOR_ORDER.map((color) => {
              const group = LOGOS.filter((l) => l.color === color);
              if (!group.length) return null;
              const isDark = color === 'White';
              const busy = fontZipState[`logos-${color.toLowerCase()}`] === 'busy';
              return (
                <MiniDownloadCard
                  key={color}
                  label={busy ? 'Zipping…' : `${color}`}
                  count={group.length}
                  dark={isDark}
                  disabled={busy}
                  onClick={() => downloadLogoColor(color)}
                  visual={
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 8 }}>
                      {group.map((l) => (
                        <img key={l.file} src={l.url} alt={l.mode} style={{ height: 11, maxWidth: 38, objectFit: 'contain' }} />
                      ))}
                    </div>
                  }
                />
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}>
            <PageLink id={PAGES.logo}>All logo modes &amp; rules</PageLink>
          </div>
        </Card>

        {/* Color */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DsIcon name="light-sun" size={16} style={{ color: COLOR.ink }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Color</div>
          </div>
          <Body style={{ margin: '0 0 12px' }}>Exact hex values only - no eyeballing. Click any swatch to copy.</Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {COLOR_TOKENS.map((c) => (
              <MiniColorCard key={c.name} name={c.name} hex={c.hex} />
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <PageLink id={PAGES.color}>Full color guidelines</PageLink>
          </div>
        </Card>

        {/* Illustrations */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DsIcon name="edit" size={16} style={{ color: COLOR.ink }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Illustrations</div>
            <CountPill count={Object.keys(melioIllustMods).length} />
          </div>
          <Body style={{ margin: '0 0 12px' }}>
            Melio kit (with Mel) and Partners kit (recolored to your brand). Lottie, SVG, PNG, or GIF.
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 12 }}>
            <MiniDownloadCard
              label={fontZipState['illustrationsProduct'] === 'busy' ? 'Zipping…' : 'Melio product kit'}
              count={Object.keys(melioIllustMods).length}
              disabled={fontZipState['illustrationsProduct'] === 'busy'}
              onClick={() => downloadAssetZip('illustrationsProduct', 'melio-product-illustrations.zip', melioIllustMods)}
              visual={<MelAnim url={melioUrl('money-success')} size={64} />}
            />
            <MiniDownloadCard
              label={fontZipState['illustrationsPartners'] === 'busy' ? 'Zipping…' : 'Partners product kit'}
              count={Object.keys(partnersIllustMods).length}
              disabled={fontZipState['illustrationsPartners'] === 'busy'}
              onClick={() => downloadAssetZip('illustrationsPartners', 'partners-product-illustrations.zip', partnersIllustMods)}
              visual={<MelAnim url={partnersIllustMods['../assets/illustrations/partners/announce.json']} size={64} />}
            />
            <MiniDownloadCard
              label="Mel illustrations"
              disabled
              visual={<img src="/src/assets/guidelines/illustrations/01_This%20is%20Mel.png" alt="Mel" style={{ height: 68, objectFit: 'contain' }} />}
            />
          </div>
          <PageLink id={PAGES.illustrations}>Open the illustration kit</PageLink>
        </Card>

        {/* Icons */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Icons</div>
            <CountPill count={Object.keys(iconLargeMods).length} />
          </div>
          <Body style={{ margin: '0 0 12px' }}>
            Penny - Melio's 340-icon set at 16px and 24px. Download SVG zips or browse the gallery.
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 12 }}>
            <MiniDownloadCard
              label={fontZipState['icons24'] === 'busy' ? 'Zipping…' : 'Medium · 24px'}
              count={Object.keys(iconLargeMods).length}
              disabled={fontZipState['icons24'] === 'busy'}
              onClick={() => downloadAssetZip('icons24', 'penny-icons-24px.zip', iconLargeMods)}
              visual={
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 4 }}>
                  {SAMPLE_ICONS.map((n) => <DsIcon key={n} name={n} size={20} style={{ color: COLOR.ink }} />)}
                </div>
              }
            />
            <MiniDownloadCard
              label={fontZipState['icons16'] === 'busy' ? 'Zipping…' : 'Small · 16px'}
              count={Object.keys(iconSmallMods).length}
              disabled={fontZipState['icons16'] === 'busy'}
              onClick={() => downloadAssetZip('icons16', 'penny-icons-16px.zip', iconSmallMods)}
              visual={
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: 4 }}>
                  {SAMPLE_ICONS.map((n) => <DsIcon key={n} name={n} size={14} style={{ color: COLOR.ink }} />)}
                </div>
              }
            />
          </div>
          <PageLink id={PAGES.icons}>Open the icon gallery</PageLink>
        </Card>

        {/* Agent Mel */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <DsIcon name="mel" size={16} style={{ color: COLOR.ink }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Agent Mel</div>
          </div>
          <Body style={{ margin: '0 0 12px' }}>
            Melio's AI agent character - distinct from the Mel mascot. Read the usage rules before placing.
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 12 }}>
            <MiniDownloadCard
              label={fontZipState['agentMelMov'] === 'busy' ? 'Zipping…' : 'Motion assets'}
              count={Object.keys(agentMelMovMods).length}
              disabled={fontZipState['agentMelMov'] === 'busy'}
              onClick={() => downloadAssetZip('agentMelMov', 'agent-mel-mov-alpha.zip', agentMelMovMods)}
              visual={
                <div style={{ textAlign: 'center' }}>
                  <MelAnim url={agentMelIconUrl} size={52} />
                  <div style={{ fontSize: 10, color: COLOR.muted, marginTop: 3, fontFamily: FONT }}>MOV · Alpha</div>
                </div>
              }
            />
          </div>
          <PageLink id={PAGES.agentMel}>Agent Mel guidelines</PageLink>
        </Card>
        </div>
      </div>

    </div>
  );
}
