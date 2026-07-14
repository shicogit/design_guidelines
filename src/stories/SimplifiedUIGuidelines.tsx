import { FONT, COLOR, RADIUS, Med, Lead, Body, SectionTitle, InfoCard, Hero, DsIcon, FigmaLogo, ResourceFooter } from './brandKit';

const suiMods = import.meta.glob('../assets/guidelines/simplified-ui/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const SUI = (n: number) => suiMods[`../assets/guidelines/simplified-ui/Simplified UI 0${n}.jpg`];

function SuiImage({ n, style }: { n: number; style?: React.CSSProperties }) {
  const url = SUI(n);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={`Simplified UI example ${n}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: RADIUS.lg, display: 'block', ...style }}
    />
  );
}

function Rule({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: RADIUS.md, background: ok ? '#F2FAF5' : '#FEF4F4', border: `1px solid ${ok ? '#D4EDDA' : '#FAD4D4'}` }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 999, background: ok ? '#E7F6EC' : '#FDE8E8', color: ok ? '#1F9254' : '#D64545', flexShrink: 0, marginTop: 1 }}>
        <DsIcon name={ok ? 'checked' : 'close'} size={12} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: COLOR.body, fontWeight: 500 }}>{label}</div>
        {detail && <div style={{ fontSize: 13, color: COLOR.muted, marginTop: 2, lineHeight: 1.5 }}>{detail}</div>}
      </div>
    </div>
  );
}

export function SimplifiedUIGuidelines() {
  const firstImg = SUI(1);
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Only what the message needs"
        visual={
          firstImg
            ? <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, overflow: 'hidden' }}><SuiImage n={1} style={{ borderRadius: RADIUS.lg }} /></div>
            : <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, background: COLOR.lilac100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DsIcon name="monitor" size={48} style={{ color: COLOR.lilac400 }} /></div>
        }
      >
        <Lead>
          Simplified UI is the practice of <Med>reducing a product screenshot to the minimum elements</Med> needed to
          communicate a specific moment - nothing more.
        </Lead>
        <Lead style={{ margin: 0 }}>
          Used in marketing, onboarding, and documentation where showing the full product would distract from the point.
        </Lead>
      </Hero>

      <SectionTitle sub="The situations where simplified UI is the right call.">When to use it</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="Onboarding steps" text="Guide users through a flow by showing only the relevant UI element for each step. Surrounding noise competes with the instruction." />
        <InfoCard icon={<DsIcon name="info" size={16} style={{ color: COLOR.ink }} />} label="Empty states" text="An empty screen with too much navigation and menus feels overwhelming. Strip to just the empty-state message and action." />
        <InfoCard icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />} label="Success & confirmation" text="When celebrating an action (payment sent, invoice received), the checkmark and amount are all that need to be there." />
        <InfoCard icon={<DsIcon name="shield-check" size={16} style={{ color: COLOR.ink }} />} label="Error and recovery" text="In an error state, simplify to the message and the recovery action. Remove anything that isn't directly solving the problem." />
        <InfoCard icon={<DsIcon name="promote" size={16} style={{ color: COLOR.ink }} />} label="Marketing and ads" text="When a product interface appears in a campaign, strip it to just the feature being promoted. The audience processes it in seconds." />
        <InfoCard icon={<DsIcon name="file" size={16} style={{ color: COLOR.ink }} />} label="Documentation" text="Step-by-step guides need clean callouts. Highlighting one area in a dense UI means everything else competes for attention." />
      </div>

      <SectionTitle sub="Reduced UI in context - only the elements that matter for the specific moment.">Examples</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {[2, 3, 4].map((n) => (
          <div key={n} style={{ borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.panel, aspectRatio: '4 / 3' }}>
            <SuiImage n={n} />
          </div>
        ))}
      </div>

      <SectionTitle sub="How to simplify without losing recognizability.">How to do it</SectionTitle>
      <Body>
        The goal is to make the relevant UI element <Med>unmistakably clear</Med> without showing the entire product.
        Keep the Melio visual style intact so the screenshot still reads as Melio - don't reimagine the UI, just reduce it.
      </Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '4px 0' }}>
        <Rule ok label="Start from a real screenshot, then remove" detail="Don't draw a fake UI from scratch. Start real, then subtract everything that isn't essential." />
        <Rule ok label="Keep the Melio design language" detail="Colors, typography, border-radius, and spacing should all look like Melio. Simplified doesn't mean redesigned." />
        <Rule ok label="Lighten or blur the non-focal areas" detail="If surrounding UI is needed for context, you can reduce its opacity to keep focus on the key element." />
        <Rule ok label="Use a clean background" detail="White or the Melio lilac surface (#F6F8FE). Avoid screenshots floating on dark or photographic backgrounds." />
        <Rule ok={false} label="Don't invent UI that doesn't exist" detail="Simplified UI is a reduction, not a concept. If the element doesn't exist in the product, don't draw it." />
        <Rule ok={false} label="Don't remove the Melio brand identity" detail="Stripped of colors, fonts, and radius, a screenshot stops being Melio. Keep the visual DNA." />
        <Rule ok={false} label="Don't mix simplified UI with full-UI screenshots" detail="In a single visual, pick one level of complexity. Mixing them makes the composition feel inconsistent." />
      </div>

      <div style={{ marginTop: 24, background: COLOR.lilac100, border: `1px solid ${COLOR.lilac300}`, borderRadius: RADIUS.lg, padding: '16px 20px' }}>
        <Body style={{ margin: 0 }}>
          <Med>Tip:</Med> use the brand's purple (<Med>#7849FF</Med>) as a callout color to highlight the specific
          UI area you want the reader to focus on - a border, an arrow, or a spotlight overlay. Keep callout graphics
          minimal so they don't become the story.
        </Body>
      </div>
    </div>
  );
}

export function SimplifiedUIResources() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Simplified UI kit"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>The Mini Mock library for quick UI mockups - app chrome, cards, buttons, and input states.</Lead>
      </Hero>
      <ResourceFooter
        title="Simplified UI kit"
        body={<>The Mini Mock library lives in DS Foundations under the Simplified UI frame - includes app chrome, cards, buttons, and input states. <Med>To request new components</Med> or report inconsistencies, reach out to the design team.</>}
        links={[
          { label: 'DS Foundations', href: 'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/🤍-DS-Foundations-🤍', icon: <FigmaLogo /> },
          { label: 'Component request', href: 'https://docs.google.com/forms/d/e/1FAIpQLSd7sLkMrJMjOITz0-Dw5-WBa_8l0sVWVInP-8WMuh0AUEoYNQ/viewform?pli=1' },
        ]}
      />
    </div>
  );
}
