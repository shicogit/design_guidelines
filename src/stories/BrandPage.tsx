import { useEffect, useRef, useState } from 'react';
import { FONT, COLOR, DsIcon } from './brandKit';

const PURPLE = COLOR.purple;

const topWindow = (): Window => {
  try { return window.top || window; } catch { return window; }
};
const getDeepParam = (name: string): string | null => {
  try { return new URLSearchParams(topWindow().location.search).get(name); } catch { return null; }
};
const setDeepParams = (updates: Record<string, string | null>) => {
  try {
    const w = topWindow();
    const url = new URL(w.location.href);
    for (const [k, v] of Object.entries(updates)) {
      if (v == null) url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    }
    w.history.replaceState(w.history.state, '', url.toString());
  } catch { /* cross-origin */ }
};

const SUGGESTION_THUMBS: Record<string, string> = {
  'identity-logo--docs': '/thumbs/logo.png',
  'identity-color--docs': '/thumbs/color.png',
  'identity-typography--docs': '/thumbs/type.png',
  'identity-motion--docs': '/thumbs/motion.png',
  'identity-visual-assets-illustrations--docs': '/thumbs/illustration.png',
  'identity-visual-assets-icons--docs': '/thumbs/icons.png',
  'identity-visual-assets-imagery--docs': '/thumbs/art-direction.png',
  'identity-visual-assets-simplified-ui--docs': '/thumbs/simplified-ui.png',
  'identity-visual-assets-agent-mel--docs': '/thumbs/agent-mel.png',
  'foundations-voice-tone--docs': '/thumbs/voice-tone.png',
};

const SUGGESTION_DESC: Record<string, string> = {
  'identity-logo--docs': 'Modes, colors and spacing rules',
  'identity-color--docs': 'Brand palette and design tokens',
  'identity-typography--docs': 'Typefaces for brand and product',
  'identity-motion--docs': 'Animation principles and tokens',
  'identity-visual-assets-illustrations--docs': 'Product illustration kits',
  'identity-visual-assets-icons--docs': '300+ icon library for product UI',
  'identity-visual-assets-simplified-ui--docs': 'Mini mock UI components',
  'identity-visual-assets-imagery--docs': 'Photography style and sourcing',
  'identity-visual-assets-agent-mel--docs': 'Animated AI agent character',
  'foundations-voice-tone--docs': 'Writing style and messaging',
  'foundations-principles--docs': 'Core brand values and approach',
};

const BRAND_IDS = new Set([
  'identity-logo--docs',
  'identity-color--docs',
  'identity-typography--docs',
  'identity-motion--docs',
  'identity-visual-assets-illustrations--docs',
  'identity-visual-assets-icons--docs',
  'identity-visual-assets-simplified-ui--docs',
  'identity-visual-assets-imagery--docs',
  'identity-visual-assets-agent-mel--docs',
]);

const NAV: { label: string; id: string }[] = [
  { label: 'Overview', id: 'overview--docs' },
  { label: 'Principles', id: 'foundations-principles--docs' },
  { label: 'Voice & Tone', id: 'foundations-voice-tone--docs' },
  { label: 'Logo', id: 'identity-logo--docs' },
  { label: 'Color', id: 'identity-color--docs' },
  { label: 'Typography', id: 'identity-typography--docs' },
  { label: 'Motion', id: 'identity-motion--docs' },
  { label: 'Illustrations', id: 'identity-visual-assets-illustrations--docs' },
  { label: 'Icons', id: 'identity-visual-assets-icons--docs' },
  { label: 'Simplified UI', id: 'identity-visual-assets-simplified-ui--docs' },
  { label: 'Imagery', id: 'identity-visual-assets-imagery--docs' },
  { label: 'Agent Mel', id: 'identity-visual-assets-agent-mel--docs' },
  { label: 'Spacing & Layout', id: 'standards-spacing-layout--docs' },
  { label: 'Accessibility', id: 'standards-accessibility--docs' },
  { label: 'Data Visualization', id: 'standards-data-visualization--docs' },
];


