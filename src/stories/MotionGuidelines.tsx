import { type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Med, Lead, Body, SectionTitle, InfoCard, Hero, DsIcon, FigmaLogo, ResourceFooter } from './brandKit';

/* Motion - how Melio expresses the brand in movement. Ported from the Melio motion guidelines:
   logo IDs, type in motion, message cards, and supers. */

const POLY = "'PolySans', 'Poppins', sans-serif";

const DEMO_CSS = `
@keyframes melioGlide { 0% { transform: translateX(0);} 45% { transform: translateX(var(--travel)); } 55% { transform: translateX(var(--travel)); } 100% { transform: translateX(0);} }
.melio-mtrack { position: relative; height: 24px; --travel: calc(100% - 24px); }
.melio-mdot { width: 24px; height: 24px; border-radius: 7px; }
.melio-mtrack.a .melio-mdot { background: #FFFFFF; animation: melioGlide 1.8s cubic-bezier(0.2,0,0.2,1) infinite; }
.melio-mtrack.b .melio-mdot { background: ${COLOR.lilac400}; animation: melioGlide 2.8s cubic-bezier(0.4,0.14,0.3,1) infinite; }
`;

// A "don't" example for type in motion: visual on top, red label strip below.
function DontType({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div style={{ borderRadius: RADIUS.lg, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: COLOR.lilac100, flex: 1, minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, textAlign: 'center' }}>
        {children}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#FEF4F4', borderTop: '1px solid rgba(214,69,69,0.15)' }}>
        <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 999, background: '#FDE8E8', color: '#D64545', flexShrink: 0 }}>
          <DsIcon name="close" size={12} />
        </span>
        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4 }}>{caption}</span>
      </div>
    </div>
  );
}

// Text-only do/don't rule card (used when there is no visual to show).
function SuperRule({ ok, label, text }: { ok: boolean; label: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: RADIUS.md, background: ok ? '#F2FAF5' : '#FEF4F4', border: `1px solid ${ok ? '#D4EDDA' : '#FAD4D4'}` }}>
      <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 999, background: ok ? '#E7F6EC' : '#FDE8E8', color: ok ? '#1F9254' : '#D64545', flexShrink: 0, marginTop: 1 }}>
        <DsIcon name={ok ? 'checked' : 'close'} size={12} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: '#4B4B57', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 13, color: COLOR.muted, marginTop: 2, lineHeight: 1.5 }}>{text}</div>
      </div>
    </div>
  );
}

// The standard phrase used across the type "don't" examples.
function Phrase({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: POLY, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: COLOR.ink, ...style }}>
      Keeping small business
      <br />
      <span style={{ color: COLOR.purple, fontStyle: 'italic', ...(style?.color ? { color: style.color } : {}) }}>in business.</span>
    </div>
  );
}

// A logo "ID" - one animated expression of the logo, shown here as its end frame on its background.
function LogoId({ bg, logo, tagline, desc }: { bg: string; logo: string; tagline: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ background: bg, borderRadius: RADIUS.lg, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={logo} alt="" style={{ height: 34, objectFit: 'contain' }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{tagline}</div>
      <Body style={{ margin: 0, fontSize: 13 }}>{desc}</Body>
    </div>
  );
}

const SCALE: { pt: string; phrase: string; px: number; italic?: boolean }[] = [
  { pt: '250pt', phrase: 'Going Big', px: 44 },
  { pt: '150pt', phrase: 'Be a champion', px: 34, italic: true },
  { pt: '120pt', phrase: 'Any business', px: 28 },
  { pt: '80pt', phrase: 'Pay with a card', px: 23 },
  { pt: '65pt', phrase: 'Get paid online', px: 19 },
  { pt: '50pt', phrase: 'Your business', px: 16 },
];

const PRESETS: { label: string; bg: string; node: ReactNode }[] = [
  { label: 'one word', bg: COLOR.lilac100, node: <span style={{ fontStyle: 'italic', color: COLOR.purple }}>Faster.</span> },
  { label: 'two words', bg: COLOR.purple, node: <span style={{ color: '#fff' }}>Cash <span style={{ fontStyle: 'italic' }}>Flow.</span></span> },
  { label: 'sentence', bg: COLOR.lilac200, node: <span>Be your clients' <span style={{ fontStyle: 'italic', color: COLOR.purple }}>champion.</span></span> },
  { label: 'numbers', bg: COLOR.ink, node: <span style={{ color: '#fff' }}>20B</span> },
  { label: 'split sentence', bg: COLOR.lilac100, node: <span style={{ color: COLOR.purple }}>Get paid on time,</span> },
  { label: 'pattern', bg: COLOR.lilac100, node: <span style={{ color: COLOR.lilac400, fontStyle: 'italic' }}>CashFlow</span> },
];

// A small labelled card (transitions, intros, outros).
function MiniCard({ bg, label, border, children }: { bg: string; label: string; border?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ background: bg, border: border ? `1px solid ${COLOR.hairline}` : 'none', borderRadius: RADIUS.lg, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, textAlign: 'center' }}>
        {children}
      </div>
      <span style={{ fontSize: 12, color: COLOR.muted }}>{label}</span>
    </div>
  );
}

