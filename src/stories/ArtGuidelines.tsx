import { FONT, COLOR, RADIUS, Med, Lead, SectionTitle, Hero, DsIcon, ResourceFooter, FigmaLogo } from './brandKit';

const mods = import.meta.glob('../assets/guidelines/art/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const art = (name: string) => mods[`../assets/guidelines/art/${name}`];

function SplitRow({ visual, title, body, noDivider = false }: { visual: React.ReactNode; title: string; body: React.ReactNode; noDivider?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 36, padding: '36px 0', borderTop: noDivider ? 'none' : `1px solid ${COLOR.hairline}`, alignItems: 'start' }}>
      <div>{visual}</div>
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px', lineHeight: 1.25 }}>{title}</h3>
        <p style={{ fontFamily: FONT, fontSize: 13, color: COLOR.body, lineHeight: 1.65, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

// Transparent-background composite (guide diagram / real example) sitting on a grey panel.
// Illustration images with transparent backgrounds get no border.
function PanelImg({ name, label }: { name: string; label?: string }) {
  const url = art(name);
  if (!url) return null;
  return (
    <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
      {label && <p style={{ margin: '0 0 6px', fontSize: 12, color: COLOR.muted, textAlign: 'center' }}>{label}</p>}
      <img src={url} alt="" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
    </div>
  );
}

type Verdict = 'do' | 'dont';
const MARK: Record<Verdict, { icon: string; color: string }> = {
  do: { icon: 'checked', color: '#1F9254' },
  dont: { icon: 'close', color: '#D64545' },
};

// One do/don't tile - the image already carries its green/red frame, so we only add a caption.
function DoDontTile({ name, verdict, label }: { name: string; verdict: Verdict; label: string }) {
  const url = art(name);
  if (!url) return null;
  const m = MARK[verdict];
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', rowGap: 8 }}>
      <img src={url} alt="" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
        <DsIcon name={m.icon} size={12} style={{ color: m.color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{label}</span>
      </div>
    </div>
  );
}

// Grid matches the Typography page: one panel of do's, one panel of don'ts.
const GALLERY_GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gridTemplateRows: 'auto auto',
  gap: 10,
};

const DO_ITEMS: { name: string; label: string }[] = [
  { name: 'do-thumbnails.png', label: 'Framed & offset' },
  { name: 'do-simplified-ui.png', label: 'On a side' },
  { name: 'do-business-tag.png', label: 'On a corner' },
  { name: 'do-transaction-tag.png', label: 'Crosses the edge' },
];

const DONT_ITEMS: { name: string; label: string }[] = [
  { name: 'dont-thumbnails.png', label: 'No edge overlap' },
  { name: 'dont-simplified-ui.png', label: 'On the top edge' },
  { name: 'dont-business-tag.png', label: 'Centered on subject' },
  { name: 'dont-transaction-tag.png', label: 'Floating center' },
];

export function ArtGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Composing with imagery"
        visual={<img src={art('simplified-ui-example.png')} alt="" style={{ width: '100%', objectFit: 'contain', borderRadius: RADIUS.lg }} />}
      >
        <Lead>
          Melio's photography rarely stands alone. Real small-business owners are <Med>art-directed</Med> with
          product elements - vendor thumbnails, simplified UIs, and badges - to tell a product story.
        </Lead>
        <Lead style={{ margin: 0 }}>
          These rules keep those compositions <Med>balanced</Med> and on-brand across every format.
        </Lead>
      </Hero>

      <SplitRow
        visual={<PanelImg name="thumbnails.png" />}
        title="Vendor thumbnails"
        body={<>A vendor thumbnail sits over the primary SMB image at a <Med>1:3 width</Med> and <Med>1:4 height</Med> ratio, keeping its white frame. Hold it clear of the top and bottom safe zones. With two thumbnails, set them at <Med>different heights</Med> for balance.</>}
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PanelImg name="simplified-ui-guide.png" label="Proportions" />
            <PanelImg name="simplified-ui-example.png" label="In use" />
          </div>
        }
        title="Simplified UIs"
        body={<>Mini-mocks reinforce a product message. Size each to <Med>1/3 of the image width</Med> and place it on any side <Med>except the top</Med>. Two mocks sit on <Med>opposing edges</Med> at different heights. Drop shadow 7%, blur 40.</>}
      />

      <SplitRow
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PanelImg name="tags-guide.png" label="Placement" />
            <PanelImg name="tags-example.png" label="In use" />
          </div>
        }
        title="Business & transaction tags"
        body={<>Tags surface a business name or a payment to support the value proposition. Anchor them to an <Med>edge</Med> - never center them, rescale the thumbnail, or center-justify the layout.</>}
      />

      <SplitRow
        visual={<PanelImg name="smb-badge.png" />}
        title="SMB badge"
        body={<>The SMB badge accompanies images of real Melio users. It states the <Med>business name</Med>, the owner, and the year they joined. Pin it to a fixed edge position, clear of the top safe zone.</>}
      />

      <SectionTitle sub="The same four elements, placed right and placed wrong.">Do's and don'ts</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
          <div style={GALLERY_GRID}>
            {DO_ITEMS.map((it) => (
              <DoDontTile key={it.name} name={it.name} verdict="do" label={it.label} />
            ))}
          </div>
        </div>
        <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
          <div style={GALLERY_GRID}>
            {DONT_ITEMS.map((it) => (
              <DoDontTile key={it.name} name={it.name} verdict="dont" label={it.label} />
            ))}
          </div>
        </div>
      </div>

      <ResourceFooter
        title="Need imagery or the photo library?"
        body="Art-direction frames, the SMB badge, and simplified-UI kits live in the BD Foundations Figma file. The approved photo library sits on the brand drive - reach out to the design team for access."
        links={[
          { label: 'BD Foundations', href: 'https://www.figma.com/design/P7XSaH7fPQtWh83hKilsLQ/🟪-BD-Foundations', icon: <FigmaLogo /> },
        ]}
      />
    </div>
  );
}