function Suggestions() {
  let currentId = '';
  try { currentId = new URLSearchParams(window.location.search).get('id') || ''; } catch { /* no-op */ }
  if (!BRAND_IDS.has(currentId)) return null;
  const others = NAV.filter((n) => BRAND_IDS.has(n.id) && n.id !== currentId);
  if (!others.length) return null;
  return (
    <div style={{ marginTop: 80, borderTop: '1px solid #ECECF1', paddingTop: 32 }}>
      <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#8A8A99', letterSpacing: 0.8, textTransform: 'uppercase', margin: '0 0 14px' }}>
        Explore more
      </p>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {others.map(({ id, label }) => {
          const thumb = SUGGESTION_THUMBS[id];
          const desc = SUGGESTION_DESC[id];
          return (
            <a
              key={id}
              href={`/?path=/docs/${id}`}
              target="_top"
              style={{ flex: '0 0 auto', width: 168, borderRadius: 12, border: '1px solid #ECECF1', textDecoration: 'none', overflow: 'hidden', background: '#FFFFFF', transition: 'border-color 120ms, box-shadow 120ms' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D9D9E0'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ECECF1'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: 90, background: '#F6F8FE', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {thumb ? (
                  <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: PURPLE, opacity: 0.18 }}>{label[0]}</span>
                )}
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3 }}>{label}</p>
                {desc && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#8A8A99', lineHeight: 1.4 }}>{desc}</p>}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}


type Crumb = { label: string; href?: string };

type Section = {
  label: string;
  guidelines?: React.ReactNode;
  resources?: React.ReactNode;
  developers?: React.ReactNode;
};

type Props = {
  title: string;
  crumbs?: Crumb[];
  intro?: string;
  guidelines?: React.ReactNode;
  resources?: React.ReactNode;
  developers?: React.ReactNode;
  tabs?: boolean;
  sections?: Section[];
};

type SubTab = 'guidelines' | 'resources' | 'developers';
const SUB_LABEL: Record<SubTab, string> = { guidelines: 'Guidelines', resources: 'Resources', developers: 'Developers' };

function Placeholder({ kind }: { kind: string }) {
  return (
    <p style={{ color: '#8A8A99', fontSize: 15, fontFamily: FONT, margin: '24px 0' }}>
      {kind} content for this brand element is coming soon.
    </p>
  );
}

export function Breadcrumb({ crumbs, current }: { crumbs?: Crumb[]; current?: string }) {
  if (!crumbs || crumbs.length === 0) return null;
  return (
    <nav style={{ fontSize: 13, color: '#8A8A99', margin: '0 0 10px', fontFamily: FONT }}>
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 7px', color: '#C7C7D1' }}>/</span>}
          {c.href ? (
            <a
              href={c.href.startsWith('?') ? `/${c.href}` : c.href}
              target="_top"
              style={{ color: '#8A8A99', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              {c.label}
            </a>
          ) : c.label}
        </span>
      ))}
      {current && (
        <>
          <span style={{ margin: '0 7px', color: '#C7C7D1' }}>/</span>
          <span style={{ color: '#6B7280' }}>{current}</span>
        </>
      )}
    </nav>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 500,
        width: 36, height: 36, borderRadius: '50%',
        background: COLOR.white, border: `1px solid ${COLOR.outline}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 120ms, box-shadow 120ms', fontFamily: FONT,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.14)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.white; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)'; }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2.5L2.5 8.5M8 2.5L13.5 8.5M8 2.5V14" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}


export function BrandPage({ title, crumbs, intro, guidelines, resources, developers, tabs = true, sections }: Props) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSec, setActiveSec] = useState(0);

  // ---- scroll spy (sections mode only) ----
  useEffect(() => {
    if (!sections) return;
    const onScroll = () => {
      const threshold = window.scrollY + 160;
      let next = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= threshold) next = i;
      });
      setActiveSec(next);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  // ---- notify manager sidebar which section is active ----
  useEffect(() => {
    if (!sections) return;
    try {
      window.parent?.postMessage(
        { type: 'melio:sectionchanged', sec: sections[activeSec].label },
        '*'
      );
    } catch { /* cross-origin */ }
  }, [activeSec, sections]);

  // ---- respond to sidebar clicks: scroll to the requested section ----
  useEffect(() => {
    if (!sections) return;
    const onMsg = (e: MessageEvent) => {
      if (e?.data?.type !== 'melio:setsection') return;
      const i = sections.findIndex(
        (s) => s.label.toLowerCase() === String(e.data.sec).toLowerCase()
      );
      if (i < 0) return;
      const el = sectionRefs.current[i];
      if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 24), behavior: 'smooth' });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [sections]);

  // ---- deep-link: scroll to section on mount ----
  useEffect(() => {
    if (!sections) return;
    const want = (getDeepParam('sec') || '').toLowerCase();
    if (!want) return;
    const i = sections.findIndex((s) => s.label.toLowerCase() === want);
    if (i > 0) {
      setTimeout(() => {
        const el = sectionRefs.current[i];
        if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 24), behavior: 'auto' });
      }, 80);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- legacy tab state (non-sections pages) ----
  const [tab, setTab] = useState<SubTab>(() => {
    const want = getDeepParam('sub');
    return want === 'resources' || want === 'developers' ? want : 'guidelines';
  });

  const seg = (active: boolean): React.CSSProperties => ({
    border: 'none', cursor: 'pointer',
    background: active ? '#FFFFFF' : 'transparent',
    color: active ? PURPLE : '#6B7280',
    fontWeight: 600, fontSize: 14,
    padding: '8px 18px', borderRadius: 8, fontFamily: FONT,
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
  });

  // ========== SECTIONS LAYOUT ==========
  if (sections) {
    return (
      <div style={{ fontFamily: FONT, color: '#1A1A1A' }}>
        <Breadcrumb crumbs={crumbs} current={title} />
        <h1 style={{ fontSize: 40, fontWeight: 600, margin: '0 0 8px' }}>{title}</h1>
        {intro && <p style={{ fontSize: 17, lineHeight: 1.6, color: '#4B4B57', margin: '0 0 36px' }}>{intro}</p>}

        <div>
          {sections.map((s, i) => (
            <div key={s.label}>
              {i > 0 && (
                <hr style={{ border: 'none', borderTop: '1px solid #ECECF1', margin: '64px 0' }} />
              )}
              <section
                ref={(el) => { sectionRefs.current[i] = el; }}
                aria-label={s.label}
              >
                {s.guidelines ?? <Placeholder kind={s.label} />}
              </section>
            </div>
          ))}
        </div>

        <Suggestions />
        <BackToTop />
      </div>
    );
  }

  // ========== SIMPLE LAYOUT (no sections) ==========
  const avail: SubTab[] = [
    'guidelines',
    ...(resources ? (['resources'] as SubTab[]) : []),
    ...(developers ? (['developers'] as SubTab[]) : []),
  ];
  const effTab: SubTab = avail.includes(tab) ? tab : avail[0] ?? 'guidelines';
  const showToggle = tabs && avail.length > 1;
  const simpleContent =
    !tabs ? guidelines
    : effTab === 'resources' ? resources
    : effTab === 'developers' ? developers
    : guidelines;

  useEffect(() => {
    setDeepParams({ sub: showToggle ? effTab : null });
  }, [effTab, showToggle]);

  return (
    <div style={{ fontFamily: FONT, color: '#1A1A1A', maxWidth: 1100 }}>
      <Breadcrumb crumbs={crumbs} current={title} />
      <h1 style={{ fontSize: 40, fontWeight: 600, margin: '0 0 8px' }}>{title}</h1>
      {intro && <p style={{ fontSize: 17, lineHeight: 1.6, color: '#4B4B57', margin: '0 0 20px' }}>{intro}</p>}
      {showToggle && (
        <div style={{ display: 'inline-flex', background: '#F3F3F6', borderRadius: 12, padding: 5, gap: 2, margin: '4px 0 8px' }}>
          {avail.map((k) => (
            <button key={k} style={seg(effTab === k)} onClick={() => setTab(k)}>
              {SUB_LABEL[k]}
            </button>
          ))}
        </div>
      )}
      <div>{simpleContent ?? <Placeholder kind="Guidelines" />}</div>
      <Suggestions />
      <BackToTop />
    </div>
  );
}