// A "don't" tied to footage we can't show - placeholder on top, red label strip below.
function FootageDont({ caption }: { caption: string }) {
  return (
    <div style={{ borderRadius: RADIUS.lg, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: COLOR.panel, flex: 1, minHeight: 120 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#FEF4F4', borderTop: '1px solid rgba(214,69,69,0.15)' }}>
        <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 999, background: '#FDE8E8', color: '#D64545', flexShrink: 0 }}>
          <DsIcon name="close" size={12} />
        </span>
        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4 }}>{caption}</span>
      </div>
    </div>
  );
}

// A format frame showing the safe area (dashed) + a subtitle bar.
function SafetyFrame({ ratio, label }: { ratio: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 240, aspectRatio: ratio, background: COLOR.lilac200, borderRadius: RADIUS.md, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '11%', border: `1.5px dashed ${COLOR.purple}`, borderRadius: 6 }} />
        <div style={{ position: 'absolute', left: '20%', right: '20%', bottom: '7%', height: 7, background: COLOR.white, opacity: 0.85, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, color: COLOR.muted }}>{label}</span>
    </div>
  );
}

// A frame-division diagram (lower third, half, quarter).
function Division({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ aspectRatio: '16 / 9', background: COLOR.panel, borderRadius: RADIUS.md, position: 'relative', overflow: 'hidden' }}>{children}</div>
      <span style={{ fontSize: 12, color: COLOR.muted }}>{label}</span>
    </div>
  );
}

const CURVES: { label: string; bg: string; stroke: string; d: string }[] = [
  { label: 'smooth', bg: COLOR.lilac100, stroke: COLOR.purple, d: 'M12 78 C 70 78, 78 16, 108 16 S 168 70, 196 72' },
  { label: 'fast', bg: COLOR.purple, stroke: '#FFFFFF', d: 'M12 80 C 24 80, 30 14, 52 14 C 110 16, 150 72, 196 74' },
  { label: 'jumping', bg: COLOR.ink, stroke: '#FFFFFF', d: 'M12 80 Q 46 8 80 80 Q 116 34 150 80 L 196 58' },
];

