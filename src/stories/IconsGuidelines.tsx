import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { IconGallery } from './IconGallery';
import { ColorChip } from './ColorChip';
import { MissingImage } from './MissingImage';
import { FONT, COLOR, RADIUS, Med, Lead, Body, Hero, DsIcon } from './brandKit';

const FIGMA_FOUNDATIONS =
  'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/%F0%9F%A4%8D-DS-Foundations-%F0%9F%A4%8D';
const NOTION_ADDING_ICONS =
  'https://app.notion.com/p/meliopayments/Adding-icons-to-Penny-16c66d69640a807580e2d0eaaf0f6d33?source=copy_link';
const PENNY_ICON_DOCS = 'https://penny.melio.com/?path=/docs/foundations-icon--docs&globals=theme:clover';
const NOTION_FAVICON = 'https://www.google.com/s2/favicons?domain=notion.so&sz=64';

const pennyMods = import.meta.glob('../assets/penny-symbol.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const PENNY_LOGO = pennyMods['../assets/penny-symbol.png'];

const iconGuideMods = import.meta.glob('../assets/guidelines/icons/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const iconGuideUrl = (name: string) => iconGuideMods[`../assets/guidelines/icons/${name}`];

const iconVideoMods = import.meta.glob('../assets/guidelines/icons/*.mp4', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const ICON_VIDEOS = ['icons-02.mp4', 'icons-01.mp4', 'icons-03.mp4']
  .map((n) => iconVideoMods[`../assets/guidelines/icons/${n}`])
  .filter(Boolean);

function VideoClip({ src, style }: { src?: string; style?: CSSProperties }) {
  const [controls, setControls] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      controls={controls}
      onClick={() => setControls(true)}
      onMouseLeave={() => setControls(false)}
      style={{ width: '100%', display: 'block', borderRadius: RADIUS.lg, background: COLOR.lilac100, ...style }}
    />
  );
}

// Figma's mark - shown on the link to the Figma DS Foundations file (per the "links carry the site's logo" rule).
function FigmaLogo() {
  return (
    <svg width="15" height="15" viewBox="0 0 38 57" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

// The hero contact-sheet: nine real Melio DS icons (24px set), served from melio/penny via Vite proxy.
const HERO_ICON_NAMES = ['funds', 'promote', 'wallet', 'fast', 'to-do', 'shop', 'inbox', 'gift', 'business'];
const HERO_ICONS = HERO_ICON_NAMES.map((n) => `/penny-gh/raw/medium/${n}.svg`);

function IconHero() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', placeItems: 'center', gap: 18 }}>
      {HERO_ICONS.map((url, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: 52,
            height: 52,
            backgroundColor: COLOR.lilac400,
            WebkitMaskImage: `url("${url}")`,
            maskImage: `url("${url}")`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ))}
    </div>
  );
}

function GridSpec({
  title,
  grid,
  stroke,
  corner,
  imgFile,
}: {
  title: string;
  grid: string;
  stroke: string;
  corner: string;
  imgFile: string;
}) {
  const imgUrl = iconGuideUrl(imgFile);
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 11, padding: '5px 0', borderTop: `1px solid ${COLOR.hairline}` }}>
      <span style={{ color: COLOR.muted }}>{k}</span>
      <span style={{ color: COLOR.ink, fontWeight: 500, textAlign: 'right' }}>{v}</span>
    </div>
  );
  return (
    <div style={{ background: COLOR.hover, borderRadius: RADIUS.lg, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.ink }}>{title}</div>
        <div style={{ fontSize: 11, color: COLOR.faint, fontWeight: 500 }}>{grid}</div>
      </div>
      <div style={{ margin: '0 0 12px', borderRadius: RADIUS.md, overflow: 'hidden', background: COLOR.panel }}>
        {imgUrl
          ? <img src={imgUrl} alt={`${title} ${grid} grid diagram`} style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
          : <MissingImage label={`${title} - ${grid} diagram`} ratio="1 / 1" />}
      </div>
      <Row k="Stroke width" v={stroke} />
      <Row k="Stroke ends" v="Rounded" />
      <Row k="Corner radius" v={corner} />
      <Row k="Margin (frame)" v="1px" />
    </div>
  );
}


function SplitRow({ visual, title, body, noDivider }: { visual: React.ReactNode; title: string; body: React.ReactNode; noDivider?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 36, padding: '36px 0', borderTop: noDivider ? undefined : `1px solid ${COLOR.hairline}`, alignItems: 'start' }}>
      <div>{visual}</div>
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px', lineHeight: 1.25 }}>{title}</h3>
        <div style={{ fontFamily: FONT, fontSize: 13, color: COLOR.body, lineHeight: 1.65 }}>{body}</div>
      </div>
    </div>
  );
}


