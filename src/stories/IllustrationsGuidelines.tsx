import { useEffect, useRef, useState, type CSSProperties } from 'react';
import lottie from 'lottie-web';

const illustVideoMods = import.meta.glob('../assets/illustrations/*.mp4', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const productIlloKitUrl = illustVideoMods['../assets/illustrations/product-illo-kit.mp4'];

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
import { IllustrationGallery, entryToBlob, SETS, type SetKey } from './IllustrationGallery';
import { FONT, COLOR, RADIUS, Med, Lead, Body, SubTitle, Hero, DsIcon, SectionTitle, DownloadIcon, DownloadAllBanner, ResourceFooter } from './brandKit';
import { triggerDownload } from './downloadUtils';

// Aliases onto the shared palette - single source of truth lives in brandKit.
const LILAC_100 = COLOR.lilac100; // background tints + brand banners
const LILAC_200 = COLOR.lilac200;
const LILAC_300 = COLOR.lilac300; // subtle outline for banners
const PURPLE = COLOR.purple; // Brand-700 - primary brand accent

const FIGMA_BANK =
  'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/%F0%9F%A4%8D-DS-Foundations-%F0%9F%A4%8D?node-id=19761-2757';
const REQUESTING_ILLUSTRATIONS =
  'https://app.notion.com/p/meliopayments/Requesting-illustrations-1ac66d69640a8075b260c4d967a6cefb?source=copy_link';
const NOTION_FAVICON = 'https://www.google.com/s2/favicons?domain=notion.so&sz=64';

const illustGuidelineMods = import.meta.glob('../assets/guidelines/illustrations/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const illustGuideUrl = (name: string) => {
  const u = illustGuidelineMods[`../assets/guidelines/illustrations/${name}`];
  return u ? `${u}?v=2` : undefined;
};

// Melio product kit illustrations - fetched directly from the DS S3 (platform-static.meliopayments.com).
const MELIO_S3 = 'https://platform-static.meliopayments.com/assets/melio';
export const melioUrl = (name: string) => `${MELIO_S3}/${name}.lottie.json`;

const MELIO_NAMES = [
  'academy', 'add', 'add-card', 'add-user', 'announce', 'approval-workflows', 'approve',
  'bank', 'bank-success', 'blocked', 'calendar', 'camera', 'card', 'celebration',
  'construction', 'create-invoice', 'customer-add', 'customize', 'customize-invoice',
  'declined', 'discount', 'edit', 'error', 'expired', 'faq', 'fast', 'fun-fact', 'gift',
  'grow', 'invoice', 'missing', 'mobile', 'money-success', 'network-download', 'network-error',
  'network-pay', 'new-email', 'no-items', 'notification', 'page-not-found', 'paper-check',
  'pay', 'payment-link', 'payout-add', 'pending', 'processing', 'processing 2', 'product',
  'question', 'save-money', 'security', 'sent', 'set-up-account', 'single-use-card',
  'small-business', 'success', 'sync-accounts', 'sync-user', 'tax-form', 'troubleshooting',
  'under-review', 'upgrade-plan', 'user-approve', 'user-management', 'vendor-add', 'warning',
];
const melioMods: Record<string, string> = Object.fromEntries(
  MELIO_NAMES.map(name => [`${name}.lottie.json`, melioUrl(name)])
);

// Partners animations still load from local files (partner twins aren't in S3).
const partnersMods = import.meta.glob('../assets/illustrations/partners/*.json', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const partnersUrl = (name: string) => partnersMods[`../assets/illustrations/partners/${name}.json`];
const POINT_NAMES = { what: 'product', use: 'announce', where: 'faq' } as const;
const POINT_ANIMS: Record<'Melio' | 'Partners', { what?: string; use?: string; where?: string }> = {
  Melio: { what: melioUrl(POINT_NAMES.what), use: melioUrl(POINT_NAMES.use), where: melioUrl(POINT_NAMES.where) },
  Partners: {
    what: partnersUrl(POINT_NAMES.what),
    use: partnersUrl(POINT_NAMES.use),
    where: partnersUrl(POINT_NAMES.where),
  },
};

/** An animation that autoplays on a loop (default 96px); shows a placeholder when the twin isn't uploaded. */
export function MelAnim({ url, size = 96 }: { url?: string; size?: number }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!url || !box.current) return;
    const a = lottie.loadAnimation({ container: box.current, renderer: 'svg', loop: true, autoplay: true, path: url });
    return () => a.destroy();
  }, [url]);
  if (!url) {
    return (
      <div key="ph" style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={Math.round(size * 0.35)} height={Math.round(size * 0.35)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="#B6B9C2" strokeWidth="1.5" />
          <circle cx="8.5" cy="9.5" r="1.6" fill="#B6B9C2" />
          <path d="M4 18l5-5 3.5 3.5L16 12l4 4" stroke="#B6B9C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return <div key="anim" ref={box} style={{ width: size, height: size }} />;
}

// One of the three horizontal info cards inside a KitCard (carries a looping animation).
function KitPoint({ anim, label, text }: { anim?: string; label: string; text: string }) {
  return (
    <div style={{ background: LILAC_100, borderRadius: RADIUS.md, padding: '16px 14px', boxSizing: 'border-box', minHeight: 260 }}>
      <div style={{ marginBottom: 8 }}>
        <MelAnim url={anim} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLOR.ink, marginBottom: 4 }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: COLOR.body }}>{text}</p>
    </div>
  );
}

