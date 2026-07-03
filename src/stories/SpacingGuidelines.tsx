import { FONT, COLOR, RADIUS, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon } from './brandKit';

/* Spacing & Layout - the invisible grid. Melio spaces things on an 8-point system so every
   screen feels consistent and calm, with room to breathe. */

const SCALE: { px: number; name: string; use: string }[] = [
  { px: 4, name: 'xs', use: 'Tight gaps inside a component (icon to label).' },
  { px: 8, name: 'sm', use: 'Default small gap - chips, list rows.' },
  { px: 16, name: 'md', use: 'Standard padding inside cards and tiles.' },
  { px: 24, name: 'lg', use: 'Gaps between cards; comfortable section padding.' },
  { px: 32, name: 'xl', use: 'Space above a new section.' },
  { px: 48, name: '2xl', use: 'Major breaks between large blocks.' },
  { px: 64, name: '3xl', use: 'Page-level separation and hero spacing.' },
];

const RADII: { px: number; label: string }[] = [
  { px: RADIUS.sm, label: 'sm (8)' },
  { px: RADIUS.md, label: 'md (12)' },
  { px: RADIUS.lg, label: 'lg (14)' },
  { px: RADIUS.xl, label: 'xl (16)' },
];

function ScaleRow({ px, name, use }: { px: number; name: string; use: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '64px 64px 1fr', gap: 14, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${COLOR.hairline}` }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
      <span style={{ fontSize: 13, color: COLOR.muted, fontVariantNumeric: 'tabular-nums' }}>{px}px</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'block', height: 16, width: px, background: COLOR.lilac400, borderRadius: 3, flex: '0 0 auto' }} />
        <span style={{ fontSize: 13, color: COLOR.body }}>{use}</span>
      </div>
    </div>
  );
}

function SpacingHero() {
  return (
    <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, background: COLOR.lilac100, padding: 18, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
      {[64, 48, 32, 24, 16, 8].map((w) => (
        <div key={w} style={{ height: 14, width: w + 120, maxWidth: '100%', background: COLOR.lilac400, borderRadius: 3, opacity: 0.35 + w / 120 }} />
      ))}
    </div>
  );
}

export function SpacingGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Built on an 8-point grid" visual={<SpacingHero />}>
        <Lead style={{ margin: 0 }}>
          Space is what makes a layout feel calm and considered. Melio sizes gaps and padding in multiples of{' '}
          <Med>8</Med> (with 4 for the smallest details), so spacing stays consistent everywhere and nothing feels
          cramped or arbitrary.
        </Lead>
      </Hero>

      <SectionTitle sub="Use these steps for padding, gaps, and margins. When in doubt, round to the nearest 8.">
        The spacing scale
      </SectionTitle>
      <div>
        {SCALE.map((s) => (
          <ScaleRow key={s.px} {...s} />
        ))}
      </div>

      <SectionTitle sub="Corners are rounded on the same small, consistent set of radii.">Corner radius</SectionTitle>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {RADII.map((r) => (
          <div key={r.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 72, height: 72, background: COLOR.lilac200, border: `1px solid ${COLOR.lilac300}`, borderRadius: r.px }} />
            <span style={{ fontSize: 12, color: COLOR.muted }}>{r.label}</span>
          </div>
        ))}
      </div>

      <SectionTitle sub="A few habits that keep layouts tidy.">Layout</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <InfoCard icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />} label="Give it room" text="Generous whitespace is on-brand. When unsure, add space rather than remove it." />
        <InfoCard icon={<DsIcon name="Document" size={16} style={{ color: COLOR.ink }} />} label="Keep a max width" text="Cap long text columns so lines stay readable - around 60-75 characters." />
        <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="Align to the grid" text="Line edges up. Consistent alignment does more for polish than any single element." />
        <InfoCard icon={<DsIcon name="close" size={16} style={{ color: COLOR.ink }} />} label="No arbitrary values" text="Avoid one-off numbers like 13px or 27px. Pull from the scale so spacing stays consistent." />
      </div>
    </div>
  );
}
