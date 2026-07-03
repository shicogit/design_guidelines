import { FONT, COLOR, RADIUS, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon } from './brandKit';

/* Data visualization - how Melio shows numbers. A small, distinguishable categorical palette,
   accessible by default (never color alone), and charts that make one point clearly. */

// Categorical sequence: use in order, up to ~6 series. Ordered so neighbors stay distinct.
const CATEGORICAL: { name: string; hex: string }[] = [
  { name: 'Purple', hex: '#7849FF' },
  { name: 'Green', hex: '#00B874' },
  { name: 'Orange', hex: '#FF6703' },
  { name: 'Pink', hex: '#FF89FD' },
  { name: 'Yellow', hex: '#FFDE28' },
  { name: 'Ink', hex: '#242936' },
];

const BARS = [
  { label: 'Jan', value: 62 },
  { label: 'Feb', value: 48 },
  { label: 'Mar', value: 80 },
  { label: 'Apr', value: 35 },
  { label: 'May', value: 70 },
];

function DataVizHero() {
  return (
    <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, background: COLOR.lilac100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, padding: 28, boxSizing: 'border-box' }}>
      {[40, 70, 52, 92, 64].map((h, i) => (
        <div key={i} style={{ width: 22, height: `${h}%`, background: CATEGORICAL[i].hex, borderRadius: '6px 6px 0 0' }} />
      ))}
    </div>
  );
}

export function DataVizGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Numbers, made clear" visual={<DataVizHero />}>
        <Lead style={{ margin: 0 }}>
          Charts should make <Med>one point</Med> quickly. Use a small, distinguishable palette, label things directly,
          and never lean on color as the only way to tell series apart.
        </Lead>
      </Hero>

      <SectionTitle sub="Use these in order, up to about six series. Beyond six, group the smallest into “Other”.">
        Categorical palette
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
        {CATEGORICAL.map((c, i) => (
          <div key={c.hex} style={{ border: `1px solid ${COLOR.cardBorder}`, borderRadius: RADIUS.md, overflow: 'hidden' }}>
            <div style={{ height: 56, background: c.hex }} />
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}. {c.name}</div>
              <div style={{ fontSize: 12, color: COLOR.muted, fontVariantNumeric: 'tabular-nums' }}>{c.hex}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle sub="A simple bar chart, labelled directly and starting at zero.">Example</SectionTitle>
      <div style={{ border: `1px solid ${COLOR.cardBorder}`, borderRadius: RADIUS.lg, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180 }}>
          {BARS.map((b, i) => (
            <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <span style={{ fontSize: 12, color: COLOR.body, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>{b.value}</span>
              <div style={{ width: '100%', maxWidth: 56, height: `${b.value}%`, background: CATEGORICAL[i].hex, borderRadius: '6px 6px 0 0' }} />
              <span style={{ fontSize: 12, color: COLOR.muted, marginTop: 8 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle sub="Habits that keep charts honest and easy to read.">Principles</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <InfoCard icon={<DsIcon name="info" size={16} style={{ color: COLOR.ink }} />} label="One big idea" text="Each chart makes a single, clear point. If it needs a paragraph to explain, simplify it." />
        <InfoCard icon={<DsIcon name="Document" size={16} style={{ color: COLOR.ink }} />} label="Label directly" text="Put labels and values on or beside the data. Make people hunt through a legend only when you must." />
        <InfoCard icon={<DsIcon name="close" size={16} style={{ color: COLOR.ink }} />} label="Not color alone" text="Distinguish series with labels, order, or patterns too - so colorblind readers aren't lost." />
        <InfoCard icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />} label="Start at zero" text="Bar charts start the axis at zero. Don't truncate it and exaggerate a difference." />
        <InfoCard icon={<DsIcon name="light-sun" size={16} style={{ color: COLOR.ink }} />} label="Keep contrast" text="Aim for 3:1 between adjacent colors and against the background so shapes stay legible." />
        <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="Six at most" text="Cap categorical series around six. More colors than that stop being distinguishable." />
      </div>
    </div>
  );
}
