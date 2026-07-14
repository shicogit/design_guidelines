import { useState, useEffect } from 'react';
import { FONT, COLOR, RADIUS, Med, SectionTitle, Body, Lead, SubTitle, Hero, DownloadIcon, DsIcon, DownloadAllBanner, FigmaLogo, ResourceFooter } from './brandKit';
import { DOWNLOADS_ENABLED, triggerDownload } from './downloadUtils';

// Aliases onto the shared palette - single source of truth lives in brandKit.
const LILAC_100 = COLOR.lilac100;
const LILAC_300 = COLOR.lilac300;

// Melio logo variants - filenames look like "Mode=Full Logo, Color=Black.png".
const logoMods = import.meta.glob('../assets/logos/melio/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Named static assets (not logo variants)
const staticAsset = (name: string) => logoMods[`../assets/logos/melio/${name}`] ?? '';

// SVG logo variants
const logoSvgMods = import.meta.glob('../assets/logos/melio/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Logo guideline images (mockups, etc.)
const logoGuideMods = import.meta.glob('../assets/guidelines/logo/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const logoGuideUrl = (name: string) => logoGuideMods[`../assets/guidelines/logo/${name}`] ?? '';

type Variant = { mode: string; color: string; pngUrl: string; svgUrl: string };

const VARIANTS: Variant[] = Object.entries(logoMods).map(([path, pngUrl]) => {
  const file = decodeURIComponent(path.split('/').pop()!.replace(/\.png$/, ''));
  const mode = /Mode=([^,]+)/.exec(file)?.[1]?.trim() ?? file;
  const color = /Color=([^,]+)/.exec(file)?.[1]?.trim() ?? '';
  const svgKey = `../assets/logos/melio/Mode=${mode}, Color=${color}.svg`;
  const svgUrl = logoSvgMods[svgKey] ?? pngUrl;
  return { mode, color, pngUrl, svgUrl };
});

// url() returns SVG for display; pngUrl() returns PNG for download fallback
const url = (mode: string, color: string) =>
  VARIANTS.find((v) => v.mode === mode && v.color === color)?.svgUrl ?? '';
const pngUrl = (mode: string, color: string) =>
  VARIANTS.find((v) => v.mode === mode && v.color === color)?.pngUrl ?? '';

const MODES: { mode: string; desc: string }[] = [
  { mode: 'Full Logo', desc: 'The complete melio wordmark - the primary logo for most surfaces, especially marketing.' },
  { mode: 'IO', desc: 'The compact "io" mark, for tight or secondary placements where a full logo is already nearby.' },
  { mode: 'App Symbol', desc: 'The standalone symbol used as an app or product icon.' },
  { mode: 'Circle', desc: 'Circular app icon variant - for platforms that require a rounded container.' },
  { mode: 'Square', desc: 'Square app icon variant - for platforms that require a square container.' },
];

const MAIN_MODES = MODES.slice(0, 3);
const ICON_VARIANTS = MODES.slice(3);

const COLOR_ORDER = ['Purple', 'Black', 'White'];


// ---------- small building blocks ----------

function Tile({
  children,
  dark,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderRadius: RADIUS.lg,
        background: dark ? COLOR.ink : COLOR.panel,
        border: `1px solid ${COLOR.hairline}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Swatch({ v }: { v: Variant }) {
  const onDark = v.color === 'White';
  const fill = v.color !== 'White' ? { background: LILAC_100 } : {};
  return (
    <div style={{ borderRadius: RADIUS.lg, overflow: 'hidden' }}>
      <Tile dark={onDark} style={{ width: '100%', height: 130, padding: 24, borderRadius: 0, ...fill }}>
        <img
          src={v.svgUrl || v.pngUrl}
          alt={`${v.mode} - ${v.color}`}
          style={{ maxWidth: '70%', maxHeight: 40, objectFit: 'contain' }}
        />
      </Tile>
    </div>
  );
}

function ModesSection() {
  const [color, setColor] = useState<'Purple' | 'White' | 'Black'>('White');
  const isDark = color === 'White';
  const bg = color === 'White' ? COLOR.purple : COLOR.white;
  const modes = [
    { mode: 'Full Logo', label: 'Full Logo' },
    { mode: 'IO', label: 'IO mark' },
    { mode: 'App Symbol', label: 'App symbol' },
  ];
  return (
    <div style={{ background: COLOR.panel, borderRadius: 15, padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {modes.map(({ mode, label }) => {
          const v = VARIANTS.find((vv) => vv.mode === mode && vv.color === color);
          if (!v) return null;
          return (
            <div key={mode}>
              <p style={{ fontFamily: FONT, fontSize: 12, color: COLOR.muted, margin: '0 0 8px', textAlign: 'center' }}>{label}</p>
              <Tile dark={isDark} style={{ background: bg, minHeight: 120 }}>
                <img src={v.svgUrl || v.pngUrl} alt={label} style={{ maxWidth: '70%', maxHeight: 44, objectFit: 'contain' }} />
              </Tile>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
        {(['White', 'Purple', 'Black'] as const).map((c) => {
          const active = color === c;
          const fill = { White: COLOR.white, Purple: COLOR.purple, Black: COLOR.ink }[c];
          return (
            <button key={c} onClick={() => setColor(c)} title={c} aria-label={c} style={{ width: 20, height: 20, borderRadius: '50%', border: c === 'White' ? `1.5px solid ${COLOR.outline}` : 'none', cursor: 'pointer', background: fill, padding: 0, flexShrink: 0, outline: active ? `2px solid ${COLOR.purple}` : 'none', outlineOffset: 2, transition: 'outline 0.12s' }} />
          );
        })}
      </div>
    </div>
  );
}

function ModeBlock({ mode, desc }: { mode: string; desc: string }) {
  const variants = COLOR_ORDER.map((c) => VARIANTS.find((v) => v.mode === mode && v.color === c)).filter(
    Boolean,
  ) as Variant[];
  if (variants.length === 0) return null;
  return (
    <div style={{ margin: '0 0 28px' }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 2px' }}>{mode}</h3>
      <p style={{ fontSize: 14, color: COLOR.muted, margin: '0 0 12px', lineHeight: 1.6 }}>{desc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${variants.length}, minmax(0, 1fr))`, gap: 20 }}>
        {variants.map((v) => (
          <Swatch key={v.color} v={v} />
        ))}
      </div>
    </div>
  );
}

// Do / Don't example card: image preview on top, colored label strip on bottom
function Rule({
  ok,
  label,
  children,
  dark,
  bg,
  noPad,
}: {
  ok: boolean;
  label: string;
  children: React.ReactNode;
  dark?: boolean;
  bg?: string;
  noPad?: boolean;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', rowGap: 8 }}>
      <Tile dark={dark} style={{ ...(noPad ? {} : { minHeight: 130 }), borderRadius: 0, border: 'none', padding: 0, background: 'transparent', overflow: 'hidden' }}>
        {children}
      </Tile>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
        <DsIcon name={ok ? 'checked' : 'close'} size={12} style={{ color: ok ? '#1F9254' : '#D64545', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{label}</span>
      </div>
    </div>
  );
}

// ---------- Guidelines tab ----------

function SplitRow({ visual, title, body }: { visual: React.ReactNode; title: string; body: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 36, padding: '36px 0', borderTop: `1px solid ${COLOR.hairline}`, alignItems: 'start' }}>
      <div>{visual}</div>
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px', lineHeight: 1.25 }}>{title}</h3>
        <p style={{ fontFamily: FONT, fontSize: 13, color: COLOR.body, lineHeight: 1.65, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

export function LogoGuidelines() {
  const fullPurple = url('Full Logo', 'Purple');

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="The most recognizable mark"
        visual={<img src={fullPurple} alt="Melio logo" style={{ maxWidth: '76%', maxHeight: 72, objectFit: 'contain' }} />}
      >
        <Lead style={{ margin: 0 }}>
          The most recognizable piece of the brand. Keep it consistent: use an approved <Med>mode</Med> and{' '}
          <Med>color</Med>, give it room to breathe, and never alter its shapes. The primary logo is the full
          "melio" wordmark in <Med>Brand-700</Med>, on a light background.
        </Lead>
      </Hero>

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={staticAsset('before-after.png')} alt="Before and after" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
          </div>
        }
        title="Before and after"
        body="A bolder, cleaner mark - refined strokes and stronger presence at every size. Always use the updated logo."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={logoGuideUrl('Logo build structure.png')} alt="Logo build structure" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
          </div>
        }
        title="Build structure"
        body="Every element has a fixed proportional relationship - the wordmark, IO mark, and app symbol are all derived from the same grid."
      />

      <SplitRow
        visual={<ModesSection />}
        title="Modes"
        body="Three formats for every context. Full wordmark for most surfaces, IO mark for compact spaces, app symbol as a standalone icon."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { file: 'full-logo-purple-on-white.png',  label: 'Purple on white' },
                { file: 'full-logo-purple-on-lilac.png',  label: 'Purple on lilac' },
                { file: 'full-logo-white-on-purple.png',  label: 'White on purple' },
                { file: 'full-logo-black-on-white.png',   label: 'Black on white' },
                { file: 'full-logo-black-on-lilac.png',   label: 'Black on lilac' },
                { file: 'full-logo-white-on-black.png',   label: 'White on black' },
              ].map(({ file, label }) => (
                <div key={file}>
                  <p style={{ fontFamily: FONT, fontSize: 12, color: COLOR.muted, margin: '0 0 6px', textAlign: 'center' }}>{label}</p>
                  <img src={staticAsset(file)} alt={label} style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
                </div>
              ))}
            </div>
          </div>
        }
        title="Color"
        body="Purple, black, or white. Choose the version that stays clearly legible on its background."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={staticAsset('clear-space-spec.png')} alt="Clear space" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
          </div>
        }
        title="Clear space"
        body={'The minimum clear space on all sides equals the height of the "o" in the wordmark. No other element may cross into this zone.'}
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
              {([
                { file: "Logo don't - arrow proportions.png", label: "Altered proportions" },
                { file: "Logo don't - color variations.png",  label: "Color variations" },
                { file: "Logo don't - change color.png",      label: "Changed logo color" },
                { file: "Logo don't - change font.png",       label: "Changed font" },
                { file: "Logo don't - logotype changes.png",  label: "Altered logotype" },
                { file: "Logo don't - rotation.png",          label: "Rotated" },
                { file: "Logo don't - strech.png",            label: "Stretched" },
                { file: "Logo don't - inside shapes.png",     label: "Inside a shape" },
                { file: "Logo don't - stroke.png",            label: "Stroke added" },
                { file: "Logo don't - effects.png",           label: "Effects or shadows" },
              ] as const).map(({ file, label }) => {
                const src = logoGuideUrl(file);
                return src ? (
                  <Rule key={file} ok={false} noPad label={label}>
                    <img src={src} alt={label} style={{ width: '100%', borderRadius: 0, display: 'block' }} />
                  </Rule>
                ) : null;
              })}
            </div>
          </div>
        }
        title="Don'ts"
        body="Never stretch, rotate, recolor, or add effects to the logo. Use only the approved files."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(['Logo mockup 01.png', 'Logo mockup 04.png', 'Logo mockup 03.png', 'Logo mockup 02.png'] as const).map((file) => {
                const src = logoGuideUrl(file);
                return src ? (
                  <img key={file} src={src} alt={file.replace(/\.\w+$/, '')} style={{ width: '100%', aspectRatio: '4 / 3', display: 'block', objectFit: 'cover', borderRadius: RADIUS.md, border: `1px solid ${COLOR.hairline}` }} />
                ) : null;
              })}
            </div>
          </div>
        }
        title="In use"
        body="The logo across product, marketing, and social surfaces."
      />

    </div>
  );
}