// Site logos sit at 24px inside link-out buttons.
function FigmaLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 38 57" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

type Kit = {
  badge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  what: string;
  use: string;
  where: string;
};

// A clickable kit header. Fill-only (no outline); the label is the whole header. Selecting switches the kit.
function KitHeader({ kit, active, onClick }: { kit: Kit; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: '1 1 0',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: RADIUS.md,
        padding: '14px 16px',
        border: 'none',
        background: active ? LILAC_200 : '#F1F1F4',
        fontFamily: FONT,
        fontSize: 16,
        fontWeight: 600,
        color: active ? PURPLE : COLOR.muted,
        transition: 'background 120ms, color 120ms',
      }}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.background = '#E9E9EE';
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.background = COLOR.hover;
      }}
    >
      {kit.badge}
    </button>
  );
}

type KitKey = 'Melio' | 'Partners';
const KIT_KEYS: KitKey[] = ['Melio', 'Partners'];

const KITS: Record<KitKey, Kit> = {
  Melio: {
    badge: 'Melio Kit',
    badgeBg: LILAC_200,
    badgeColor: PURPLE,
    title: 'Built around Mel',
    what: 'Mel-based and animated (Lottie) - black outline, neutral expression, many poses.',
    use: "Melio's own product & marketing: onboarding, empty states, success / error, education.",
    where: 'The DS Foundations Figma file - and browsable in the Resources tab.',
  },
  Partners: {
    badge: 'Partners Kit',
    badgeBg: '#EEF1F4',
    badgeColor: '#4B5563',
    title: 'Brand-agnostic',
    what: 'Brand-agnostic illustrations - no Mel, with two customizable colors so each partner applies their own brand.',
    use: "Partner & co-branded surfaces - matches the partner's identity, cohesive with our style.",
    where: 'The same DS Foundations Figma file - and browsable in the Resources tab.',
  },
};

// A few Mel character poses for the intro strip (from the Melio set).
const MEL_POSES = ['add-card', 'pay', 'bank', 'sent', 'security', 'gift'];

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

