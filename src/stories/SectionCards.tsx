import { FONT, COLOR, RADIUS, Lead } from './brandKit';

const PURPLE = COLOR.purple;
const CARD_BG = COLOR.white;
const CARD_BORDER = COLOR.cardBorder;

type Card = {
  title: string;
  desc: string;
  href?: string; // Storybook docs path; omit for "coming soon"
  thumb: string; // image url under /thumbs
};

// Root-absolute so it resolves against the app (not the docs iframe).
const docs = (id: string) => `/?path=/docs/${id}`;

const CARDS: Card[] = [
  {
    title: 'Logo',
    desc: 'The knowledge needed to properly use the Melio logo and simplified logo.',
    href: docs('identity-logo--docs'),
    thumb: 'thumbs/logo.png',
  },
  {
    title: 'Color',
    desc: 'Primary, neutral and secondary color palettes used within the Melio brand.',
    href: docs('identity-color--docs'),
    thumb: 'thumbs/color.png',
  },
  {
    title: 'Typography',
    desc: 'Melio typeface that exemplifies the typographical brand signature.',
    href: docs('identity-typography--docs'),
    thumb: 'thumbs/type.png',
  },
  {
    title: 'Illustrations',
    desc: "Mel, Melio's illustrated brand mascot, and the illustration kits.",
    href: docs('visuals-illustrations--docs'),
    thumb: 'thumbs/illustration.png',
  },
  {
    title: 'Motion',
    desc: 'Animation principles, duration scale, easing, and choreography.',
    href: docs('identity-motion--docs'),
    thumb: 'thumbs/motion.png',
  },
  {
    title: 'Simplified UI',
    desc: 'Simplified interfaces to the minimum needed to support a given product message.',
    href: docs('visuals-simplified-ui--docs'),
    thumb: 'thumbs/simplified-ui.png',
  },
  {
    title: 'Icons',
    desc: "Melio's 300+ custom pixel-perfect icons.",
    href: docs('identity-iconography--docs'),
    thumb: 'thumbs/icons.png',
  },
  {
    title: 'Partners illustrations',
    desc: 'Default illustrations in three sizes with a 2-color palette (for Melio & partners).',
    href: docs('visuals-illustrations--docs'),
    thumb: 'thumbs/partners.png',
  },
  {
    title: 'Imagery',
    desc: 'Art direction and photography across the Melio brand.',
    href: docs('visuals-imagery--docs'),
    thumb: 'thumbs/art-direction.png',
  },
  {
    title: 'Mel in images',
    desc: 'Mel alongside real photography - in cities, offices, and branded environments.',
    href: docs('visuals-imagery--docs') + '&sec=Mel+in+images',
    thumb: 'thumbs/mel-in-images.png',
  },
  {
    title: 'Agent Mel',
    desc: "Melio's AI - Agent Mel's visual language.",
    href: docs('visuals-agent-mel--docs'),
    thumb: 'thumbs/agent-mel.png',
  },
];

export function SectionCards() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}
      >
      {CARDS.map((c) => {
        const inner = (
          <>
            <img
              src={c.thumb}
              alt=""
              style={{
                width: '100%',
                aspectRatio: '16 / 10',
                objectFit: 'cover',
                borderRadius: RADIUS.md,
                marginBottom: 16,
                display: 'block',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{c.title}</h3>
              {!c.href && (
                <span
                  style={{
                    fontSize: 11,
                    color: PURPLE,
                    background: COLOR.panel,
                    borderRadius: 20,
                    padding: '2px 8px',
                    fontWeight: 500,
                  }}
                >
                  Coming soon
                </span>
              )}
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: COLOR.muted }}>
              {c.desc}
            </p>
          </>
        );

        const cardStyle: React.CSSProperties = {
          background: CARD_BG,
          borderRadius: RADIUS.xl,
          padding: 18,
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          border: `1px solid ${CARD_BORDER}`,
          transition: 'border-color 120ms, background 120ms',
        };

        return c.href ? (
          <a
            key={c.title}
            href={c.href}
            target="_top"
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLOR.hover;
              e.currentTarget.style.borderColor = COLOR.outline;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = CARD_BG;
              e.currentTarget.style.borderColor = CARD_BORDER;
            }}
          >
            {inner}
          </a>
        ) : (
          <div key={c.title} style={cardStyle}>
            {inner}
          </div>
        );
      })}
      </div>
    </div>
  );
}