// ---------- Co-Branding tab ----------

export function LogoCoBranding() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Pairing with partners"
        visual={<img src={logoGuideUrl('melio _ Xero.svg')} alt="melio and Xero co-branding lockup" style={{ maxWidth: 200, width: '100%', objectFit: 'contain', padding: 16 }} />}
      >
        <Lead style={{ margin: 0 }}>
          Please see below the two different conventions when aligning partner logos. When matching logo X height,
          please differentiate between type-only logos and type + symbol logos.
        </Lead>
      </Hero>

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={staticAsset('cobrand-symbol-formula.png')} alt="Logo + symbol matching formula" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
          </div>
        }
        title="Logo + symbol"
        body={<>For partners whose logo includes a <Med>symbol</Med> (e.g. PayPal), match on the symbol. Notice the O spacing.</>}
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={staticAsset('cobrand-logotype-formula.png')} alt="Logotype matching formula" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
          </div>
        }
        title="Type-only partners"
        body={<>For <Med>type-only</Med> partners (e.g. VISA), match on the logotype. Notice the O spacing.</>}
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <p style={{ fontFamily: FONT, fontSize: 12, color: COLOR.muted, margin: '0 0 6px', textAlign: 'center' }}>Black and white</p>
              <img src={staticAsset('cobrand-example-bw.png')} alt="Black and white logo matching example" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
            </div>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <p style={{ fontFamily: FONT, fontSize: 12, color: COLOR.muted, margin: '0 0 6px', textAlign: 'center' }}>Dimension pairings</p>
              <img src={staticAsset('cobrand-pairings.png')} alt="Various logo dimension pairings" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', border: `1px solid ${COLOR.hairline}` }} />
            </div>
          </div>
        }
        title="Examples"
      />
    </div>
  );
}