function Curve({ label, bg, stroke, d }: { label: string; bg: string; stroke: string; d: string }) {
  const onDark = bg !== COLOR.lilac100;
  return (
    <div style={{ background: bg, borderRadius: RADIUS.lg, padding: 16, position: 'relative', minHeight: 150 }}>
      <span style={{ position: 'absolute', top: 14, left: 16, fontSize: 12, fontWeight: 600, color: onDark ? '#fff' : COLOR.ink, background: onDark ? 'rgba(255,255,255,0.18)' : COLOR.lilac300, borderRadius: 999, padding: '3px 10px' }}>{label}</span>
      <svg viewBox="0 0 208 96" width="100%" height="96" style={{ marginTop: 36, display: 'block' }} preserveAspectRatio="none">
        <path d={d} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function MotionGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <style>{DEMO_CSS}</style>

      <Hero
        title="Motion expresses the brand"
        visual={
          <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, background: COLOR.purple, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, padding: 24, boxSizing: 'border-box' }}>
            <div className="melio-mtrack a"><div className="melio-mdot" /></div>
            <div className="melio-mtrack b"><div className="melio-mdot" /></div>
          </div>
        }
      >
        <Lead style={{ margin: 0 }}>
          Motion is how we express and communicate the brand's <Med>personality, values, and style</Med>. These are the
          principles and patterns for bringing animation into Melio's videos, banners, and social.
        </Lead>
      </Hero>

      <SectionTitle sub="How Melio motion should always feel.">Principles</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <InfoCard icon={<DsIcon name="promote" size={16} style={{ color: COLOR.ink }} />} label="Purposeful" text="Every animation expresses something - speed, flow, or personality. Never movement for its own sake." />
        <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="Quick & calm" text="Fast, smooth, frictionless - like money moving. It should never make someone wait." />
        <InfoCard icon={<DsIcon name="play-circle-outline" size={16} style={{ color: COLOR.ink }} />} label="Natural" text="Ease in and out. Real things accelerate and settle; they never move at a constant speed." />
        <InfoCard icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />} label="Choreographed" text="Stagger entrances so one thing leads and the rest follow, keeping the whole sequence tight." />
      </div>

      <SectionTitle sub="Animated expressions of the logo. Each one leans into a different value - pick the ID that fits the audience and message.">
        Logo IDs
      </SectionTitle>
      <Body>
        We express Melio's value propositions through animated versions of the logo: payments (incoming and outgoing),
        the line (a quick, frictionless transfer of funds), and the fintech, innovative side of the company.
      </Body>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <LogoId bg={COLOR.lilac100} logo="/melio-logo-purple.png" tagline="Cash flow / Money transfer / frictionless" desc="A diverse audience and a playful, less didactic tone, showing how fast money flows." />
        <LogoId bg="#3F3F42" logo="/melio-logo-white.png" tagline="Payments / in-out / dark mode" desc="A more professional audience - accountants and bookkeepers. Dark palette, payments theme." />
        <LogoId bg={COLOR.purple} logo="/melio-logo-white.png" tagline="fintech / CAT / Product" desc="Product people, or when emphasizing innovation and the digital nature of the business." />
      </div>

      <SectionTitle sub="Type animates across a fixed size range. Min/Max apply to all formats.">Type in motion</SectionTitle>
      <div style={{ background: COLOR.lilac100, borderRadius: RADIUS.lg, padding: '24px 28px' }}>
        {SCALE.map((s) => (
          <div key={s.pt} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '6px 0' }}>
            <span style={{ width: 64, flex: '0 0 auto', fontSize: 13, fontStyle: 'italic', color: COLOR.muted, fontVariantNumeric: 'tabular-nums' }}>{s.pt}</span>
            <DsIcon name="arrow right" size={16} style={{ color: COLOR.lilac400 }} />
            <span style={{ fontFamily: POLY, fontWeight: 500, fontSize: s.px, fontStyle: s.italic ? 'italic' : 'normal', color: s.italic ? COLOR.purple : COLOR.ink, lineHeight: 1.1 }}>{s.phrase}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: COLOR.muted, margin: '8px 2px 0' }}>*Min/Max for all formats</p>

      <SectionTitle sub="Keep animated type clean - these treatments are off-brand.">Type don'ts</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <DontType caption="Don't use underline to emphasize">
          <Phrase style={{ textDecoration: 'underline' } as React.CSSProperties} />
        </DontType>
        <DontType caption="Don't use bulky or mono type">
          <Phrase style={{ fontFamily: "'PolySans Mono','PolySans',monospace", fontWeight: 700 }} />
        </DontType>
        <DontType caption="Don't use drop shadow">
          <Phrase style={{ textShadow: '0 6px 6px rgba(0,0,0,0.4)' }} />
        </DontType>
        <DontType caption="Don't use other text colors">
          <div style={{ fontFamily: POLY, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: COLOR.ink, textAlign: 'center' }}>
            Keeping small business<br /><span style={{ color: '#00B874', fontStyle: 'italic' }}>in business.</span>
          </div>
        </DontType>
        <DontType caption="Don't use all caps">
          <div style={{ fontFamily: POLY, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: COLOR.ink, textAlign: 'center', textTransform: 'uppercase' }}>
            Keeping small business<br /><span style={{ color: COLOR.purple }}>in business.</span>
          </div>
        </DontType>
        <DontType caption="Don't go larger than 250pt (mind safety)">
          <Phrase style={{ fontSize: 34 }} />
        </DontType>
      </div>

      <SectionTitle sub="Type-animation presets for messaging in videos, banners, and social - sized to the length of the line.">
        Message cards
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {PRESETS.map((p) => (
          <div key={p.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: p.bg, border: p.bg === COLOR.lilac100 ? `1px solid ${COLOR.hairline}` : 'none', borderRadius: RADIUS.lg, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, textAlign: 'center', fontFamily: POLY, fontWeight: 600, fontSize: 20 }}>
              {p.node}
            </div>
            <span style={{ fontSize: 12, color: COLOR.muted }}>{p.label}</span>
          </div>
        ))}
      </div>
      <Body style={{ marginTop: 10, fontSize: 13, color: COLOR.faint }}>
        Full set also includes <Med>paragraph</Med>, <Med>long paragraph</Med>, and <Med>long sentence</Med> presets,
        plus portrait (9:16) versions of each.
      </Body>

      <SectionTitle sub="How we lay text over footage so it stays legible.">Supers</SectionTitle>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#1F9254', margin: '0 0 10px', letterSpacing: 0.2 }}>Do</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <SuperRule ok label="Add a layer" text="Put a gradient or black layer (about 50% opacity) behind text so it reads against the footage." />
        <SuperRule ok label="Lower thirds" text="Use a solid lower third or division block to lift legibility on busy shots." />
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#D64545', margin: '28px 0 10px', letterSpacing: 0.2 }}>Don't</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <SuperRule ok={false} label="Bare type" text="Never place the logo or type straight on footage with no overlay - it gets lost." />
        <SuperRule ok={false} label="See-through bars" text="Don't make a lower third or division semi-transparent; keep it solid." />
        <SuperRule ok={false} label="On faces" text="Don't lay the logo or type over people's faces. Find the clear part of the frame." />
        <SuperRule ok={false} label="Shapes" text="Don't drop type into shapes (pills, blobs). Use the division blocks instead." />
      </div>

      <SectionTitle sub="Keep key content in the safe area, leave room for platform UI, and always include subtitles.">
        Format safety
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <SafetyFrame ratio="16 / 9" label="HD - YouTube / Facebook" />
        <SafetyFrame ratio="1080 / 1040" label="1080×1040 - Instagram" />
        <SafetyFrame ratio="9 / 16" label="9:16 - Story / Reels" />
      </div>

      <SectionTitle sub="Move between footage, cards, intros, and end cards with one of these.">Transitions</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
        <MiniCard bg={COLOR.lilac100} border label="Fold up"><span style={{ fontFamily: POLY, fontSize: 40, fontWeight: 600, color: COLOR.purple }}>A</span></MiniCard>
        <MiniCard bg={COLOR.lilac100} border label="Box comp"><span style={{ fontFamily: POLY, fontSize: 40, fontWeight: 600, color: COLOR.purple }}>A</span></MiniCard>
        <MiniCard bg={COLOR.lilac100} border label="Scale out"><span style={{ fontFamily: POLY, fontSize: 40, fontWeight: 600, color: COLOR.purple }}>A</span></MiniCard>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <FootageDont caption={`Don't hard-cut from an intro card - use a "title in".`} />
        <FootageDont caption={`Don't use the "scale" transition for cards.`} />
      </div>

      <SectionTitle sub="Open and close videos, banners, and posts - with or without text.">Intros &amp; outros</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <MiniCard bg={COLOR.lilac100} border label="Intro - logo in"><img src="/melio-logo-purple.png" alt="" style={{ height: 24, objectFit: 'contain' }} /></MiniCard>
        <MiniCard bg="#3F3F42" label="Intro - icon in"><img src="/melio-logo-white.png" alt="" style={{ height: 24, objectFit: 'contain' }} /></MiniCard>
        <MiniCard bg={COLOR.purple} label="Outro - logo → tagline"><span style={{ fontFamily: POLY, fontWeight: 600, fontSize: 18, color: '#fff' }}>Get paid <span style={{ fontStyle: 'italic' }}>online.</span></span></MiniCard>
        <MiniCard bg="#3F3F42" label="Outro - tagline → CTA"><span style={{ fontFamily: POLY, fontWeight: 600, fontSize: 14, color: '#fff', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 999, padding: '6px 14px' }}>Start now</span></MiniCard>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
        <FootageDont caption="Don't use a color overlay other than black." />
        <FootageDont caption="Don't use footage in outros / CTAs - solid backgrounds only." />
      </div>

      <SectionTitle sub="Split the frame to separate text from footage.">Divisions</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <Division label="lower 1/3">
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '33%', background: COLOR.lilac200 }} />
        </Division>
        <Division label="1/2">
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: COLOR.lilac200 }} />
        </Division>
        <Division label="1/4">
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: COLOR.lilac200 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '50%', background: COLOR.lilac100 }} />
        </Division>
      </div>

      <SectionTitle sub="The velocity behind our motion - the line that interpolates between states.">
        Line interpolations
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {CURVES.map((c) => (
          <Curve key={c.label} {...c} />
        ))}
      </div>
    </div>
  );
}

export function MotionResources() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Motion resources"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Duration and easing tokens, animation specs, and contacts for branded motion work.</Lead>
      </Hero>
      <ResourceFooter
        title="Motion assets and tokens"
        body={<>Duration and easing tokens live in DS Foundations alongside each component. <Med>For new motion patterns</Med> - branded transitions, campaigns, or logo motion - contact the design team before producing.</>}
        links={[
          { label: 'DS Foundations', href: 'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/🤍-DS-Foundations-🤍', icon: <FigmaLogo /> },
          { label: 'Motion spec doc', disabled: true },
        ]}
        contacts={[
          { name: 'Shira Giladi', role: 'Interaction Design', slack: 'https://xero.enterprise.slack.com/team/U037ZDWL2MA', image: '/contacts/shira.png' },
          { name: 'Isaac Sheptovitsky', role: 'Design System', slack: 'https://xero.enterprise.slack.com/team/U07UQDS31FV', image: '/contacts/isaac.png' },
        ]}
      />
    </div>
  );
}
