import { useState } from 'react';
import { adaTextColor, contrastRatio } from './ColorChip';
import { FONT, COLOR, RADIUS, Med, SectionTitle, Panel, Lead, Body, InfoCard, Hero, DsIcon, FigmaLogo, ResourceFooter } from './brandKit';

const colorGuideMods = import.meta.glob('../assets/guidelines/colors/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const colorGuideUrl = (name: string) => colorGuideMods[`../assets/guidelines/colors/${name}`];

type Sw = { name: string; hex: string; cmyk?: string; rgb: string; pantone?: string };

const PRIMARY: Sw[] = [
  { name: 'Primary / Light Black', hex: '#242936', cmyk: '75 63 40 55', rgb: '36 41 54', pantone: 'Pantone 4140 C' },
  { name: 'Primary / Black', hex: '#3F3F42', cmyk: '100 61 32 96', rgb: '63 63 66', pantone: 'Pantone Black 6 C' },
  { name: 'Primary / Purple', hex: '#7849FF', cmyk: '95 100 0 0', rgb: '109 64 255', pantone: 'Pantone 2098 C' },
  { name: 'Primary / Lilac', hex: '#9874FF', cmyk: '62 64 0 0', rgb: '152 116 255', pantone: 'Pantone 2635 C' },
  { name: 'Primary / Violet', hex: '#BDBDFF', cmyk: '30 27 0 0', rgb: '189 189 255', pantone: 'Pantone 2655 C' },
  { name: 'Primary / Light Purple', hex: '#EAEDFE', cmyk: '14 7 0 0', rgb: '234 237 254', pantone: 'Pantone 2706 C' },
];

const NEUTRALS: Sw[] = [
  { name: 'Naturals / Grey 700', hex: '#717173', rgb: '113 113 115' },
  { name: 'Naturals / Grey 600', hex: '#8E8E90', rgb: '142 142 144' },
  { name: 'Naturals / Grey 500', hex: '#C2C2C3', rgb: '194 194 195' },
  { name: 'Naturals / Grey 400', hex: '#D8D8D8', rgb: '216 216 216' },
  { name: 'Naturals / Grey 300', hex: '#EDEDED', rgb: '237 237 237' },
  { name: 'Naturals / Grey 250', hex: '#F1F1F1', rgb: '241 241 241' },
  { name: 'Naturals / Grey 200', hex: '#FAFAFA', rgb: '250 250 250' },
  { name: 'Naturals / White', hex: '#FFFFFF', rgb: '255 255 255' },
];

const SECONDARY: Sw[] = [
  { name: 'Secondary / Green', hex: '#00B874', cmyk: '82 0 71 0', rgb: '0 178 123', pantone: 'Pantone 2416 C' },
  { name: 'Secondary / Orange', hex: '#FF6703', cmyk: '0 77 100 0', rgb: '255 103 3', pantone: 'Pantone 1655 C' },
  { name: 'Secondary / Dark Yellow', hex: '#DEBF17', cmyk: '0 16 100 21', rgb: '222 191 23', pantone: 'Pantone 4020 C' },
  { name: 'Secondary / Pink', hex: '#FF89FD', cmyk: '7 53 0 0', rgb: '255 137 253', pantone: 'Pantone Black 6 C' },
  { name: 'Secondary / Yellow', hex: '#FFDE28', cmyk: '0 4 88 0', rgb: '255 222 40', pantone: 'Pantone 115 C' },
];

function Swatch({ s }: { s: Sw }) {
  const fg = adaTextColor(s.hex);
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const copy = () => {
    const hex = s.hex.toUpperCase();
    try {
      navigator.clipboard?.writeText(hex);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div
      onClick={copy}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Click to copy hex"
      style={{
        position: 'relative',
        background: s.hex,
        borderRadius: 14,
        padding: '16px 18px',
        minHeight: 124,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: fg,
        border: '1px solid rgba(0,0,0,0.06)',
        fontFamily: FONT,
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      {copied && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: s.hex,
            borderRadius: 14,
            color: fg,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Copied {s.hex.toUpperCase()}
        </div>
      )}
      {/* Hover hint - tells you a click copies the hex */}
      {hover && !copied && (
        <span
          style={{
            position: 'absolute',
            top: 16,
            right: 18,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            fontWeight: 500,
            color: fg,
            opacity: 0.85,
          }}
        >
          <DsIcon name="copy" size={13} style={{ color: fg }} />
          Copy
        </span>
      )}
      <span style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</span>
      <span style={{ fontSize: 15, fontWeight: 500 }}>{s.hex.toUpperCase()}</span>
    </div>
  );
}

function Palette({ items }: { items: Sw[] }) {
  return (
    <Panel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {items.map((s) => (
          <Swatch key={s.name} s={s} />
        ))}
      </div>
    </Panel>
  );
}

/** A text-on-background sample with its live WCAG contrast ratio + AA badge. */
function Pairing({ bg, fg, sample }: { bg: string; fg: string; sample: string }) {
  const ratio = Math.round(contrastRatio(bg, fg) * 10) / 10;
  const level =
    ratio >= 4.5
      ? { t: 'AA', c: '#1F9254', b: '#E7F6EC' }
      : ratio >= 3
        ? { t: 'AA Large only', c: '#9A6700', b: '#FFF4D6' }
        : { t: 'Fails', c: '#D64545', b: '#FDE8E8' };
  return (
    <div style={{ borderRadius: RADIUS.lg, overflow: 'hidden', border: `1px solid ${COLOR.cardBorder}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: bg, color: fg, padding: '20px 18px', flex: 1, minHeight: 92, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 600 }}>Aa</span>
        <span style={{ fontSize: 13 }}>{sample}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: level.b, borderTop: `1px solid ${COLOR.cardBorder}` }}>
        <span style={{ fontSize: 12, color: COLOR.muted, fontVariantNumeric: 'tabular-nums' }}>{ratio.toFixed(1)}:1</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: level.c, background: level.b, borderRadius: 999, padding: '2px 8px' }}>{level.t}</span>
      </div>
    </div>
  );
}

function ColorHero() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', width: 236, height: 236 }}>
      <div
        style={{
          flex: '1 1 60%',
          background: COLOR.purple,
          borderRadius: RADIUS.lg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 16,
          color: '#FFFFFF',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>Purple</div>
        <div style={{ fontSize: 13 }}>#7849FF</div>
      </div>
      <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ flex: 1, background: COLOR.lilac300, borderRadius: RADIUS.lg }} />
        <div style={{ flex: 1, background: COLOR.lilac200, borderRadius: RADIUS.lg }} />
        <div style={{ flex: 1, background: COLOR.lilac100, borderRadius: RADIUS.lg, border: `1px solid ${COLOR.hairline}` }} />
      </div>
    </div>
  );
}

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

export function ColorGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Primarily purple" visual={<ColorHero />}>
        <Lead>
          Melio is <Med>primarily purple</Med> - a wide range of purples for tonal versatility and contrast within a
          minimal set of hues, supported by neutrals and an illustration-only secondary palette.
        </Lead>
        <Lead style={{ margin: 0 }}>Mind the <Med>Don't</Med> examples to keep contrast accessible and color on-brand.</Lead>
      </Hero>


      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PRIMARY.map((s) => <CompactSwatch key={s.name} s={s} />)}
            </div>
          </div>
        }
        title="Primary"
        body="A range of purples - from Brand-700 as the core accent to soft lilac tints for surfaces. Click any swatch to copy its hex."
      />


      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {NEUTRALS.map((s) => <CompactSwatch key={s.name} s={s} />)}
            </div>
          </div>
        }
        title="Neutrals"
        body="Mainly for backgrounds and surfaces. Grey scale from near-white 200 to muted 700."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SECONDARY.map((s) => <CompactSwatch key={s.name} s={s} />)}
            </div>
          </div>
        }
        title="Secondary palette"
        body="Illustration only. Never use for UI, type, or backgrounds."
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#1F9254', margin: '0 0 8px' }}>Safe pairings</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <Pairing bg="#FFFFFF" fg="#1A1A1A" sample="Ink on white" />
                <Pairing bg="#7849FF" fg="#FFFFFF" sample="White on purple" />
                <Pairing bg="#F6F8FE" fg="#1A1A1A" sample="Ink on lilac" />
                <Pairing bg="#3F3F42" fg="#FFFFFF" sample="White on black" />
              </div>
            </div>
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#D64545', margin: '0 0 8px' }}>Avoid</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <Pairing bg="#BDBDFF" fg="#FFFFFF" sample="White on lilac" />
                <Pairing bg="#FFFFFF" fg="#BDBDFF" sample="Lilac on white" />
                <Pairing bg="#FFDE28" fg="#FFFFFF" sample="White on yellow" />
                <Pairing bg="#7849FF" fg="#9874FF" sample="Lilac on purple" />
              </div>
            </div>
          </div>
        }
        title="Accessibility"
        body="Aim for WCAG AA: at least 4.5:1 for body text, 3:1 for large text. Contrast ratios update live."
      />
    </div>
  );
}

function FigmaIcon() {
  return (
    <svg width="13" height="19" viewBox="0 0 38 57" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: 0.4 }}>
      <path d="M3 13L13 3M13 3H7M13 3V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompactSwatch({ s }: { s: Sw }) {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const fg = adaTextColor(s.hex);
  const shortName = s.name.includes('/') ? s.name.split('/').pop()!.trim() : s.name;

  const copy = () => {
    try { navigator.clipboard?.writeText(s.hex.toUpperCase()); } catch { /* unavailable */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      onClick={copy}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Click to copy hex"
      style={{ cursor: 'pointer', borderRadius: RADIUS.md, overflow: 'hidden', border: `1px solid ${hover && !copied ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.07)'}`, transition: 'border-color 120ms' }}
    >
      <div style={{ height: 52, background: s.hex, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {copied && <span style={{ fontSize: 11, fontWeight: 700, color: fg, position: 'relative', zIndex: 1 }}>Copied!</span>}
        {hover && !copied && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <DsIcon name="copy" size={13} style={{ color: fg }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: fg, letterSpacing: 0.3 }}>Copy hex</span>
          </div>
        )}
      </div>
      <div style={{ padding: '7px 9px', background: COLOR.white, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortName}</div>
        <div style={{ fontSize: 11, color: COLOR.muted, marginTop: 1, letterSpacing: 0.2 }}>{s.hex.toUpperCase()}</div>
      </div>
    </div>
  );
}

export function ColorResources() {
  const FIGMA_LINKS = [
    {
      label: 'BD Foundations',
      sub: 'Brand colors, tokens & styles',
      href: 'https://www.figma.com/design/P7XSaH7fPQtWh83hKilsLQ/%F0%9F%9F%AA-BD-Foundations?node-id=1-2',
      bg: COLOR.lilac100,
      border: COLOR.lilac300,
      fg: COLOR.purple,
    },
    {
      label: 'DS Foundations',
      sub: 'Design system primitives & components',
      href: 'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/%F0%9F%A4%8D-DS-Foundations-%F0%9F%A4%8D?node-id=2933-4057',
      bg: COLOR.white,
      border: COLOR.hairline,
      fg: COLOR.ink,
    },
  ];

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Color resources"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Color tokens, palettes, and Figma variables - click any swatch to copy its hex value.</Lead>
      </Hero>
      {/* Compact color reference */}
      <SectionTitle sub="Click any swatch to copy its hex value.">All colors</SectionTitle>
      {[
        { label: 'Primary', items: PRIMARY },
        { label: 'Neutrals', items: NEUTRALS },
        { label: 'Secondary (illustration only)', items: SECONDARY },
      ].map(({ label, items }) => (
        <div key={label} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.muted, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {items.map((s) => <CompactSwatch key={s.name} s={s} />)}
          </div>
        </div>
      ))}

      <ResourceFooter
        title="Need color guidance?"
        body="Color tokens, styles, and Pantone references live in the BD Foundations Figma file. For accessibility checks or new palette approvals, contact the design team."
        links={[
          { label: 'BD Foundations', href: 'https://www.figma.com/design/P7XSaH7fPQtWh83hKilsLQ/🟪-BD-Foundations', icon: <FigmaLogo /> },
          { label: 'DS Foundations', href: 'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/🤍-DS-Foundations-🤍', icon: <FigmaLogo /> },
          { label: 'Accessibility checker', disabled: true },
        ]}
        contacts={[
          { name: 'Shira Giladi', role: 'Interaction Design', slack: 'https://xero.enterprise.slack.com/team/U037ZDWL2MA', image: '/contacts/shira.png' },
          { name: 'Isaac Sheptovitsky', role: 'Design System', slack: 'https://xero.enterprise.slack.com/team/U07UQDS31FV', image: '/contacts/isaac.png' },
        ]}
      />
    </div>
  );
}