function NeedIcon() {
  const Btn = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: COLOR.white,
        color: COLOR.ink,
        border: `1px solid ${COLOR.outline}`,
        borderRadius: 10,
        padding: '8px 16px 8px 12px',
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
    >
      {icon}
      {children}
    </a>
  );
  return (
    <div style={{ fontFamily: FONT, background: COLOR.lilac100, border: `1px solid ${COLOR.lilac300}`, borderRadius: RADIUS.lg, padding: '18px 20px' }}>
      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: COLOR.purple }}>Need a new icon?</h3>
      <Body style={{ margin: '0 0 10px' }}>
        <Med>First, check the bank.</Med> Browse the existing 300+ icons - if what you need already exists, use it.
      </Body>
      <Body style={{ margin: '0 0 14px' }}>
        If it doesn't exist, go to{' '}
        <a href={NOTION_ADDING_ICONS} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Notion</a>
        {' '}to add a request.
      </Body>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Btn href={FIGMA_FOUNDATIONS} icon={<FigmaLogo />}>DS Foundations</Btn>
        <Btn href={PENNY_ICON_DOCS} icon={<img src={PENNY_LOGO} alt="" width={16} height={16} style={{ flexShrink: 0, objectFit: 'contain' }} />}>
          Penny - Icons
        </Btn>
        <Btn
          href={NOTION_ADDING_ICONS}
          icon={<img src={NOTION_FAVICON} alt="" width={16} height={16} style={{ flexShrink: 0, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
        >
          Adding icons to Penny
        </Btn>
      </div>
    </div>
  );
}

export function IconsGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="300+ pixel-perfect icons" visual={<IconHero />}>
        <Lead>
          Melio's icon bank holds <Med>over 300 custom, pixel-perfect icons</Med> - a unified set that supports product
          functionality and visual storytelling.
        </Lead>
        <Lead style={{ margin: 0 }}>
          They're used across <Med>product UI</Med>, <Med>marketing materials</Med>, and <Med>presentations</Med>.
        </Lead>
      </Hero>

      {ICON_VIDEOS.length > 0 && (
        <div style={{ display: 'flex', gap: 12 }}>
          {ICON_VIDEOS.map((src, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0 }}>
              <VideoClip src={src} />
            </div>
          ))}
        </div>
      )}

      <SplitRow
        title="Grid & sizes"
        body="Every icon is drawn twice - on a 24px and a 16px grid - staying pixel-perfect at both scales. Each size has its own stroke and corner-radius values."
        visual={
          iconGuideUrl('the 2 Grids.jpg') ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={iconGuideUrl('the 2 Grids.jpg')} alt="The two icon grids" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
            </div>
          ) : <div />
        }
      />

      <SplitRow
        noDivider
        title="Large"
        body="24px grid - 2px stroke, rounded ends, 2px corner radius, 1px frame margin."
        visual={
          iconGuideUrl('Grid 24px.jpg') ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={iconGuideUrl('Grid 24px.jpg')} alt="Large 24px grid" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
            </div>
          ) : <div />
        }
      />

      <SplitRow
        noDivider
        title="Small"
        body={
          <>
            16px grid - 1.5px stroke, rounded ends, 1.5px corner radius, 1px frame margin.
            <p style={{ margin: '8px 0 0', fontSize: 12, color: COLOR.faint, lineHeight: 1.5 }}>
              Corner radius is the rule in most cases - exceptional icons may deviate slightly where pixel clarity requires it.
            </p>
          </>
        }
        visual={
          iconGuideUrl('Grid 16px.jpg') ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={iconGuideUrl('Grid 16px.jpg')} alt="Small 16px grid" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
            </div>
          ) : <div />
        }
      />

      <SplitRow
        noDivider
        title="Pixel boundaries"
        body="On the 16px grid, align the outer edge of shapes to pixel boundaries for crispness at small sizes."
        visual={
          iconGuideUrl('pixel boundaries.jpg') ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={iconGuideUrl('pixel boundaries.jpg')} alt="Pixel boundaries" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
              <p style={{ margin: '10px 0 0', fontSize: 12, color: COLOR.muted, lineHeight: 1.5 }}>
                On the 16px grid, align the outer edge of shapes to pixel boundaries.
              </p>
            </div>
          ) : <div />
        }
      />

      <SplitRow
        title="Figma structure"
        body="Icons live in the DS Foundations Figma file, organized in frames by category. Each icon is a component with 24px and 16px variants."
        visual={
          iconGuideUrl('DS Figma layers.jpg') ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={iconGuideUrl('DS Figma layers.jpg')} alt="DS Figma layer structure" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
            </div>
          ) : <div />
        }
      />

      <SplitRow
        title="Categories"
        body="Each icon works alone or inside a category strip. The same glyph is consistent at both sizes - redrawn on each grid."
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['Icons categories examples.jpg', 'Icons visual 01.jpg', 'Icons visual 02.jpg'] as const).map((file) => {
              const url = iconGuideUrl(file);
              return url ? (
                <div key={file} style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                  <img src={url} alt={file.replace('.jpg', '')} style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
                </div>
              ) : null;
            })}
          </div>
        }
      />

      <SplitRow
        title="Color"
        body={
          <>
            Icons are monochrome - one solid color at a time, never gradients. Use an <Med>approved brand color</Med> for the context and legible contrast. Common choices: <ColorChip hex="#1A1A1A" /> default UI, <ColorChip hex="#7849FF" /> active/accent, white on dark backgrounds.
          </>
        }
        visual={
          iconGuideUrl('Icons color use.jpg') ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={iconGuideUrl('Icons color use.jpg')} alt="Icon color use" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain', border: '1px solid #E4E7EC' }} />
            </div>
          ) : <div />
        }
      />
    </div>
  );
}

export function IconsResources() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="The library"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Search, switch between the 24px and 16px sets, and download any icon (SVG / PNG / JPEG) - or grab the whole set with Download all.</Lead>
      </Hero>
      <IconGallery />

      <div style={{ marginTop: 28 }}>
        <NeedIcon />
      </div>
    </div>
  );
}
