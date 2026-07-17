import { FONT, COLOR, RADIUS, Med, Lead, SectionTitle, Hero, DsIcon, ResourceFooter, FigmaLogo } from './brandKit';

const mods = import.meta.glob('../assets/guidelines/art/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const art = (name: string) => mods[`../assets/guidelines/art/${name}`];

// Standard split row used across the brand pages: visual on the left, title + text on the right.
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

// A single diagram / example image on a grey panel (transparent art gets no border).
function FigurePanel({ name }: { name: string }) {
  const url = art(name);
  if (!url) return null;
  return (
    <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
      <img src={url} alt="" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
    </div>
  );
}

// ---------- do / don't gallery (also lives inside a SplitRow visual) ----------
type Verdict = 'do' | 'dont';
const MARK: Record<Verdict, { icon: string; color: string }> = {
  do: { icon: 'checked', color: '#1F9254' },
  dont: { icon: 'close', color: '#D64545' },
};
type Tile = { name: string; label: string };

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
        <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4 }}>{tile.label}</span>
      </div>
    </div>
  );
}

const TILE_GRID: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 };

function DoDontGallery({ dos, donts }: { dos: Tile[]; donts: Tile[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
        <div style={TILE_GRID}>{dos.map((t) => <DoDontTile key={t.name} tile={t} verdict="do" />)}</div>
      </div>
      <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
        <div style={TILE_GRID}>{donts.map((t) => <DoDontTile key={t.name} tile={t} verdict="dont" />)}</div>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { fontFamily: FONT, color: COLOR.ink };

// ===================== Section: Vendor thumbnails =====================
export function ArtVendorThumbnails() {
  return (
    <div style={wrap}>
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

      <SectionTitle sub="Vendor and SMB unit dimensions.">Vendor thumbnails</SectionTitle>
      <SplitRow
        noDivider
        visual={<FigurePanel name="thumbnail-single.png" />}
        title="Proportions"
        body={<>The vendor thumbnail sits over the SMB primary image at a <Med>1:3 width</Med> and <Med>1:4 height</Med> ratio. Never place it in the top or bottom safe zone (marked in red).</>}
      />
      <SplitRow
        visual={<FigurePanel name="thumbnails-two.png" />}
        title="Two thumbnails"
        body="Set two vendor thumbnails at two different heights to create a more balanced composition."
      />
      <SplitRow
        visual={<FigurePanel name="thumbnail-frame.png" />}
        title="Thumbnail frame"
        body="Each thumbnail keeps an 8px stroke and a 20px corner radius."
      />
      <SplitRow
        visual={
          <DoDontGallery
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
          />
        }
        title="Do's and don'ts"
        body="Keep every thumbnail's frame and let it cross the SMB image's edge, at offset heights."
      />
    </div>
  );
}

// ===================== Section: Simplified UIs =====================
export function ArtSimplifiedUIs() {
  return (
    <div style={wrap}>
      <SectionTitle sub="Images and simplified UIs.">Simplified UIs</SectionTitle>
      <SplitRow
        noDivider
        visual={<FigurePanel name="ui-vertical.png" />}
        title="Proportions"
        body={<>Combine simplified UIs (mini mocks) with images at <Med>1/3 of the image width</Med>. Place a mock on any side of the image <Med>except the top</Med>.</>}
      />
      <SplitRow
        visual={<FigurePanel name="ui-horizontal.png" />}
        title="On landscape"
        body="On horizontal images the mini-mock still sits at 1/3 width, anchored to a side edge."
      />
      <SplitRow
        visual={<FigurePanel name="ui-two-guide.png" />}
        title="Two mini mocks"
        body="Two simplified UIs go on opposing vertical edges, at different heights, for visual balance."
      />
      <SplitRow
        visual={<FigurePanel name="ui-two-example.png" />}
        title="In use"
        body="A finished composition with the mini-mocks placed on opposing edges."
      />
      <SplitRow
        visual={
          <DoDontGallery
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
              { name: 'dd-ui-dont-3.png', label: 'Tags crowding the UI' },
              { name: 'dd-ui-dont-4.png', label: 'Title tag on top of UI' },
              { name: 'dd-ui-dont-5.png', label: 'UI on top of thumbnail image' },
              { name: 'dd-ui-dont-7.png', label: 'Two UIs on a single edge' },
              { name: 'dd-ui-dont-8.png', label: 'Two UIs on the center of an image' },
            ]}
          />
        }
        title="Do's and don'ts"
        body="Anchor mini-mocks to a side - never the top edge or the dead center of the image."
      />
    </div>
  );
}

// ===================== Section: Value proposition =====================
export function ArtValueProp() {
  return (
    <div style={wrap}>
      <SectionTitle sub="Simplified UIs and vendor thumbnails supporting the value proposition.">Value proposition</SectionTitle>
      <SplitRow
        noDivider
        visual={<FigurePanel name="value-prop.png" />}
        title="Value proposition"
        body="Simplified UIs and vendor thumbnails are also used to support areas of Melio's value proposition."
      />
      <SplitRow
        visual={<FigurePanel name="badge-anatomy.png" />}
        title="Tags"
        body="The title badge names the business or the transaction. Drop shadow 7%, blur 40, 12px radius."
      />
      <SplitRow
        visual={<FigurePanel name="tags-guide.png" />}
        title="Placement"
        body="Anchor the badge to an edge; keep it out of the center."
      />
      <SplitRow
        visual={<FigurePanel name="tags-example.png" />}
        title="In use"
        body="The transaction badge on a finished image."
      />
      <SplitRow
        visual={
          <DoDontGallery
            dos={[
              { name: 'dd-txn-do-1.png', label: 'Crossing the edge' },
              { name: 'dd-txn-do-2.png', label: 'Crossing the bottom middle edge' },
              { name: 'dd-txn-do-3.png', label: 'Crossing a side edge' },
            ]}
            donts={[
              { name: 'dd-txn-dont-1.png', label: 'Centered, not crossing edges' },
              { name: 'dd-txn-dont-2.png', label: 'Floating over the subject' },
              { name: 'dd-txn-dont-3.png', label: "Hiding subject's face" },
            ]}
          />
        }
        title="Do's and don'ts"
        body="Pin the title badge to an edge; don't misplace, rescale, or center-justify it."
      />
    </div>
  );
}

// ===================== Section: SMB badge =====================
export function ArtSmbBadge() {
  return (
    <div style={wrap}>
      <SectionTitle sub="An informative component for images of real Melio users.">SMB badge</SectionTitle>
      <SplitRow
        noDivider
        visual={<FigurePanel name="smb-badge-dims.png" />}
        title="SMB badge"
        body={<>The SMB badge accompanies images of real Melio users. It states the <Med>business name</Med>, the owner's name, and the year they joined Melio.</>}
      />
      <SplitRow
        visual={<FigurePanel name="smb-badge-onimage.png" />}
        title="On-image positioning"
        body="Follow the fixed edge positions and keep the badge clear of the top safe zone."
      />
      <SplitRow
        visual={
          <DoDontGallery
            dos={[
              { name: 'dd-biz-do-1.png', label: 'In a bottom corner' },
              { name: 'dd-biz-do-2.png', label: 'Crossing edges' },
            ]}
            donts={[
              { name: 'dd-biz-dont-1.png', label: 'Centered on the subject' },
              { name: 'dd-biz-dont-2.png', label: 'In the top safe zone' },
            ]}
          />
        }
        title="Do's and don'ts"
        body="Place the SMB badge exactly as the on-image positioning shows."
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
