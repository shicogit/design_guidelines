import { useState, useEffect, type CSSProperties } from 'react';
import { FONT, COLOR, RADIUS, Med, SectionTitle, Lead, Hero, DownloadIcon, DsIcon, DownloadAllBanner, FigmaLogo, ResourceFooter } from './brandKit';
import { triggerDownload } from './downloadUtils';

function GoogleFontsIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

const typeMods = import.meta.glob('../assets/guidelines/typography/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const typeGuideUrl = (name: string) => typeMods[`../assets/guidelines/typography/${name}`];

// Real PolySans (Standard cut) is loaded via @font-face in preview-head.html.
const POLY = "'PolySans', 'Poppins', sans-serif";
const POLY_W: Record<string, number> = { Slim: 300, Neutral: 400, Median: 500, Bulky: 700 };

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

function CutCard({ name, cut, family = POLY }: { name: string; cut: string; family?: string }) {
  return (
    <div style={{ background: COLOR.white, borderRadius: RADIUS.lg, padding: '18px 18px 16px', border: '1px solid #E4E7EC' }}>
      <div style={{ fontFamily: family, fontSize: 60, fontWeight: 400, color: COLOR.ink, lineHeight: 1 }}>Aa</div>
      <div style={{ fontFamily: family, fontSize: 14, fontWeight: 600, color: COLOR.ink, margin: '12px 0 2px' }}>{name}</div>
      <div style={{ fontSize: 13, color: COLOR.muted }}>{cut} cut</div>
    </div>
  );
}

const POLY_MONO = "'PolySans Mono', 'PolySans', monospace";
const POLY_WIDE = "'PolySans Wide', 'PolySans', sans-serif";

// A weights specimen grid for a given cut (renders the real font).
function CutSpecimen({ family, suffix }: { family: string; suffix: string }) {
  return (
    <div style={{ background: COLOR.panel, borderRadius: RADIUS.xl, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 24, rowGap: 0 }}>
      {([['Slim', 300, 'internal'], ['Neutral', 400, 'internal'], ['Median', 500, 'internal'], ['Bulky', 700, 'avoid']] as [string, number, Use][]).map(([w, wt, use], i) => (
        <div key={w} style={i >= 2 ? { borderTop: `1px solid ${COLOR.hairline}`, paddingTop: 20 } : {}}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: TAG[use].bg, color: TAG[use].color, marginBottom: 6 }}>{TAG[use].label}</span>
          <div style={{ fontSize: 12, color: COLOR.muted, marginBottom: 6 }}>PolySans {w}{suffix}</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ fontFamily: family, fontWeight: wt, fontSize: 19, color: COLOR.ink, lineHeight: 1.35 }}>AaBbCcDdEe<br />0123456789</div>
            <div style={{ fontFamily: family, fontWeight: wt, fontStyle: 'italic', fontSize: 19, color: COLOR.ink, lineHeight: 1.35 }}>AaBbCcDdEe<br />0123456789</div>
          </div>
        </div>
      ))}
    </div>
  );
}

type Use = 'use' | 'avoid' | 'internal';
const TAG: Record<Use, { label: string; bg: string; color: string }> = {
  use: { label: 'Use', bg: '#E7F6EC', color: '#1F9254' },
  avoid: { label: 'Avoid', bg: '#FDE8E8', color: '#D64545' },
  internal: { label: 'Internal only', bg: '#DBEAFE', color: '#1D4ED8' },
};

function Weight({ name, use }: { name: string; use?: Use }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', border: `1px solid ${COLOR.hairline}`, borderRadius: 10, background: COLOR.white }}>
      <span style={{ fontSize: 14, color: COLOR.ink }}>{name}</span>
      {use && (
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: TAG[use].bg, color: TAG[use].color, whiteSpace: 'nowrap' }}>
          {TAG[use].label}
        </span>
      )}
    </div>
  );
}

