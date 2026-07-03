import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared design tokens + primitives for the brand-guidelines pages.
 * Single source of truth - import from here instead of redefining FONT / colors /
 * SectionTitle / Body / Med in each page component.
 */

// ---------- Tokens ----------
export const FONT = '"Poppins", -apple-system, sans-serif';

export const COLOR = {
  purple: '#7849FF', // Primary / Purple - brand accent
  lilac100: '#F6F8FE', // surface tint + banner fill
  lilac200: '#EAEDFE', // Primary / Light Purple
  lilac300: '#D8DEFE', // banner outline
  lilac400: '#BDBDFF', // Primary / Violet
  ink: '#1A1A1A', // primary text
  body: '#4B4B57', // body text
  muted: '#6B7280', // secondary text
  faint: '#9AA0AA', // captions / labels
  hairline: '#ECECF1', // hairline divider / card border (subtle)
  cardBorder: '#E5E5EA', // card border
  panel: '#F8FAFC', // grey panel / card background
  hover: '#FAFAFB', // hover surface
  outline: '#D9D9E0', // button / hover outline
  white: '#FFFFFF',
} as const;

export const RADIUS = { sm: 8, md: 12, lg: 14, xl: 16 } as const;

// Vertical rhythm - use these so spacing is consistent across pages.
export const SPACE = { sectionTop: 32, blockBottom: 16, tight: 10 } as const;

// ---------- Inline text ----------
/** Medium-weight emphasis inside body text - same size/line-height, weight only. */
export const Med = ({ children }: { children: ReactNode }) => (
  <span style={{ fontWeight: 500, fontSize: 'inherit', lineHeight: 'inherit' }}>{children}</span>
);

/** Lead/intro paragraph (16px). */
export const Lead = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.body, margin: '0 0 12px', ...style }}>{children}</p>
);

/** Body paragraph (14px - the one body size). */
export const Body = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <p style={{ fontSize: 14, lineHeight: 1.7, color: COLOR.body, margin: '0 0 10px', ...style }}>{children}</p>
);

// ---------- Section heading ----------
/** Consistent section title (div-based - avoids Storybook docs' auto h2 underline). */
export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div style={{ margin: `${SPACE.sectionTop}px 0 12px` }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: COLOR.ink, lineHeight: 1.25 }}>{children}</div>
      {sub && <p style={{ fontSize: 14, color: COLOR.muted, margin: '6px 0 0', lineHeight: 1.6, maxWidth: 640 }}>{sub}</p>}
    </div>
  );
}

/** Smaller sub-heading (for "01 · Standard" style group titles). */
export function SubTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontSize: 16, fontWeight: 600, color: COLOR.ink, margin: '20px 0 8px', ...style }}>{children}</div>;
}

// ---------- Containers ----------
/** Grey panel that wraps swatch / specimen grids. */
export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: COLOR.panel, borderRadius: RADIUS.xl, padding: 16, ...style }}>{children}</div>;
}

/**
 * Lilac-100 info card (small): optional top node, optional icon left of the label, + text.
 * Rule: an icon and its title share a color - pass `labelColor` to match the icon
 * (purple icon → purple title, ink icon → ink title). Never a purple icon on an ink title.
 */
export function InfoCard({
  top,
  icon,
  label,
  text,
  labelColor = COLOR.ink,
}: {
  top?: ReactNode;
  icon?: ReactNode;
  label: string;
  text: string;
  labelColor?: string;
}) {
  return (
    <div style={{ background: COLOR.lilac100, borderRadius: RADIUS.md, padding: '16px 16px 14px' }}>
      {top && <div style={{ marginBottom: 8 }}>{top}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {icon}
        <div style={{ fontSize: 14, fontWeight: 600, color: labelColor }}>{label}</div>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: COLOR.body }}>{text}</p>
    </div>
  );
}

/**
 * Page hero - a square Lilac-100 panel (visual) on the left, title + intro on the right.
 * Wraps to stacked on narrow widths. Used at the top of each Brand Element page.
 */
