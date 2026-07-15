import { FONT } from './brandKit';

const CARD_BG = '#FFFFFF';
const CARD_BORDER = '#E5E5EA';

const docs = (id: string) => `/?path=/docs/${id}`;

const CARDS = [
  {
    title: 'Illustrations',
    desc: "Mel, Melio's illustrated brand mascot, and the illustration kits.",
    href: docs('visuals-illustrations--docs'),
    thumb: 'thumbs/illustration.png',
  },
  {
    title: 'Icons',
    desc: "Melio's 300+ custom pixel-perfect icons, on 16px and 24px grids.",
    href: docs('identity-iconography--docs'),
    thumb: 'thumbs/icons.png',
  },
  {
    title: 'Simplified UI',
    desc: 'Simplified interfaces, reduced to support a given product message.',
    href: docs('visuals-simplified-ui--docs'),
    thumb: 'thumbs/simplified-ui.png',
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

export function VisualsCards() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 20,
        fontFamily: FONT,
      }}
    >
      {CARDS.map((c) => (
        <a
          key={c.title}
          href={c.href}
          target="_top"
          style={{
            background: CARD_BG,
            borderRadius: 16,
            padding: 18,
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            border: `1px solid ${CARD_BORDER}`,
            transition: 'border-color 120ms, background 120ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FAFAFB';
            e.currentTarget.style.borderColor = '#D9D9E0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = CARD_BG;
            e.currentTarget.style.borderColor = CARD_BORDER;
          }}
        >
          <img
            src={c.thumb}
            alt=""
            style={{
              width: '100%',
              aspectRatio: '16 / 10',
              objectFit: 'cover',
              borderRadius: 12,
              marginBottom: 16,
              display: 'block',
            }}
          />
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{c.title}</h3>
          <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: '#6B7280' }}>
            {c.desc}
          </p>
        </a>
      ))}
    </div>
  );
}