// Mirrors the Typography section-card thumbnail: upright "Aa" in ink + italic "Aa" in purple.
function TypeHero() {
  return (
    <div style={{ fontFamily: POLY, fontWeight: 500, fontSize: 88, lineHeight: 1, whiteSpace: 'nowrap', letterSpacing: -1 }}>
      <span style={{ fontFamily: POLY, color: COLOR.ink, fontSize: 'inherit', lineHeight: 'inherit' }}>Aa</span>
      <span style={{ fontFamily: POLY, color: COLOR.purple, fontStyle: 'italic', fontSize: 'inherit', lineHeight: 'inherit', marginLeft: 6 }}>Aa</span>
    </div>
  );
}

export function TypographyGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Two families, one voice" visual={<TypeHero />}>
        <Lead>
          Melio uses <Med>two type families</Med> - <Med>Poppins</Med> for product and <Med>PolySans</Med> for
          marketing. These guidelines cover the marketing typeface.
        </Lead>
        <Lead style={{ margin: 0 }}>
          PolySans, by the Norwegian foundry <Med>Gradient</Med>, is a fresh take on mid-century classics with a subtle
          soft-edge inktrap and expressive italics.
        </Lead>
      </Hero>

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                <CutCard name="PolySans Neutral" cut="Proportional" />
                <CutCard name="PolySans Mono" cut="Monospaced" family={POLY_MONO} />
                <CutCard name="PolySans Wide" cut="Wide" family={POLY_WIDE} />
              </div>
            </div>

            <p style={{ fontSize: 13, color: COLOR.faint, margin: 0, lineHeight: 1.6 }}>
              Specimens render in the real PolySans - Standard, Mono, and Wide cuts are all bundled.
            </p>
          </div>
        }
        title="The cuts"
        body="PolySans comes in three cuts. Use only Neutral & Median weights (+ italics); avoid Bulky."
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 20, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 24, rowGap: 0 }}>
              {([['Slim', 300, 'use'], ['Neutral', 400, 'use'], ['Median', 500, 'use'], ['Bulky', 700, 'avoid']] as [string, number, Use][]).map(([w, wt, use], i) => (
                <div key={w} style={i >= 2 ? { borderTop: `1px solid ${COLOR.hairline}`, paddingTop: 20 } : {}}>
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: TAG[use].bg, color: TAG[use].color, marginBottom: 6 }}>{TAG[use].label}</span>
                  <div style={{ fontSize: 12, color: COLOR.muted, marginBottom: 6 }}>PolySans {w}</div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ fontFamily: POLY, fontWeight: wt, fontSize: 19, color: COLOR.ink, lineHeight: 1.35 }}>AaBbCcDdEe<br />0123456789</div>
                    <div style={{ fontFamily: POLY, fontWeight: wt, fontStyle: 'italic', fontSize: 19, color: COLOR.ink, lineHeight: 1.35 }}>AaBbCcDdEe<br />0123456789</div>
                  </div>
                </div>
              ))}
            </div>
            {(['PolySans Regular.png'] as const).map((name) => {
              const u = typeGuideUrl(name);
              return u ? (
                <div key={name} style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                  <img src={u} alt={name.replace('.png', '')} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
                </div>
              ) : null;
            })}
          </div>
        }
        title="Standard"
        body={<>Our primary style - four weights with matching italics. Use only <Med>Neutral</Med> and <Med>Median</Med> (and their italics); <Med>avoid Bulky</Med>. Neutral lives on the Melio marketing site and is fine for any brand deliverable.</>}
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CutSpecimen family={POLY_WIDE} suffix=" Wide" />
            {(['PolySans Wide.png'] as const).map((name) => {
              const u = typeGuideUrl(name);
              return u ? (
                <div key={name} style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                  <img src={u} alt={name.replace('.png', '')} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
                </div>
              ) : null;
            })}
          </div>
        }
        title="Extended"
        body={<>The <Med>Wide</Med> cut - same weight rule (Neutral & Median), but <Med>internal use only</Med>. Never for marketing deliverables.</>}
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CutSpecimen family={POLY_MONO} suffix=" Mono" />
            {(['PolySans Mono.png'] as const).map((name) => {
              const u = typeGuideUrl(name);
              return u ? (
                <div key={name} style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                  <img src={u} alt={name.replace('.png', '')} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
                </div>
              ) : null;
            })}
          </div>
        }
        title="Mono"
        body={<><Med>Internal &amp; social-media use only</Med> - avoid for any other deliverable.</>}
      />

      <SectionTitle sub="The marketing type scale - the hierarchy, shown at a glance.">Usage - type scale</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {([
          ['H0', 'Slim', 40, '88', false],
          ['H1', 'Median', 34, '56', false],
          ['H2', 'Median', 30, '48', false],
          ['H3', 'Median', 26, '32', false],
          ['H4', 'Median', 23, '24', false],
          ['Body', 'Neutral', 17, '16', false],
          ['Caption', 'Slim', 13, '12', false],
          ['Quote', 'Slim', 26, '40', true],
        ] as [string, string, number, string, boolean][]).map(([label, w, dpx, px, ital], i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderTop: i ? `1px solid ${COLOR.hairline}` : 'none' }}>
            <div style={{ fontFamily: POLY, fontWeight: POLY_W[w] ?? 500, fontStyle: ital ? 'italic' : 'normal', fontSize: dpx, lineHeight: 1.1, color: ital ? COLOR.purple : COLOR.ink }}>{label}</div>
            <div style={{ fontSize: 12, color: COLOR.faint, whiteSpace: 'nowrap' }}>PolySans {w} · {px}px</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: COLOR.faint, margin: '10px 0 0', lineHeight: 1.6 }}>Each role also has italic variants + mobile styles.</p>

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gridTemplateRows: 'auto auto', gap: 10 }}>
                {([
                  { file: 'italic-do-1.png', label: 'One italic hierarchy' },
                  { file: 'italic-do-2.png', label: 'Purple italic only' },
                  { file: 'italic-do-3.png', label: 'Same size throughout' },
                  { file: 'italic-do-4.png', label: 'Italic ends the sentence' },
                ] as const).map(({ file, label }) => {
                  const u = typeGuideUrl(file);
                  return u ? (
                    <div key={file} style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', rowGap: 8 }}>
                      <img src={u} alt={label} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: 0 }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
                        <DsIcon name="checked" size={12} style={{ color: '#1F9254', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{label}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gridTemplateRows: 'auto auto', gap: 10 }}>
                {([
                  { file: 'italic-dont-1.png', label: 'All italic' },
                  { file: 'italic-dont-2.png', label: 'Black color' },
                  { file: 'italic-dont-3.png', label: 'Off-brand color' },
                  { file: 'italic-dont-4.png', label: 'Two sizes' },
                  { file: 'italic-dont-5.png', label: 'Wrong weight' },
                  { file: 'italic-dont-6.png', label: 'All caps' },
                ] as const).map(({ file, label }) => {
                  const u = typeGuideUrl(file);
                  return u ? (
                    <div key={file} style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', rowGap: 8 }}>
                      <img src={u} alt={label} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: 0 }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
                        <DsIcon name="close" size={12} style={{ color: '#D64545', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{label}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        }
        title="Italic"
        body={<>Use <Med>purple italic exclusively</Med> to underline a value proposition, or highlight money-movement parts of a sentence (e.g. "…<span style={{ fontFamily: POLY, fontStyle: 'italic', color: COLOR.purple, fontWeight: 500 }}>in business.</span>").</>}
      />
    </div>
  );
}

// ---------- Resources tab (font downloads) ----------

const POLYSANS_FILES: { label: string; file: string }[] = [
  { label: 'Slim', file: 'PolySans-Slim.woff2' },
  { label: 'Slim Italic', file: 'PolySans-SlimItalic.woff2' },
  { label: 'Neutral', file: 'PolySans-Neutral.woff2' },
  { label: 'Neutral Italic', file: 'PolySans-NeutralItalic.woff2' },
  { label: 'Median', file: 'PolySans-Median.woff2' },
  { label: 'Median Italic', file: 'PolySans-MedianItalic.woff2' },
  { label: 'Bulky', file: 'PolySans-Bulky.woff2' },
  { label: 'Bulky Italic', file: 'PolySans-BulkyItalic.woff2' },
];

const MONO_FILES: { label: string; file: string }[] = [
  { label: 'Slim', file: 'PolySans-SlimMono.otf' },
  { label: 'Slim Italic', file: 'PolySans-SlimMonoItalic.otf' },
  { label: 'Neutral', file: 'PolySans-NeutralMono.otf' },
  { label: 'Neutral Italic', file: 'PolySans-NeutralMonoItalic.otf' },
  { label: 'Median', file: 'PolySans-MedianMono.otf' },
  { label: 'Median Italic', file: 'PolySans-MedianMonoItalic.otf' },
  { label: 'Bulky', file: 'PolySans-BulkyMono.otf' },
  { label: 'Bulky Italic', file: 'PolySans-BulkyMonoItalic.otf' },
];

const WIDE_FILES: { label: string; file: string }[] = [
  { label: 'Slim', file: 'PolySans-SlimWide.otf' },
  { label: 'Slim Italic', file: 'PolySans-SlimWideItalic.otf' },
  { label: 'Neutral', file: 'PolySans-NeutralWide.otf' },
  { label: 'Neutral Italic', file: 'PolySans-NeutralWideItalic.otf' },
  { label: 'Median', file: 'PolySans-MedianWide.otf' },
  { label: 'Median Italic', file: 'PolySans-MedianWideItalic.otf' },
  { label: 'Bulky', file: 'PolySans-BulkyWide.otf' },
  { label: 'Bulky Italic', file: 'PolySans-BulkyWideItalic.otf' },
];

type ResourceFile = { label: string; ext: string; href: string; download?: string };

const BTN_STYLE: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  fontSize: 12, fontWeight: 600, color: COLOR.ink, lineHeight: 1,
  padding: '5px 10px', borderRadius: 999, border: `1px solid ${COLOR.outline}`,
  background: COLOR.white, cursor: 'pointer', textDecoration: 'none',
};

function FontResourceCard({ name, family, italic = true, files, style, openId, setOpenId }: {
  name: string; family: string; italic?: boolean; files: ResourceFile[]; style?: CSSProperties;
  openId: string | null; setOpenId: (id: string | null) => void;
}) {
  const open = openId === name;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(open) : v;
    setOpenId(next ? name : null);
  };
  const [zipBusy, setZipBusy] = useState(false);
  const isExternal = files[0]?.ext === 'external';

  const wt = (label: string) =>
    /Bulky/.test(label) ? 700 : /Median/.test(label) ? 500 : /Neutral/.test(label) ? 400 : 300;

  async function downloadZip() {
    if (zipBusy) return;
    setZipBusy(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      await Promise.all(
        files.map(async (f) => {
          const res = await fetch(f.href);
          if (res.ok) zip.file(f.download ?? f.label, await res.arrayBuffer());
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, `${name.toLowerCase().replace(/\s+/g, '-')}-fonts.zip`);
    } finally {
      setZipBusy(false);
      setOpen(false);
    }
  }

  return (
    <div
      style={{ borderRadius: RADIUS.lg, border: `1px solid ${COLOR.hairline}`, position: 'relative', cursor: 'pointer', transition: 'border-color 120ms', ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.outline; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLOR.hairline; }}
      onClick={(e) => { e.stopPropagation(); if (isExternal) window.open(files[0].href, '_blank', 'noreferrer'); else setOpen((o) => !o); }}
    >
      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.lilac100, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, overflow: 'hidden' }}>
        <span style={{ fontFamily: family, fontWeight: 500, fontStyle: italic ? 'italic' : 'normal', fontSize: 56, color: COLOR.purple, lineHeight: 1 }}>Aa</span>
      </div>
      {isExternal ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', background: COLOR.white, borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DsIcon name="link-open" size={11} style={{ color: COLOR.ink }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>{name}</span>
          </div>
          <a
            href={files[0].href} target="_blank" rel="noreferrer"
            style={BTN_STYLE as CSSProperties}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
          >
            <GoogleFontsIcon size={13} /> Get
          </a>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 12px', background: COLOR.white, border: 'none', borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
          >
            <DownloadIcon size={11} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>{name}</span>
              {files.length > 1 && (
                <span style={{ fontSize: 11, fontWeight: 500, color: '#8A8A99', background: '#F1F1F4', borderRadius: 999, padding: '2px 7px', lineHeight: 1.5 }}>{files.length}</span>
              )}
            </div>
          </button>
          {open && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: COLOR.white, border: `1px solid ${COLOR.hairline}`, borderRadius: RADIUS.md, boxShadow: '0 12px 32px rgba(20,20,40,0.18)', minWidth: 220, zIndex: 200, padding: 6 }}>
                  <div style={{ fontSize: 11, color: COLOR.faint, padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    Download {name}
                  </div>
                  {files.map(({ label, ext, href, download }) => (
                    <a
                      key={label} href={href} download={download}
                      onClick={() => setOpen(false)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, textDecoration: 'none', borderRadius: 8, background: 'transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontFamily: family, fontWeight: wt(label), fontStyle: /Italic/.test(label) ? 'italic' : 'normal', whiteSpace: 'nowrap' }}>
                        {label.replace(`${name} `, '')}
                      </span>
                      <span style={{ fontSize: 11, color: COLOR.faint, fontFamily: FONT, fontWeight: 400 }}>.{ext}</span>
                    </a>
                  ))}
                  <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await navigator.clipboard.writeText(`font-family: ${family};`).catch(() => {});
                      setOpen(false);
                    }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', fontSize: 14, fontFamily: FONT, fontWeight: 500, color: COLOR.ink, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, boxSizing: 'border-box' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>Copy CSS</span>
                    <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>font-family</span>
                  </button>
                  <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadZip(); }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', fontSize: 14, fontFamily: FONT, fontWeight: 500, color: COLOR.ink, background: 'transparent', border: 'none', cursor: zipBusy ? 'wait' : 'pointer', textAlign: 'left', borderRadius: 8, boxSizing: 'border-box' }}
                    onMouseEnter={(e) => { if (!zipBusy) e.currentTarget.style.background = COLOR.hover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{zipBusy ? 'Zipping...' : 'Download all'}</span>
                    <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>.zip</span>
                  </button>
                </div>
              )}
          </div>
        )}
    </div>
  );
}

export function TypographyResources() {
  const [allBusy, setAllBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const close = () => setOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openId]);

  const allFontFiles = [
    ...POLYSANS_FILES.map((f) => ({ href: `/fonts/polysans/${f.file}`, name: f.file })),
    ...MONO_FILES.map((f) => ({ href: `/fonts/polysans/mono/${f.file}`, name: f.file })),
    ...WIDE_FILES.map((f) => ({ href: `/fonts/polysans/wide/${f.file}`, name: f.file })),
  ];

  const downloadAll = async () => {
    if (allBusy) return;
    setAllBusy(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      await Promise.all(
        allFontFiles.map(async ({ href, name }) => {
          const res = await fetch(href);
          if (res.ok) zip.file(name, await res.arrayBuffer());
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'polysans-fonts.zip');
    } finally {
      setAllBusy(false);
    }
  };

  const FONT_CARDS = [
    {
      name: 'PolySans',
      family: POLY,
      files: POLYSANS_FILES.map((f) => ({ label: `PolySans ${f.label}`, ext: 'woff2', href: `/fonts/polysans/${f.file}`, download: f.file })),
    },
    {
      name: 'PolySans Mono',
      family: POLY_MONO,
      files: MONO_FILES.map((f) => ({ label: `PolySans ${f.label} Mono`, ext: 'otf', href: `/fonts/polysans/mono/${f.file}`, download: f.file })),
    },
    {
      name: 'PolySans Wide',
      family: POLY_WIDE,
      files: WIDE_FILES.map((f) => ({ label: `PolySans ${f.label} Wide`, ext: 'otf', href: `/fonts/polysans/wide/${f.file}`, download: f.file })),
    },
    {
      name: 'Poppins',
      family: FONT,
      italic: false,
      files: [{ label: 'Google Fonts', ext: 'external', href: 'https://fonts.google.com/specimen/Poppins', download: undefined }] as ResourceFile[],
    },
  ];

  const polyCards = FONT_CARDS.filter((c) => c.name !== 'Poppins');
  const poppinsCard = FONT_CARDS.find((c) => c.name === 'Poppins')!;

  const GroupHeader = ({ icon, title, context, desc, style }: { icon: string; title: string; context: string; desc: string; style?: CSSProperties }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', ...style }}>
      <DsIcon name={icon} size={14} style={{ color: COLOR.purple, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: COLOR.ink, fontFamily: FONT }}>{title}</span>
      <span style={{ fontSize: 11, color: COLOR.purple, background: COLOR.lilac100, borderRadius: 99, padding: '1px 7px', fontWeight: 500, fontFamily: FONT }}>{context}</span>
      <span style={{ fontSize: 12, color: COLOR.muted, fontFamily: FONT }}>{desc}</span>
    </div>
  );

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Download fonts"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>PolySans (licensed) and Poppins (free via Google Fonts) - ready to use in any project.</Lead>
      </Hero>
      <DownloadAllBanner
        count={allFontFiles.length}
        busy={allBusy}
        onDownload={downloadAll}
        label="Download all fonts"
      />

      <GroupHeader icon="promote" title="PolySans" context="Marketing" desc="Brand typeface - website, decks, social, ads, campaigns." style={{ marginBottom: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {polyCards.map(({ name, family, italic = true, files }) => (
          <FontResourceCard key={name} name={name} family={family} italic={italic} files={files} openId={openId} setOpenId={setOpenId} />
        ))}
      </div>

      <GroupHeader icon="monitor" title="Poppins" context="Product" desc="Product UI typeface - free on Google Fonts." style={{ margin: '24px 0 12px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <FontResourceCard name={poppinsCard.name} family={poppinsCard.family} italic={poppinsCard.italic ?? true} files={poppinsCard.files} openId={openId} setOpenId={setOpenId} />
      </div>

      <p style={{ fontSize: 13, color: COLOR.faint, margin: '14px 0 0', lineHeight: 1.6 }}>
        PolySans is a <Med>licensed typeface</Med> (by Gradient) - for Melio team / brand use only; don't redistribute it externally.
        Mono &amp; Wide are internal only.
      </p>

      <ResourceFooter
        title="Need font files or type guidance?"
        body="Typography styles and PolySans font settings live in the BD Foundations Figma file. For licensing questions or new type applications, reach out to the design team."
        links={[
          { label: 'BD Foundations', href: 'https://www.figma.com/design/P7XSaH7fPQtWh83hKilsLQ/🟪-BD-Foundations', icon: <FigmaLogo /> },
        ]}
        contacts={[
          { name: 'Shira Giladi', role: 'Interaction Design', slack: 'https://xero.enterprise.slack.com/team/U037ZDWL2MA', image: '/contacts/shira.png' },
          { name: 'Isaac Sheptovitsky', role: 'Design System', slack: 'https://xero.enterprise.slack.com/team/U07UQDS31FV', image: '/contacts/isaac.png' },
        ]}
      />
    </div>
  );
}