/** "Mel" intro tab - meet the mascot before diving into the kits. */
export function MelIntro() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="This is Mel" visual={<MelAnim url={melioUrl('upgrade-plan')} size={220} />}>
        <Lead style={{ margin: 0 }}>
          Mel is Melio's brand mascot - born in our 2022 rebrand and the heart of the illustration system. Mel is{' '}
          <Med>genderless and neither human nor animal</Med>: a simple, modern character whose job is to make complex
          payment moments feel friendlier and more human, across product, marketing, and the team itself.
        </Lead>
      </Hero>

      <SplitRow
        visual={(() => {
          const url = illustGuideUrl('01_This is Mel.png');
          return url ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={url} alt="This is Mel" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain' }} />
            </div>
          ) : <div />;
        })()}
        title="The character"
        body="A unique, imaginary character - genderless, expressionless, and nearly as recognizable as the logo itself."
      />

      <SplitRow
        noDivider
        visual={(() => {
          const url = illustGuideUrl('02_This is Mel.png');
          return url ? (
            <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
              <img src={url} alt="This is Mel" style={{ width: '100%', borderRadius: RADIUS.md, display: 'block', objectFit: 'contain' }} />
            </div>
          ) : <div />;
        })()}
        title="The anatomy"
        body="One black outline, white fill. Color enters through accent elements only - Mel's core form never changes."
      />


      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: RADIUS.xl, padding: 18, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 130px)', gap: 12 }}>
              {MEL_POSES.map((name) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MelAnim url={melioUrl(name)} size={130} />
                </div>
              ))}
            </div>
          </div>
        }
        title="Mel in motion"
        body="Built in After Effects and shipped as Lottie. Can loop continuously or play as a one-time animation."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={illustGuideUrl('Groups 04.png')} alt="Mel in product contexts" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
          </div>
        }
        title="Audiences"
        body="Mel shows up everywhere Melio does - product flows, marketing moments, and team touchpoints."
      />
      <SplitRow
        noDivider
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={illustGuideUrl('Groups 05.png')} alt="Mel persona variations" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
          </div>
        }
        title="Many faces"
        body="Mel is genderless at its core. When a specific personality or persona is needed, accessories, hairstyles, and headwear are the right way to express it."
      />
      <SplitRow
        noDivider
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={illustGuideUrl('Groups 07.png')} alt="Mel in professional personas" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
          </div>
        }
        title="Personas"
        body="Mel can dress the part - costumed versions for marketing campaigns, partner contexts, or character-driven moments."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              {([
                { n: 1, label: 'Correct character' },
                { n: 3, label: 'Brand colors' },
                { n: 5, label: 'Correct framing' },
              ] as const).map(({ n, label }) => {
                const url = illustGuideUrl(`Do’s & Don’ts 0${n}.png`);
                return url ? (
                  <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <img src={url} alt={label} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: 0 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
                      <DsIcon name="checked" size={12} style={{ color: '#1F9254', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{label}</span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        }
        title="Do's"
        body="Use the correct character, brand colors, and proper framing."
      />

      <SplitRow
        noDivider
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              {([
                { n: 2, label: 'No recoloring' },
                { n: 4, label: 'No modifications' },
                { n: 6, label: 'No distortion' },
              ] as const).map(({ n, label }) => {
                const url = illustGuideUrl(`Do’s & Don’ts 0${n}.png`);
                return url ? (
                  <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <img src={url} alt={label} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: 0 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
                      <DsIcon name="close" size={12} style={{ color: '#D64545', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#4B4B57', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{label}</span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        }
        title="Don'ts"
        body="Never recolor, modify, or distort Mel's form."
      />

      {([
        { n: 1, title: 'Email signatures', body: 'Mel in employee email signatures and internal digital touchpoints.' },
        { n: 2, title: 'Books & print', body: 'Branded books and print collateral.' },
        { n: 3, title: 'Office murals', body: 'Large-scale wall art throughout Melio offices.' },
        { n: 4, title: 'Events & swag', body: 'Internal events, social campaigns, and branded clothing.' },
        { n: 5, title: 'Stickers', body: 'Mel on laptop stickers and small-format branded items.' },
        { n: 6, title: 'Mel in the wild', body: 'Real-world appearances - Mel on office walls and at the office bar.' },
      ] as const).map(({ n, title, body }, i) => {
        const url = illustGuideUrl(`Usage 0${n}.png`);
        return url ? (
          <SplitRow
            key={n}
            noDivider={i > 0}
            visual={
              <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                <img src={url} alt={title} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
              </div>
            }
            title={title}
            body={body}
          />
        ) : null;
      })}

      {([
        { n: 1, title: 'melio.com', body: 'Mel on the Melio marketing website - illustrating how the product works for prospective users.' },
        { n: 2, title: 'Empty states', body: 'A friendly presence when there is nothing to show yet - keeps the screen alive.' },
        { n: 3, title: 'Setup', body: 'Mel guides users through onboarding and setup flows - a friendly presence in empty and first-use states.' },
        { n: 4, title: 'Email header', body: 'Mel anchors Melio email headers, making transactional messages feel warm and on-brand.' },
        { n: 5, title: 'Modals', body: 'Mel shows up in key product moments - upgrades, milestones, and important in-product notifications.' },
      ] as const).map(({ n, title, body }, i) => {
        const url = illustGuideUrl(`Product 0${n}.png`);
        return url ? (
          <SplitRow
            key={n}
            noDivider={i > 0}
            visual={
              <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                <img src={url} alt={title} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
              </div>
            }
            title={title}
            body={body}
          />
        ) : null;
      })}

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                const url = illustGuideUrl(`Compositions 0${n}.png`);
                return url ? (
                  <img key={n} src={url} alt={`Composition example ${n}`} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
                ) : null;
              })}
            </div>
          </div>
        }
        title="Compositions"
        body="Full-body, upper torso, and contextual prop arrangements - how Mel is framed within a layout."
      />

      {([
        { n: 1, title: 'Marketing site', body: 'Mel illustrations used across the Melio marketing site.' },
        { n: 3, title: 'Props', body: 'Mel holding objects to communicate specific messages - icons, symbols, and seasonal items that add context.' },
        { n: 8, title: 'Levels', body: 'Mel in three experience states - Baby, Pro, and Legend.' },
      ] as const).map(({ n, title, body }, i) => {
        const url = illustGuideUrl(`Groups 0${n}.png`);
        return url ? (
          <SplitRow
            key={n}
            noDivider={i > 0}
            visual={
              <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
                <img src={url} alt={title} style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
              </div>
            }
            title={title}
            body={body}
          />
        ) : null;
      })}

      <SplitRow
        noDivider
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16 }}>
            <img src={illustGuideUrl('Groups 06.png')} alt="Mel WhatsApp stickers" style={{ width: '100%', display: 'block', objectFit: 'contain', borderRadius: RADIUS.md }} />
          </div>
        }
        title="Internal comms"
        body="Mel also lives in team chats - a set of expressive WhatsApp stickers for internal Melio use."
      />

      {/* Agent Mel callout */}
      <div style={{
        background: LILAC_100,
        border: `1px solid ${LILAC_300}`,
        borderRadius: RADIUS.lg,
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <DsIcon name="ai-outline" size={16} style={{ color: PURPLE }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: PURPLE }}>Agent Mel</div>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: COLOR.body }}>
            For AI surfaces, Mel becomes a "squircle" app-icon paired with spark elements, animated to respond on hover, loading, and empty states - UI that communicates, not just decorates.
          </p>
        </div>
        <a
          href="?path=/docs/identity-agent-mel--docs"
          onClick={(e) => { e.preventDefault(); try { window.parent.location.search = '?path=/docs/identity-agent-mel--docs'; } catch { window.location.search = '?path=/docs/identity-agent-mel--docs'; } }}
          style={{ ...linkBtnStyle, flexShrink: 0, whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
        >
          Agent Mel page
        </a>
      </div>
    </div>
  );
}


function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        border: `1.5px dashed ${COLOR.outline}`,
        borderRadius: RADIUS.lg,
        padding: '40px 24px',
        textAlign: 'center',
        background: COLOR.panel,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: COLOR.ink, marginBottom: 6 }}>{title}</div>
      <p style={{ margin: '0 auto', maxWidth: 480, fontSize: 14, lineHeight: 1.6, color: COLOR.muted }}>{desc}</p>
    </div>
  );
}

