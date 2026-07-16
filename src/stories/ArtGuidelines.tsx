import { FONT, COLOR, RADIUS, Med, Lead, Body, SectionTitle, Hero, DsIcon, ResourceFooter, FigmaLogo } from './brandKit';

const mods = import.meta.glob('../assets/guidelines/art/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const art = (name: string) => mods[`../assets/guidelines/art/${name}`];

// ---------- figures (proportion / guide / example diagrams) ----------
// Transparent-background diagrams sit on a grey panel; captions go on top (never bordered).
type Figure = { name: string; caption?: string };

function FigureGrid({ items, min = 280 }: { items: Figure[]; min?: number }) {
  return (
    <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 16 }}>
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

function DoDontTile({ tile, verdict }: { tile: Tile; verdict: Verdict }) {
  const url = art(tile.name);
  if (!url) return null;
  const m = MARK[verdict];
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', rowGap: 8 }}>
      <img src={url} alt="" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
        <DsIcon name={m.icon} size={12} style={{ color: m.color, flexShrink: 0 }} />
        {tile.label && <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4 }}>{tile.label}</span>}
      </div>
    </div>
  );
}

const GALLERY_GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gridTemplateRows: 'auto auto',
  gap: 10,
};

function Gallery({ dos, donts }: { dos: Tile[]; donts: Tile[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
      <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
        <div style={GALLERY_GRID}>
          {dos.map((t) => <DoDontTile key={t.name} tile={t} verdict="do" />)}
        </div>
      </div>
      <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
        <div style={GALLERY_GRID}>
          {donts.map((t) => <DoDontTile key={t.name} tile={t} verdict="dont" />)}
        </div>
      </div>
    </div>
  );
}

export function ArtGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Composing with imagery"
        visual={<img src={art('ui-two-example.png')} alt="" style={{ width: '100%', objectFit: 'contain', borderRadius: RADIUS.lg }} />}
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
        dos={[{ name: 'dd-thumb-do-1.png' }, { name: 'dd-thumb-do-2.png' }, { name: 'dd-thumb-do-3.png' }]}
        donts={[
          { name: 'dd-thumb-dont-1.png', label: 'Without border intersection' },
          { name: 'dd-thumb-dont-2.png', label: 'Without their frame' },
          { name: 'dd-thumb-dont-3.png' },
          { name: 'dd-thumb-dont-4.png' },
        ]}
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
          { name: 'dd-ui-do-1.png' }, { name: 'dd-ui-do-2.png' }, { name: 'dd-ui-do-3.png' },
          { name: 'dd-ui-do-4.png' }, { name: 'dd-ui-do-5.png' },
        ]}
        donts={[
          { name: 'dd-ui-dont-1.png', label: 'On the top edge of the image' },
          { name: 'dd-ui-dont-2.png', label: 'On the center of an image' },
          { name: 'dd-ui-dont-3.png', label: 'Two UIs on a single edge' },
          { name: 'dd-ui-dont-4.png' }, { name: 'dd-ui-dont-5.png' }, { name: 'dd-ui-dont-6.png' },
          { name: 'dd-ui-dont-7.png' }, { name: 'dd-ui-dont-8.png' },
        ]}
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
        dos={[{ name: 'dd-txn-do-1.png' }, { name: 'dd-txn-do-2.png' }, { name: 'dd-txn-do-3.png' }]}
        donts={[
          { name: 'dd-txn-dont-1.png', label: 'Misplaced title badge' },
          { name: 'dd-txn-dont-2.png' },
          { name: 'dd-txn-dont-3.png' },
        ]}
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
        dos={[{ name: 'dd-biz-do-1.png' }, { name: 'dd-biz-do-2.png' }]}
        donts={[
          { name: 'dd-biz-dont-1.png', label: 'Not as the on-image positioning shows' },
          { name: 'dd-biz-dont-2.png' },
        ]}
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