export function Hero({ title, visual, children }: { title: string; visual: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', margin: '4px 0 20px' }}>
      <div
        style={{
          flex: '0 0 auto',
          width: 300,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: COLOR.lilac100,
          borderRadius: RADIUS.xl,
        }}
      >
        {visual}
      </div>
      <div style={{ flex: '1 1 280px' }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: COLOR.ink, marginBottom: 8 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

// ---------- DS icons ----------
// Every icon glyph in the Storybook comes from the Melio DS (Penny) icon set - never emoji
// or unicode arrows. `DsIcon` renders any icon by name, recolored to the current text color
// via a CSS mask (works for both fill- and stroke-based DS svgs).
const DS_ICON_URLS = import.meta.glob('../assets/icons/*/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
function dsIconUrl(name: string): string | undefined {
  return (
    DS_ICON_URLS[`../assets/icons/small/${name}.svg`] ||
    DS_ICON_URLS[`../assets/icons/large/${name}.svg`] ||
    DS_ICON_URLS[`../assets/icons/small/${name} Type=Outline.svg`] ||
    DS_ICON_URLS[`../assets/icons/large/${name} Type=Outline.svg`] ||
    DS_ICON_URLS[`../assets/icons/small/${name} Type=Fill.svg`] ||
    DS_ICON_URLS[`../assets/icons/large/${name} Type=Fill.svg`]
  );
}
export function DsIcon({ name, size = 16, style }: { name: string; size?: number; style?: CSSProperties }) {
  const url = dsIconUrl(name);
  if (!url) return null;
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url("${url}")`,
        maskImage: `url("${url}")`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...style,
      }}
    />
  );
}

/**
 * The Melio DS "download" icon (16px-grid version), drawn with `currentColor` so it inherits
 * the surrounding text color. Use this on every download affordance - never a unicode "↓".
 */
export function DownloadIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M7.45 10.76C7.51 10.81 7.58 10.85 7.64 10.89C7.79 10.97 7.89 10.99 8 10.99C8.11 10.99 8.21 10.97 8.3 10.93C8.43 10.85 8.49 10.81 8.54 10.76L11.3 7.76C11.58 7.45 11.56 6.98 11.25 6.7C10.95 6.42 10.47 6.44 10.19 6.75L8.74 8.33V1.75C8.74 1.34 8.4 1 7.99 1C7.58 1 7.24 1.34 7.24 1.75V8.32L5.79 6.74C5.51 6.44 5.04 6.41 4.73 6.69C4.42 6.97 4.4 7.44 4.68 7.75L7.45 10.76Z" fill="currentColor" />
      <path d="M14.25 9C13.84 9 13.5 9.34 13.5 9.75V12.75C13.5 13.16 13.16 13.5 12.75 13.5H3.25C2.84 13.5 2.5 13.16 2.5 12.75V9.75C2.5 9.34 2.16 9 1.75 9C1.34 9 1 9.34 1 9.75V12.75C1 13.99 2.01 15 3.25 15H12.75C13.99 15 15 13.99 15 12.75V9.75C15 9.34 14.66 9 14.25 9Z" fill="currentColor" />
    </svg>
  );
}

export function FigmaLogo({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 38 57" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

export type ResourceLink = {
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ResourceContact = { name: string; role: string; slack?: string; image?: string };

export function SlackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, opacity: 0, transition: 'opacity 0.15s' }}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#36C5F0"/>
      <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#36C5F0"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#2EB67D"/>
      <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#2EB67D"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#ECB22E"/>
      <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#ECB22E"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#E01E5A"/>
      <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
    </svg>
  );
}

export function ResourceFooter({ title, body, links, contacts }: { title: string; body: ReactNode; links: ResourceLink[]; contacts?: ResourceContact[] }) {
  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    borderRadius: 10, padding: '8px 16px 8px 12px',
    fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: FONT,
  };
  return (
    <div style={{ fontFamily: FONT, background: COLOR.lilac100, border: `1px solid ${COLOR.lilac300}`, borderRadius: RADIUS.lg, padding: '18px 20px', marginTop: 20 }}>
      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: COLOR.purple, display: 'flex', alignItems: 'center', gap: 7 }}>
        <DsIcon name="add-circle-outline" size={18} style={{ color: COLOR.purple, flexShrink: 0 }} />
        {title}
      </h3>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: COLOR.body, margin: '0 0 14px' }}>{body}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {links.map(({ label, href, icon, disabled }) =>
          disabled || !href ? (
            <span key={label} style={{ ...base, background: COLOR.panel, color: COLOR.faint, border: `1px solid ${COLOR.hairline}`, cursor: 'not-allowed' }}>
              {icon}
              {label}
              <span style={{ fontSize: 11, fontWeight: 500, background: '#F1F1F4', borderRadius: 999, padding: '1px 6px' }}>soon</span>
            </span>
          ) : (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{ ...base, background: COLOR.white, color: COLOR.ink, border: `1px solid ${COLOR.outline}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
            >
              {icon}
              {label}
            </a>
          )
        )}
      </div>
      {contacts && contacts.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ background: COLOR.white, borderTop: `1px solid ${COLOR.lilac300}`, borderRadius: '0 0 13px 13px', padding: '12px 20px 16px', marginLeft: -20, marginRight: -20, marginBottom: -18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.faint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, marginTop: 4 }}>Design team</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${contacts.length}, 1fr)`, gap: 8, width: 'fit-content' }}>
              {contacts.map(({ name, role, slack, image }) => {
                const initials = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2);
                const avatar = (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: COLOR.lilac200 }}>
                    {image
                      ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: COLOR.purple }}>{initials}</div>
                    }
                  </div>
                );
                const chipStyle: CSSProperties = {
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: COLOR.white, border: `1px solid ${COLOR.hairline}`,
                  borderRadius: 8, padding: '8px 12px', textDecoration: 'none',
                };
                const inner = (
                  <>
                    {avatar}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink, lineHeight: 1.3 }}>{name}</span>
                      <span style={{ fontSize: 11, color: COLOR.faint, lineHeight: 1.3 }}>{role}</span>
                    </div>
                    {slack && <SlackIcon size={16} />}
                  </>
                );
                return slack ? (
                  <a key={name} href={slack} target="_blank" rel="noreferrer" style={chipStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; const svg = e.currentTarget.querySelector('svg'); if (svg) (svg as HTMLElement).style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; const svg = e.currentTarget.querySelector('svg'); if (svg) (svg as HTMLElement).style.opacity = '0'; }}
                  >{inner}</a>
                ) : (
                  <div key={name} style={chipStyle}>{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DownloadAllBanner({
  count,
  format = '.zip',
  busy = false,
  onDownload,
  label = 'Download all',
}: {
  count?: number;
  format?: string;
  busy?: boolean;
  onDownload: () => void;
  label?: string;
}) {
  return (
    <div
      onClick={!busy ? onDownload : undefined}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        background: COLOR.white,
        border: `1px solid ${COLOR.outline}`,
        borderRadius: RADIUS.lg,
        marginBottom: 28,
        cursor: busy ? 'wait' : 'pointer',
        transition: 'background 0.12s',
        userSelect: 'none',
      }}
    >
      {busy
        ? <span style={{ fontSize: 13, color: COLOR.muted, fontFamily: FONT }}>Preparing…</span>
        : <>
            <DownloadIcon size={14} />
            <span style={{ fontSize: 14, fontWeight: 600, color: COLOR.ink, fontFamily: FONT }}>{label}</span>
            {count !== undefined && (
              <span style={{ fontSize: 12, color: COLOR.muted, fontFamily: FONT }}>
                {count} file{count !== 1 ? 's' : ''} &middot; {format}
              </span>
            )}
          </>
      }
    </div>
  );
}

