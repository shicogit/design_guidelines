import { type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon } from './brandKit';

/* Accessibility - the baseline every Melio surface should meet. Pulls together the threads that
   live on other pages (contrast, motion) and adds the rest: color independence, alt text,
   focus, and target size. */

function PageLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a href={`/?path=/docs/${id}`} target="_top" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLOR.purple, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
      {children}
      <DsIcon name="arrow right" size={14} style={{ color: COLOR.purple }} />
    </a>
  );
}

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

function A11yHero() {
  return (
    <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, background: COLOR.lilac100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 132, height: 132, borderRadius: 999, background: COLOR.purple, color: COLOR.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 64, fontWeight: 600, lineHeight: 1 }}>Aa</span>
      </div>
    </div>
  );
}

export function AccessibilityGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Usable by everyone" visual={<A11yHero />}>
        <Lead style={{ margin: 0 }}>
          Accessible work is just good work. Aim for <Med>WCAG AA</Med> as the baseline on everything we ship, so
          Melio is clear and usable whatever someone's sight, motion sensitivity, or input method.
        </Lead>
      </Hero>

      <SectionTitle sub="The areas to get right. The first two have their own detailed pages.">What to check</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <InfoCard icon={<DsIcon name="light-sun" size={16} style={{ color: COLOR.ink }} />} label="Contrast" text="At least 4.5:1 for body text, 3:1 for large text and meaningful graphics. Live pairings live on the Color page." />
        <InfoCard icon={<DsIcon name="play-circle-outline" size={16} style={{ color: COLOR.ink }} />} label="Motion" text="Honor reduced-motion and start heavy animation on view. Full guidance on the Motion page." />
        <InfoCard icon={<DsIcon name="info" size={16} style={{ color: COLOR.ink }} />} label="Not color alone" text="Never use color as the only signal. Pair it with text, an icon, or a pattern." />
        <InfoCard icon={<DsIcon name="image-add" size={16} style={{ color: COLOR.ink }} />} label="Alt text" text="Give meaningful images a short text alternative. Mark purely decorative ones as decorative." />
        <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="Focus & keyboard" text="Everything works by keyboard, in a logical order, with a visible focus ring." />
        <InfoCard icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />} label="Target size" text="Make tap targets at least 44x44px so they're easy to hit on touch." />
      </div>

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '14px 2px 0' }}>
        <PageLink id="identity-color--docs">Color contrast pairings</PageLink>
        <PageLink id="identity-motion--docs">Reduced-motion guidance</PageLink>
      </div>

      <SectionTitle sub="A quick pass before anything ships.">The checklist</SectionTitle>
      <div style={{ background: COLOR.lilac100, border: `1px solid ${COLOR.lilac300}`, borderRadius: RADIUS.lg, padding: 18 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <Check>Text meets 4.5:1 (3:1 for large text and key graphics).</Check>
          <Check>No information is carried by color alone.</Check>
          <Check>Meaningful images have alt text; decorative ones are hidden from screen readers.</Check>
          <Check>Every action is reachable and operable by keyboard, with a visible focus state.</Check>
          <Check>Tap targets are at least 44x44px with a little space around them.</Check>
          <Check>Motion respects the reduce-motion setting and never blocks reading.</Check>
        </ul>
      </div>
    </div>
  );
}