/** Marketing section (placeholder until copy & assets are ready). */
export function MarketingGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Illustrations for marketing" visual={<MelAnim url={melioUrl('announce')} size={200} />}>
        <Lead style={{ margin: 0 }}>
          How illustration shows up across marketing - campaigns, social, and the website. Guidance and assets are on
          the way.
        </Lead>
      </Hero>
      <ComingSoon
        title="Marketing illustrations"
        desc="Guidance for marketing illustrations will live here - add the copy and assets when ready."
      />
    </div>
  );
}

/** Product section - the two kits + the live Melio/Partners gallery. */
export function ProductGuidelines() {
  const [set, setSet] = useState<KitKey>('Melio');
  const heroAnim = set === 'Partners' ? partnersUrl('fast') : melioUrl('approval-workflows');
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Built for Melio and partners" visual={<MelAnim url={heroAnim} size={200} />}>
        <Lead style={{ margin: 0 }}>
          Illustrations come in <Med>two kits</Med> - one for Melio's own surfaces, one for partners'. The{' '}
          <Med>Melio Kit</Med> is built around Mel in our purples; the <Med>Partners Kit</Med> drops Mel and takes two
          custom colors, so each partner applies their own brand.
        </Lead>
      </Hero>

      {/* Kit selector - two clickable headers; read one kit at a time (also drives the gallery) */}
      <div style={{ margin: '20px 0 24px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {KIT_KEYS.map((k) => (
            <KitHeader key={k} kit={KITS[k]} active={set === k} onClick={() => setSet(k)} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <KitPoint anim={POINT_ANIMS[set].what} label="What it is" text={KITS[set].what} />
          <KitPoint anim={POINT_ANIMS[set].use} label="When to use it" text={KITS[set].use} />
          <KitPoint anim={POINT_ANIMS[set].where} label="Where to find it" text={KITS[set].where} />
        </div>
      </div>

      {productIlloKitUrl && (
        <div style={{ marginBottom: 8 }}>
          <VideoClip src={productIlloKitUrl} />
        </div>
      )}

      {/* Placeholder sections - images and videos will be added to the guidelines folder */}
      <SectionTitle sub="Examples and context for how to use each illustration in product - images and videos coming soon.">
        In use
      </SectionTitle>
      <div
        style={{
          border: `1.5px dashed ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '40px 24px',
          textAlign: 'center',
          background: COLOR.panel,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: COLOR.ink, marginBottom: 6 }}>Images coming soon</div>
        <p style={{ margin: '0 auto', maxWidth: 480, fontSize: 14, lineHeight: 1.6, color: COLOR.muted }}>
          Upload product usage screenshots to the guidelines folder and they'll appear here automatically.
        </p>
      </div>
    </div>
  );
}

/** "Need a new illustration?" callout - reused at the bottom of Guidelines and in Resources. */
function NeedIllustration() {
  return (
    <div
      style={{
        fontFamily: FONT,
        background: LILAC_100,
        border: `1px solid ${LILAC_300}`,
        borderRadius: RADIUS.lg,
        padding: '18px 20px',
      }}
    >
      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: PURPLE }}>Need a new illustration?</h3>
      <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: COLOR.body }}>
        <Med>First, check the bank.</Med> Browse the existing illustrations and make sure what you need doesn't already
        exist before requesting a new one.
      </p>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: COLOR.body }}>
        Didn't find it? Request a new custom illustration through the team's <Med>Requesting illustrations</Med> process.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
        <a
          href={FIGMA_BANK}
          target="_blank"
          rel="noreferrer"
          style={linkBtnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
        >
          <FigmaLogo />
          Illustration bank
        </a>
        <a
          href={REQUESTING_ILLUSTRATIONS}
          target="_blank"
          rel="noreferrer"
          style={linkBtnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
        >
          <img src={NOTION_FAVICON} alt="" width={16} height={16} style={{ flexShrink: 0, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          Requesting illustrations
        </a>
      </div>
    </div>
  );
}

const linkBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: COLOR.white,
  color: COLOR.ink,
  border: `1px solid ${COLOR.outline}`,
  fontSize: 14,
  fontWeight: 500,
  textDecoration: 'none',
  padding: '8px 16px 8px 12px',
  borderRadius: 10,
  transition: 'background 120ms, border-color 120ms',
};

// ---------------------------------------------------------------------------
// Illustrations Resources tab
// ---------------------------------------------------------------------------

function IllustrationKitCard({
  id,
  label,
  previewUrl,
  count,
  zipName,
  mods,
  setKey,
  disabled = false,
  openId,
  setOpenId,
}: {
  id: string;
  label: string;
  previewUrl?: string;
  count: number;
  zipName: string;
  mods: Record<string, string>;
  setKey?: SetKey;
  disabled?: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [svgBusy, setSvgBusy] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isOpen = openId === id;

  const downloadZip = async () => {
    if (busy) return;
    setOpenId(null);
    setBusy(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      await Promise.all(
        Object.entries(mods).map(async ([path, url]) => {
          const filename = path.split('/').pop()!;
          const res = await fetch(url);
          zip.file(filename, await res.blob());
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, zipName);
    } catch (err) {
      console.error('zip failed', err);
    } finally {
      setBusy(false);
    }
  };

  const downloadSvgZip = async () => {
    if (!setKey || svgBusy) return;
    setOpenId(null);
    setSvgBusy(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      await Promise.all(
        Object.entries(SETS[setKey]).map(async ([name, entry]) => {
          const result = await entryToBlob(entry, 'svg', PURPLE);
          if (result) zip.file(`${name}.${result.ext}`, result.blob);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, zipName.replace('.zip', '-svg.zip'));
    } catch (err) {
      console.error('svg zip failed', err);
    } finally {
      setSvgBusy(false);
    }
  };

  return (
    <div
      onMouseEnter={() => { if (!disabled) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); if (!disabled && !busy && !svgBusy) setOpenId(isOpen ? null : id); }}
      style={{
        borderRadius: RADIUS.lg,
        border: `1px solid ${hovered && !disabled ? COLOR.outline : COLOR.hairline}`,
        position: 'relative',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'border-color 120ms',
      }}
    >
      <div
        style={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: LILAC_100,
          borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {disabled ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <DsIcon name="image-add" size={28} style={{ color: PURPLE, opacity: 0.4 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: PURPLE, opacity: 0.5 }}>Coming soon</span>
          </div>
        ) : (
          previewUrl && <MelAnim url={previewUrl} size={96} />
        )}
      </div>

      {disabled ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', background: COLOR.white, borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, opacity: 0.45 }}>
          <DownloadIcon size={11} />
          <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          {count > 1 && <span style={{ fontSize: 11, fontWeight: 500, color: COLOR.muted, background: COLOR.hover, borderRadius: 999, padding: '2px 7px', lineHeight: 1.5, flexShrink: 0 }}>{count}</span>}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : id); }}
            disabled={busy}
            style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 12px', background: (hovered || busy) ? COLOR.hover : COLOR.white, border: 'none', borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, cursor: busy ? 'default' : 'pointer', textAlign: 'left', boxSizing: 'border-box', opacity: busy ? 0.6 : 1, transition: 'background 120ms' }}
          >
            <DownloadIcon size={11} />
            <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{busy ? 'Zipping...' : label}</span>
            {count > 1 && <span style={{ fontSize: 11, fontWeight: 500, color: COLOR.muted, background: COLOR.hover, borderRadius: 999, padding: '2px 7px', lineHeight: 1.5, flexShrink: 0 }}>{count}</span>}
          </button>

            {isOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  background: COLOR.white,
                  border: `1px solid ${COLOR.hairline}`,
                  borderRadius: RADIUS.md,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  minWidth: 210,
                  zIndex: 200,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '8px 14px 6px',
                    borderBottom: `1px solid ${COLOR.hairline}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: COLOR.faint,
                      letterSpacing: 0.6,
                      textTransform: 'uppercase',
                    }}
                  >
                    DOWNLOAD {label.toUpperCase()}
                  </span>
                </div>
                {[
                  { key: 'svg', label: 'SVG', ext: 'vector · .zip', onClick: downloadSvgZip, isBusy: svgBusy, available: !!setKey },
                  { key: 'json', label: 'Lottie JSON', ext: 'animation · .zip', onClick: downloadZip, isBusy: busy, available: true },
                ].map(({ key, label, ext, onClick, isBusy, available }) => (
                  <button
                    key={key}
                    onClick={available && !isBusy ? onClick : undefined}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                      padding: '9px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: available ? COLOR.ink : COLOR.faint,
                      background: 'none',
                      border: 'none',
                      borderRadius: 8,
                      cursor: available && !isBusy ? 'pointer' : 'default',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { if (available && !isBusy) e.currentTarget.style.background = COLOR.hover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{isBusy ? 'Preparing…' : label}</span>
                    <span style={{ fontSize: 11, color: COLOR.muted, fontWeight: 400, flexShrink: 0 }}>{ext}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

export function IllustrationsResources() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [allBusy, setAllBusy] = useState(false);
  const [libSet, setLibSet] = useState<KitKey>('Melio');

  const melioPreviewUrl = Object.values(melioMods)[0];
  const partnersPreviewUrl = Object.values(partnersMods)[0];
  const melioCount = Object.keys(melioMods).length;
  const partnersCount = Object.keys(partnersMods).length;
  const allMods = { ...melioMods, ...partnersMods };

  useEffect(() => {
    if (!openId) return;
    const close = () => setOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openId]);

  const downloadAll = async () => {
    if (allBusy) return;
    setAllBusy(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      await Promise.all(
        Object.entries(allMods).map(async ([path, url]) => {
          const filename = path.split('/').pop()!;
          const res = await fetch(url);
          if (res.ok) zip.file(filename, await res.blob());
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, 'melio-illustration-kits.zip');
    } finally {
      setAllBusy(false);
    }
  };

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Download illustrations"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Full illustration kits for Melio and partner surfaces - available as Lottie JSON.</Lead>
      </Hero>
      <DownloadAllBanner
        count={melioCount + partnersCount}
        busy={allBusy}
        onDownload={downloadAll}
        label="Download all illustrations"
      />
      <SectionTitle sub="Download the full illustration kits for your project.">Illustration kits</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <IllustrationKitCard
          id="mel"
          label="Mel illustrations"
          count={0}
          zipName="mel-illustrations.zip"
          mods={{}}
          disabled
          openId={openId}
          setOpenId={setOpenId}
        />
      </div>
      <SectionTitle sub="Every illustration plays on loop. Click to download (SVG, PNG, JPEG, GIF, or Lottie JSON) or copy. Switch kits with the toggle; on Partners, pick a brand to recolor.">
        The library
      </SectionTitle>
      <IllustrationGallery set={libSet} onSetChange={setLibSet} />
      <div
        style={{
          background: COLOR.panel,
          borderRadius: RADIUS.md,
          padding: '14px 18px',
          margin: '16px 0 28px',
          fontSize: 14,
          lineHeight: 1.6,
          color: COLOR.body,
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 'inherit', lineHeight: 'inherit', color: COLOR.ink }}>Rule of thumb:</span> if it's a Melio surface, use the{' '}
        <Med>Melio Kit</Med> (with Mel). If it lives on a partner's surface, use the <Med>Partners Kit</Med>{' '}
        (recolored to their brand).
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color: COLOR.muted, letterSpacing: 0.7, textTransform: 'uppercase', margin: '20px 0 10px', fontFamily: FONT }}>Product kit</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <IllustrationKitCard
          id="melio"
          label="Melio"
          previewUrl={melioUrl('money-success') ?? melioPreviewUrl}
          count={melioCount}
          zipName="melio-product-illustrations.zip"
          mods={melioMods}
          setKey="Melio"
          openId={openId}
          setOpenId={setOpenId}
        />
        <IllustrationKitCard
          id="partners"
          label="Partners"
          previewUrl={partnersPreviewUrl}
          count={partnersCount}
          zipName="partners-product-illustrations.zip"
          mods={partnersMods}
          setKey="Partners"
          openId={openId}
          setOpenId={setOpenId}
        />
      </div>

      <ResourceFooter
        title="Need an illustration?"
        body={<>First, check the illustration library above or in <a href="https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/🤍-DS-Foundations-🤍" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>DS Foundations</a> - search before requesting. If it doesn't exist, go to <a href="https://app.notion.com/p/meliopayments/Requesting-illustrations-1ac66d69640a8075b260c4d967a6cefb?source=copy_link" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Notion</a> to add a request. Still got questions? Reach out to the design team - but please don't Slack or email before checking + adding to the list.</>}
        links={[
          { label: 'BD Foundations', href: 'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/🤍-DS-Foundations-🤍', icon: <FigmaLogo /> },
          { label: 'Request an illustration', href: 'https://app.notion.com/p/meliopayments/Requesting-illustrations-1ac66d69640a8075b260c4d967a6cefb?source=copy_link', icon: <img src={NOTION_FAVICON} alt="" width={16} height={16} style={{ flexShrink: 0, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> },
        ]}
        contacts={[
          { name: 'Shira Giladi', role: 'Interaction Design', slack: 'https://xero.enterprise.slack.com/team/U037ZDWL2MA', image: '/contacts/shira.png' },
          { name: 'Isaac Sheptovitsky', role: 'Design System', slack: 'https://xero.enterprise.slack.com/team/U07UQDS31FV', image: '/contacts/isaac.png' },
        ]}
      />
    </div>
  );
}
