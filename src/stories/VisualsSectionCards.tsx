import { FONT, COLOR, RADIUS } from './brandKit';

const CARD_BG = COLOR.white;
const CARD_BORDER = COLOR.cardBorder;

type Card = { title: string; desc: string; href?: string; thumb: string };

// Root-absolute so it resolves against the app (not the docs iframe).
const docs = (id: string) => `/?path=/docs/${id}`;

const CARDS: Card[] = [
  {
    title: 'Simplified UI',
    desc: 'Simplified interfaces reduced to the minimum needed to support a product message.',
    href: docs('visuals-simplified-ui--docs'),
    thumb: 'thumbs/visuals/simplified-ui.png',
  },
  {
    title: 'SMB badge',
    desc: 'The small-business badge and how to use it.',
    thumb: 'thumbs/visuals/smb-badge.png',
  },
  {
    title: 'Portrait imagery',
    desc: 'Portrait photography style and treatment.',
    href: docs('visuals-imagery--docs'),
    thumb: 'thumbs/visuals/portrait-imagery.png',
  },
  {
    title: 'Objects imagery',
    desc: 'Object and still-life photography style.',
    href: docs('visuals-imagery--docs'),
    thumb: 'thumbs/visuals/objects-imagery.png',
  },
  {
    title: 'Mel in images',
    desc: 'Mel alongside real photography, in cities, offices, and branded environments.',
    href: docs('visuals-imagery--docs') + '&sec=Mel+in+images',
    thumb: 'thumbs/visuals/mel-in-images.png',
  },
  {
    title: 'Mel',
    desc: "Melio's illustrated brand mascot.",
    href: docs('visuals-illustrations--docs'),
    thumb: 'thumbs/visuals/mel.png',
  },
  {
    title: 'Melio product kit',
    desc: 'The Melio illustration kit, built around Mel.',
    href: docs('visuals-product-kit--docs'),
    thumb: 'thumbs/visuals/melio-kit.png',
  },
  {
    title: 'Partners product kit',
    desc: "The Partners kit, recolorable to any partner's brand.",
    href: docs('visuals-product-kit--docs'),
    thumb: 'thumbs/visuals/partners-kit.png',
  },
];

export function VisualsSectionCards() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {CARDS.map((c) => {
          const inner = (
            <>
              <img
                src={c.thumb}
                alt=""
                style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: RADIUS.md, marginBottom: 16, display: 'block' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{c.title}</h3>
                {!c.href && (
                  <span style={{ fontSize: 11, color: COLOR.purple, background: COLOR.panel, borderRadius: 20, padding: '2px 8px', fontWeight: 500 }}>
                    Coming soon
                  </span>
                )}
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: COLOR.muted }}>{c.desc}</p>
            </>
          );
          const cardStyle: React.CSSProperties = {
            background: CARD_BG, borderRadius: RADIUS.xl, padding: 18, textDecoration: 'none',
            color: 'inherit', display: 'block', border: `1px solid ${CARD_BORDER}`,
            transition: 'border-color 120ms, background 120ms',
          };
          return c.href ? (
            <a
              key={c.title}
              href={c.href}
              target="_top"
              style={cardStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; e.currentTarget.style.borderColor = COLOR.outline; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = CARD_BG; e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              {inner}
            </a>
          ) : (
            <div key={c.title} style={cardStyle}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
