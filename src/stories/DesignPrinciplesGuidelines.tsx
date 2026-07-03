import { FONT, COLOR, RADIUS, Med, Lead, Body, SectionTitle, Hero, DsIcon } from './brandKit';

/* Design principles - the few beliefs that explain why the brand and product look and behave the
   way they do. Kept short and testable so they actually get used in critiques and decisions. */

const PRINCIPLES: { n: string; title: string; belief: string; test: string }[] = [
  {
    n: '01',
    title: 'Clarity over cleverness',
    belief: 'The clearest version wins. We would rather be understood than admired.',
    test: 'Looks like: plain words, one obvious next step, nothing to decode.',
  },
  {
    n: '02',
    title: 'Calm by default',
    belief: 'Money is stressful. Our job is to lower the temperature, not raise it.',
    test: 'Looks like: generous space, steady color, reassuring copy on the hard moments.',
  },
  {
    n: '03',
    title: "On the owner's side",
    belief: 'We design for a busy small-business owner who has no time to spare.',
    test: 'Looks like: fewer steps, helpful defaults, and we never make anyone feel behind.',
  },
  {
    n: '04',
    title: 'Consistent, not rigid',
    belief: 'Reuse the system so things feel familiar - but keep the warmth and personality.',
    test: 'Looks like: same tokens and patterns everywhere, with room for a human touch.',
  },
  {
    n: '05',
    title: 'Sweat the small motions',
    belief: 'Craft lives in the details - a well-timed animation, a friendly Mel, a tidy edge.',
    test: 'Looks like: purposeful motion and finish that make the ordinary feel cared for.',
  },
];

function PrincipleCard({ n, title, belief, test }: { n: string; title: string; belief: string; test: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: `1px solid ${COLOR.hairline}` }}>
      <div style={{ flex: '0 0 auto', fontSize: 22, fontWeight: 600, color: COLOR.lilac400, fontVariantNumeric: 'tabular-nums', width: 40 }}>{n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <Body style={{ margin: '0 0 6px' }}>{belief}</Body>
        <div style={{ fontSize: 13, color: COLOR.muted }}>{test}</div>
      </div>
    </div>
  );
}

function PrinciplesHero() {
  return (
    <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, background: COLOR.purple, color: COLOR.white, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, padding: 24, boxSizing: 'border-box' }}>
      {['01', '02', '03', '04', '05'].map((n) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7, width: 22 }}>{n}</span>
          <span style={{ height: 8, borderRadius: 4, background: COLOR.white, opacity: 0.9, flex: 1, maxWidth: 120 - Number(n) * 12 }} />
        </div>
      ))}
    </div>
  );
}

export function DesignPrinciplesGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="What guides our decisions" visual={<PrinciplesHero />}>
        <Lead style={{ margin: 0 }}>
          These are the beliefs behind the rest of the guidelines - the <Med>why</Med> under the colors, type, and
          components. Five of them, short enough to remember and specific enough to settle a real design debate.
        </Lead>
      </Hero>

      <SectionTitle sub="Use them as a tie-breaker: if a choice fails one of these, it's probably the wrong choice.">
        The principles
      </SectionTitle>
      <div>
        {PRINCIPLES.map((p) => (
          <PrincipleCard key={p.n} {...p} />
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 10, background: COLOR.lilac100, border: `1px solid ${COLOR.lilac300}`, borderRadius: RADIUS.md, padding: '14px 16px' }}>
        <DsIcon name="info" size={16} style={{ color: COLOR.ink }} />
        <Body style={{ margin: 0 }}>
          Principles sit above the system: the rest of these pages are <Med>how</Med>, and these are <Med>why</Med>.
          When the two ever disagree, the principle wins and we fix the page.
        </Body>
      </div>
    </div>
  );
}
