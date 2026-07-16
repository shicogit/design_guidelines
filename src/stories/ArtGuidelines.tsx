import { FONT, COLOR, RADIUS, Med, Lead, Body, SectionTitle, Hero, DsIcon, ResourceFooter, FigmaLogo } from './brandKit';

const mods = import.meta.glob('../assets/guidelines/art/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const art = (name: string) => mods[`../assets/guidelines/art/${name}`];

// ---------- figures (proportion / guide / example diagrams) ----------
// Transparent-background diagrams sit on a grey panel; captions go on top (never bordered).
type Figure = { name: string; caption?: string };

function FigureGrid({ items }: { items: Figure[] }) {
  return (
    <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
        {items.map((f) => {
          const url = art(f.name);
          if (!url) return null;
          return (
            <div key={f.name}>
              {f.caption && <p style={{ margin: '0 0 6px', fontSize: 12, color: COLOR.muted, textAlign: 'center', fontStyle: 'italic' }}>{f.caption}</p>}
              <img src={url} alt="" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- do / don't galleries ----------
type Verdict = 'do' | 'dont';
const MARK: Record<Verdict, { icon: string; color: string }> = {
  do: { icon: 'checked', color: '#1F9254' },
  dont: { icon: 'close', color: '#D64545' },
};

type Tile = { name: string; label?: string };

// Uniform-height tile so captions line up across a 2-up row; image already carries its frame.
function DoDontTile({ tile, verdict }: { tile: Tile; verdict: Verdict }) {
  const url = art(tile.name);
  if (!url) return null;
  const m = MARK[verdict];
  return (
    <div>
      <div style={{ aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 4px 0' }}>
        <DsIcon name={m.icon} size={12} style={{ color: m.color, flexShrink: 0 }} />
        {tile.label && <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4 }}>{tile.label}</span>}
      </div>
    </div>
  );
}

// Three tiles per row, filling the width.
const TILE_GRID: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 };

// Gallery block: galleries on the left (standard content width), text on the right.
function Gallery({ dos, donts, note }: { dos: Tile[]; donts: Tile[]; note: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 36, margin: '16px 0 0', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
          <div style={TILE_GRID}>
            {dos.map((t) => <DoDontTile key={t.name} tile={t} verdict="do" />)}
          </div>
        </div>
        <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
          <div style={TILE_GRID}>
            {donts.map((t) => <DoDontTile key={t.name} tile={t} verdict="dont" />)}
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px', lineHeight: 1.25 }}>Do's and don'ts</h3>
        <p style={{ fontFamily: FONT, fontSize: 13, color: COLOR.body, lineHeight: 1.65, margin: 0 }}>{note}</p>
      </div>
    </div>
  );
}

export function ArtGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Composing with imagery"
        visual={<img src={art('hero.png')} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
      >
        <Lead>
          This chapter covers the types of imagery used in Melio's visual language and how to properly
          construct and <Med>art direct</Med> them across different formats and deliverables.
        </Lead>
        <Lead style={{ margin: 0 }}>
          Photography is composed with product elements - vendor thumbnails, simplified UIs, and badges.
        </Lead>
      </Hero>

      {/* ---- Vendor thumbnails ---- */}
      <SectionTitle sub="Vendor and SMB unit dimensions.">Vendor thumbnails</SectionTitle>
      <Body>
        The proportion between the vendor thumbnail and the big SMB primary image is <Med>1 to 3 (width)</Med> and{' '}
        <Med>1 to 4 (height)</Med>. Never place a thumbnail image at the top or bottom of the SMB image's vertical
        safe zone (marked in red). When you place two vendor thumbnails, place them at two different heights to create
        a more balanced composition.
      </Body>
      <FigureGrid
        items={[
          { name: 'thumbnail-single.png', caption: 'Vendor thumbnail and SMB primary image' },
          { name: 'thumbnails-two.png', caption: 'A proper positioning of two vendor thumbnails' },
          { name: 'thumbnail-frame.png', caption: 'Thumbnail frame - 8px stroke, 20px radius' },
        ]}
      />
      <Gallery
        dos={[
          { name: 'dd-thumb-do-1.png', label: 'Two thumbnails, offset heights' },
          { name: 'dd-thumb-do-2.png', label: 'Single thumbnail on the edge' },
          { name: 'dd-thumb-do-3.png', label: 'Crossing the image edge' },
        ]}
        donts={[
          { name: 'dd-thumb-dont-1.png', label: 'Without border intersection' },
          { name: 'dd-thumb-dont-2.png', label: 'Without their frame' },
          { name: 'dd-thumb-dont-3.png', label: 'Not touching the edge' },
          { name: 'dd-thumb-dont-4.png', label: 'Overlapping the subject' },
        ]}
        note={<>Keep every thumbnail's frame and let it cross the SMB image's edge, at offset heights.</>}
      />

      {/* ---- Simplified UIs ---- */}
      <SectionTitle sub="Images and simplified UIs.">Simplified UIs</SectionTitle>
      <Body>
        Whenever combining simplified UIs (mini mocks) with landscape images, the mini-mock's width should be{' '}
        <Med>1/3 of the big image's width</Med>. Place the mini-mock on any side of the image <Med>except the top</Med>.
        Two simplified UIs on a single image should be placed on two opposing vertical edges at different heights to
        ensure visual balance.
      </Body>
      <FigureGrid
        items={[
          { name: 'ui-vertical.png', caption: 'Vertical images and a single simplified UI proportion' },
          { name: 'ui-horizontal.png', caption: 'Horizontal images and a single simplified UI proportion' },
          { name: 'ui-two-guide.png', caption: 'Horizontal images and a two simplified UI proportion' },
          { name: 'ui-two-example.png', caption: 'Horizontal images and a single simplified UI example' },
        ]}
      />
      <Gallery
        dos={[
          { name: 'dd-ui-do-1.png', label: 'On a side, off-center' },
          { name: 'dd-ui-do-2.png', label: 'Single UI on a side' },
          { name: 'dd-ui-do-3.png', label: 'Two UIs, opposing edges' },
          { name: 'dd-ui-do-4.png', label: 'Opposing edges, offset' },
          { name: 'dd-ui-do-5.png', label: 'Two UIs on opposite sides' },
        ]}
        donts={[
          { name: 'dd-ui-dont-1.png', label: 'On the top edge of the image' },
          { name: 'dd-ui-dont-2.png', label: 'On the center of an image' },
          { name: 'dd-ui-dont-3.png', label: 'Two UIs on a single edge' },
          { name: 'dd-ui-dont-4.png', label: 'Two UIs on a single edge' },
          { name: 'dd-ui-dont-5.png', label: 'Two UIs on a single edge' },
          { name: 'dd-ui-dont-6.png', label: 'Two UIs on a single edge' },
          { name: 'dd-ui-dont-7.png', label: 'Both stacked on one side' },
          { name: 'dd-ui-dont-8.png', label: 'Both stacked on one side' },
        ]}
        note={<>Anchor mini-mocks to a side - never the top edge or the dead center of the image.</>}
      />

      {/* ---- Value proposition ---- */}
      <SectionTitle sub="Simplified UIs and vendor thumbnails supporting the value proposition.">Supporting the value proposition</SectionTitle>
      <Body>
        Simplified UIs and vendor thumbnails are also used to support areas of Melio's value proposition. The title
        badge names the business or the transaction; anchor it to an edge. Also avoid center-justifying all components
        or rescaling the vendor thumbnail's proportions.
      </Body>
      <FigureGrid
        items={[
          { name: 'value-prop.png', caption: 'Thumbnails and a simplified UI supporting a message' },
          { name: 'badge-anatomy.png', caption: 'Business tag and transaction badge' },
          { name: 'tags-guide.png', caption: 'Title badge placement' },
          { name: 'tags-example.png', caption: 'Transaction badge in use' },
        ]}
      />
      <Gallery
        dos={[
          { name: 'dd-txn-do-1.png', label: 'Crossing the edge' },
          { name: 'dd-txn-do-2.png', label: 'Crossing the top edge' },
          { name: 'dd-txn-do-3.png', label: 'Crossing a side edge' },
        ]}
        donts={[
          { name: 'dd-txn-dont-1.png', label: 'Misplaced title badge' },
          { name: 'dd-txn-dont-2.png', label: 'Floating over the subject' },
          { name: 'dd-txn-dont-3.png', label: 'Not aligned to the edge' },
        ]}
        note={<>Pin the title badge to an edge; don't misplace, rescale, or center-justify it.</>}
      />

      {/* ---- SMB badge ---- */}
      <SectionTitle sub="An informative component for images of real Melio users.">SMB badge</SectionTitle>
      <Body>
        The SMB badge accompanies any image of a real Melio user in marketing, product, or internal uses. It states
        the <Med>business name</Med>, the owner's name, and the year they joined Melio. Follow the on-image positioning
        and keep it clear of the top safe zone.
      </Body>
      <FigureGrid
        items={[
          { name: 'smb-badge-dims.png', caption: 'SMB Badge - dimensions and edge positioning' },
          { name: 'smb-badge-onimage.png', caption: 'SMB Badge - on image positioning' },
        ]}
      />
      <Gallery
        dos={[
          { name: 'dd-biz-do-1.png', label: 'In a bottom corner' },
          { name: 'dd-biz-do-2.png', label: 'In a top corner' },
        ]}
        donts={[
          { name: 'dd-biz-dont-1.png', label: 'Centered on the subject' },
          { name: 'dd-biz-dont-2.png', label: 'In the top safe zone' },
        ]}
        note={<>Place the SMB badge exactly as the on-image positioning shows.</>}
      />

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