// ---------- Resources tab (downloads) ----------

const CARD_BG: Record<string, string> = {
  White: COLOR.purple,
  Purple: COLOR.panel,
  Black: COLOR.panel,
};

function LogoCard({ v, dlBase, openId, setOpenId }: { v: Variant; dlBase: string; openId: string | null; setOpenId: (id: string | null) => void }) {
  const id = `${v.mode}-${v.color}`;
  const open = openId === id;
  const [hovered, setHovered] = useState(false);
  const [copying, setCopying] = useState(false);
  const imgBg = CARD_BG[v.color] ?? COLOR.panel;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={DOWNLOADS_ENABLED ? (e) => { e.stopPropagation(); setOpenId(open ? null : id); } : undefined}
      style={{ borderRadius: RADIUS.lg, border: `1px solid ${DOWNLOADS_ENABLED && hovered ? COLOR.outline : COLOR.hairline}`, position: 'relative', cursor: DOWNLOADS_ENABLED ? 'pointer' : 'default', transition: 'border-color 120ms' }}
    >
      {/* Image */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 100, padding: 24,
        background: imgBg,
        borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`,
        overflow: 'hidden',
      }}>
        <img src={v.svgUrl || v.pngUrl} alt="" style={{ maxWidth: '70%', maxHeight: 44, objectFit: 'contain' }} />
      </div>

      {/* Inner strip: name + download */}
      <div style={{ position: 'relative' }}>
        {DOWNLOADS_ENABLED ? (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setOpenId(open ? null : id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                padding: '10px 12px',
                background: hovered ? COLOR.hover : COLOR.white,
                border: 'none',
                borderTop: `1px solid ${COLOR.hairline}`,
                borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`,
                cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                transition: 'background 120ms',
              }}
            >
              <DownloadIcon size={11} />
              <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>{v.mode} - {v.color}</span>
            </button>

            {open && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                background: COLOR.white, border: `1px solid ${COLOR.hairline}`,
                borderRadius: RADIUS.md, boxShadow: '0 12px 32px rgba(20,20,40,0.18)',
                minWidth: 180, zIndex: 200, padding: 6,
              }}>
                <div style={{ fontSize: 11, color: COLOR.faint, padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                  Download {v.color}
                </div>
                {[
                  { href: v.svgUrl, name: `${dlBase}.svg`, label: 'SVG', desc: 'vector' },
                  { href: v.pngUrl, name: `${dlBase}.png`, label: 'PNG', desc: 'raster' },
                ].map(({ href, name, label, desc }) => (
                  <a
                    key={label}
                    href={href}
                    download={name}
                    onClick={() => setOpenId(null)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                      padding: '9px 10px', borderRadius: 8,
                      fontSize: 14, fontWeight: 500, color: COLOR.ink, textDecoration: 'none', background: 'transparent',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {label}
                    <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>{desc}</span>
                  </a>
                ))}
                <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                <div
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (copying) return;
                    setOpenId(null);
                    setCopying(true);
                    try {
                      const res = await fetch(v.pngUrl);
                      const blob = await res.blob();
                      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    } catch { /* clipboard denied */ }
                    finally { setCopying(false); }
                  }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: COLOR.ink, cursor: 'pointer', background: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{copying ? 'Copied!' : 'Copy'}</span>
                  <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>to clipboard</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
            padding: '10px 12px',
            background: COLOR.white,
            borderTop: `1px solid ${COLOR.hairline}`,
            borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`,
            textAlign: 'left', boxSizing: 'border-box',
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>{v.mode} - {v.color}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const MODE_LABELS: Record<string, string> = {
  'Full Logo': 'Full Logo',
  'IO': 'IO mark',
  'App Symbol': 'App symbol',
};

export function LogoResources() {
  const [allBusy, setAllBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [color, setColor] = useState<'Purple' | 'Black' | 'White'>('Purple');

  useEffect(() => {
    if (!openId) return;
    const close = () => setOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openId]);

  const downloadAll = async () => {
    if (allBusy) return;
    setAllBusy(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      await Promise.all(
        VARIANTS.map(async (v) => {
          const filename = `melio-${v.mode.toLowerCase().replace(/\s+/g, '-')}-${v.color.toLowerCase()}.svg`;
          const res = await fetch(v.svgUrl || v.pngUrl);
          if (res.ok) zip.file(filename, await res.arrayBuffer());
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'melio-logos.zip');
    } finally {
      setAllBusy(false);
    }
  };

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Download logos"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Each mode comes in Purple, Black, and White - available as SVG and PNG.</Lead>
      </Hero>
      {DOWNLOADS_ENABLED && (
        <DownloadAllBanner
          count={VARIANTS.length}
          busy={allBusy}
          onDownload={downloadAll}
          label="Download all logos"
        />
      )}
      <div style={{ background: COLOR.panel, borderRadius: 15, padding: 20, margin: '0 0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {MAIN_MODES.map((m) => {
            const v = VARIANTS.find((vv) => vv.mode === m.mode && vv.color === color);
            if (!v) return null;
            const dlBase = `melio-${m.mode.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase()}`;
            return (
              <div key={m.mode}>
                <p style={{ fontFamily: FONT, fontSize: 12, color: COLOR.muted, margin: '0 0 8px', textAlign: 'center' }}>
                  {MODE_LABELS[m.mode] ?? m.mode}
                </p>
                <LogoCard v={v} dlBase={dlBase} openId={openId} setOpenId={setOpenId} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          {(['White', 'Purple', 'Black'] as const).map((c) => {
            const active = color === c;
            const fill = { White: COLOR.white, Purple: COLOR.purple, Black: COLOR.ink }[c];
            return (
              <button key={c} onClick={() => setColor(c)} title={c} aria-label={c}
                style={{ width: 20, height: 20, borderRadius: '50%', border: c === 'White' ? `1.5px solid ${COLOR.outline}` : 'none', cursor: 'pointer', background: fill, padding: 0, flexShrink: 0, outline: active ? `2px solid ${COLOR.purple}` : 'none', outlineOffset: 2, transition: 'outline 0.12s' }}
              />
            );
          })}
        </div>
      </div>

      <ResourceFooter
        title="Need a logo file?"
        body="Source files, usage rules, and co-brand lockups live in the BD Foundations Figma file. Contact the design team for custom lockups or partner logo applications."
        links={[
          { label: 'BD Foundations', href: 'https://www.figma.com/design/P7XSaH7fPQtWh83hKilsLQ/🟪-BD-Foundations', icon: <FigmaLogo /> },        ]}
      />
    </div>
  );
}
