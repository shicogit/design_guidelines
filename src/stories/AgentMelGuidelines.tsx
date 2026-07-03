import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import lottie from 'lottie-web';
import { FONT, COLOR, RADIUS, Body, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon, DownloadAllBanner, FigmaLogo, ResourceFooter } from './brandKit';
import { triggerDownload } from './downloadUtils';
/* Agent Mel is an ICON system (an animated app icon), kept separate from the illustration
   set - its assets live in src/assets/agent-mel and load through this local player.
   Rule on this page: never mix icons, illustrations, and product mocks in one container. */
const melMascotMods = import.meta.glob('../assets/mel-mascot.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const MEL_MASCOT = melMascotMods['../assets/mel-mascot.jpg'];

const agentMods = import.meta.glob('../assets/agent-mel/*.json', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const agentUrl = (name: string) => agentMods[`../assets/agent-mel/${name}.json`];

// Flat (non-transparent) videos - real H.264 files, so they play back perfectly smoothly.
const videoMods = import.meta.glob('../assets/agent-mel/*.{mp4,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const demoUrl = videoMods['../assets/agent-mel/agent-mel-demo.mp4'];
const riveUrl = videoMods['../assets/agent-mel/rive-icon-button-state-machine.mov'];

/** Looping Agent Mel animation (Lottie). Square by default; pass width/height for wide mocks.
   Uses the canvas renderer (much lighter than SVG for these many-layer files - the SVG renderer
   drops frames here, which shows up as the cursor "jumping" between positions) and gates playback
   to on-screen visibility so off-screen instances stay paused. */
function AgentAnim({
  url,
  size = 84,
  width,
  height,
  renderer = 'canvas',
  delay = 0,
  still = false,
}: {
  url?: string;
  size?: number;
  width?: number | string;
  height?: number | string;
  renderer?: 'svg' | 'canvas';
  delay?: number;
  /** Render a single frozen frame instead of looping (used as a still reference). */
  still?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!url || !el) return;
    const a = lottie.loadAnimation({
      container: el,
      renderer,
      loop: !still,
      autoplay: false,
      path: url,
      rendererSettings: { clearCanvas: true },
    });
    if (still) {
      a.addEventListener('DOMLoaded', () => a.goToAndStop(0, true));
      return () => a.destroy();
    }
    let started = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // First time on screen, hold off by `delay` so the row plays in a left-to-right ripple.
          if (!started) {
            started = true;
            timer = setTimeout(() => a.play(), delay);
          } else {
            a.play();
          }
        } else {
          a.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      io.disconnect();
      a.destroy();
    };
  }, [url, renderer, delay, still]);
  return <div ref={box} style={{ width: width ?? size, height: height ?? size }} />;
}

// A lilac tile holding one animation (its own container).
function Tile({ children, w, h }: { children: ReactNode; w: number; h: number }) {
  return (
    <div style={{ flex: '0 0 auto', width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.lilac100, borderRadius: RADIUS.lg }}>
      {children}
    </div>
  );
}

/** A standalone feature: a large visual (Rive component or product mock) beside its explanation. */
function FeatureRow({
  visual,
  title,
  text,
  align = 'center',
}: {
  visual: ReactNode;
  title: string;
  text: ReactNode;
  align?: 'center' | 'flex-start';
}) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: align, flexWrap: 'wrap', margin: '0 0 14px' }}>
      {visual}
      <div style={{ flex: '1 1 260px', minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: COLOR.ink, marginBottom: 4 }}>{title}</div>
        <Body style={{ margin: 0 }}>{text}</Body>
      </div>
    </div>
  );
}

/** Looping showcase video. Starts only once at least half of it is on screen (and pauses when it
   scrolls away). Controls stay hidden (no hover UI) and only appear on press. */
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

/** Agent Mel - Melio's AI agent. Visual language ported from the Notion Visual System. */
export function AgentMelGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="A familiar face for AI" visual={<AgentAnim url={agentUrl('spark-morph')} size={200} />}>
        <Lead style={{ margin: 0 }}>
          <Med>Agent Mel</Med> is a rounded-square, animated version of Mel - Melio's AI agent. Where most AI is shown
          as abstract sparks and gradients, Agent Mel brings a familiar, character-driven presence that's unmistakably
          Melio: warm, human, and approachable inside the chat experience.
        </Lead>
      </Hero>

      <SectionTitle sub="A quick look at Agent Mel in motion, across its states.">A first look</SectionTitle>
      <VideoClip src={demoUrl} />

      <SectionTitle sub="Mel, reshaped for AI - a technologic, app-like squircle, fused with the spark.">
        From mascot to AI agent
      </SectionTitle>
      <FeatureRow
        align="flex-start"
        visual={
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 88, height: 88, borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.lilac100 }}>
              {MEL_MASCOT
                ? <img src={MEL_MASCOT} alt="Mel mascot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DsIcon name="image-add" size={24} style={{ color: COLOR.faint }} /></div>
              }
            </div>
            <DsIcon name="arrow right" size={22} style={{ color: COLOR.muted }} />
            <div style={{ width: 88, height: 88 }}>
              <AgentAnim url={agentUrl('blink')} width="100%" height="100%" still />
            </div>
          </div>
        }
        title="From mascot to squircle"
        text="We took Mel, Melio's mascot, and reshaped it into a technologic, app-like squircle - a friendly, robot-ish form that feels at home inside an interface."
      />
      <FeatureRow
        align="flex-start"
        visual={
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 88, height: 88 }}>
              <AgentAnim url={agentUrl('blink')} width="100%" height="100%" />
            </div>
            <DsIcon name="add" size={22} style={{ color: COLOR.muted }} />
            <div style={{ width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 68, height: 68 }}>
                <AgentAnim url={agentUrl('spark-standalone')} width="100%" height="100%" />
              </div>
            </div>
          </div>
        }
        title="Fused with the spark"
        text={
          <>
            Then we fused it with the well-known <Med>spark</Med> and its magic touch, in Melio's brand colors - the
            result is <Med>Agent Mel</Med>: a recognizable face for AI that's unmistakably Melio.
          </>
        }
      />

      <SectionTitle>Vision &amp; purpose</SectionTitle>
      <Body>
        Humanize digital interactions - make the agent feel like a <Med>helpful companion</Med> rather than faceless
        technology, while reinforcing Melio's brand identity. It's a recognizable face for the AI, not a generic spark.
      </Body>

      <SectionTitle sub="A small repertoire of states and expressions keeps Agent Mel feeling alive and responsive.">
        Expressions &amp; states
      </SectionTitle>
      <div style={{ background: COLOR.lilac100, borderRadius: RADIUS.lg, padding: '12px 20px 20px', display: 'flex', gap: 8, justifyContent: 'center' }}>
        {([['blink', 'Blink'], ['look', 'Look'], ['yes', 'Yes'], ['no', 'No'], ['yay', 'Yay'], ['shock', 'Shock'], ['voice-listening', 'Listening']] as [string, string][]).map(([n, l]) => (
          <div key={n} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 132, aspectRatio: '1 / 1' }}>
              <AgentAnim url={agentUrl(n)} width="100%" height="100%" />
            </div>
            <span style={{ fontSize: 12, color: COLOR.muted, marginTop: -10 }}>{l}</span>
          </div>
        ))}
      </div>

      <SectionTitle>Tone &amp; personality</SectionTitle>
      <Body>Warm, approachable, and subtly playful - always active and engaged, the way a person responds in conversation.</Body>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, margin: '4px 0 8px' }}>
        <InfoCard icon={<DsIcon name="chat" size={16} style={{ color: COLOR.ink }} />} label="Tone" text="Friendly, empathetic, encouraging." />
        <InfoCard icon={<DsIcon name="play-circle-outline" size={16} style={{ color: COLOR.ink }} />} label="Behavior" text="Always present, never static." />
        <InfoCard icon={<DsIcon name="heart" size={16} style={{ color: COLOR.ink }} />} label="Emotion" text="Light and approachable - but never childish." />
      </div>

      <SectionTitle sub="Agent Mel morphs to communicate what it's doing - never a fixed icon.">
        Motion is the core principle
      </SectionTitle>
      <FeatureRow
        visual={<Tile w={264} h={210}><AgentAnim url={agentUrl('icon-button-hover')} size={112} /></Tile>}
        title="The interactive icon button"
        text="Agent Mel's icon button morphs as you interact with it. The looping preview here is a Lottie export of that motion."
      />

      <SectionTitle sub="Where you'll meet Agent Mel inside Melio - woven into real moments like the toolbar and loading states.">
        In the product
      </SectionTitle>
      <FeatureRow
        visual={<Tile w={400} h={210}><AgentAnim url={agentUrl('menu-icon-button')} width={340} height={158} /></Tile>}
        title="Menu entry point"
        text="In the toolbar, Agent Mel sits among the actions as a tappable menu icon - the way in to start a conversation."
      />
      <FeatureRow
        visual={<Tile w={400} h={210}><AgentAnim url={agentUrl('loader')} width={300} height={90} /></Tile>}
        title="Loading state"
        text={`While the agent works, a loading state keeps it present and reassuring - e.g. "Looking up the latest data...".`}
      />

      <SectionTitle sub={`The purple spark is the anchor of Mel's transformations - the "magic" of AI, always tied back to Mel as a character rather than an abstract effect.`}>
        The purple spark
      </SectionTitle>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {([['spark', 'Spark'], ['chat', 'Chat'], ['scan', 'Scan'], ['search', 'Search']] as [string, string][]).map(([n, l], i) => (
          <div key={n} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: '100%', maxWidth: 160, aspectRatio: '1 / 1' }}>
              <AgentAnim url={agentUrl(n)} width="100%" height="100%" delay={i * 400} />
            </div>
            <span style={{ fontSize: 12, color: COLOR.muted }}>{l}</span>
          </div>
        ))}
      </div>

      <SectionTitle sub="In the product the button isn't a fixed clip - it's a live Rive component, driven by a state machine that reacts to hover and press in real time.">
        Built in Rive
      </SectionTitle>
      <Body>
        Unlike the Lottie previews elsewhere on this page, the production icon button is a real-time <Med>Rive</Med>{' '}
        <Med>state machine</Med> - it follows interaction rather than playing a fixed timeline. Below is the actual state
        machine reacting to input.
      </Body>
      <VideoClip src={riveUrl} />
    </div>
  );
}

const ANIM_FILES: [string, string][] = [
  ['blink', 'Blink'], ['look', 'Look'], ['yes', 'Yes'], ['no', 'No'],
  ['yay', 'Yay'], ['shock', 'Shock'], ['voice-listening', 'Listening'],
];

// "Only this is an icon" - the menu entry point with real product icons, in its own group
const ICON_SPARK_FILES: [string, string][] = [
  ['spark-standalone', 'Spark standalone'],
];

const ICON_MORPH_FILES: [string, string][] = [
  ['spark-morph', 'Spark morph'],
  ['chat', 'Chat'],
  ['scan', 'Scan'],
  ['search', 'Search'],
  ['spark', 'Spark'],
];

const ICON_ICON_FILES: [string, string][] = [
  ['icon-button-hover', 'Icon button hover'],
];

const ICON_MOCKUP_FILES: [string, string][] = [
  ['menu-icon-button', 'Menu icon button'],
  ['loader', 'Loader'],
];

const ICON_ANIM_FILES: [string, string][] = [
  ...ICON_SPARK_FILES,
  ...ICON_MORPH_FILES,
  ...ICON_ICON_FILES,
  ...ICON_MOCKUP_FILES,
];

const ALL_ANIM_FILES: [string, string][] = [...ANIM_FILES, ...ICON_ANIM_FILES];

function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

async function copyLottiePng(src: string): Promise<void> {
  const div = document.createElement('div');
  div.style.cssText = 'width:400px;height:400px;position:fixed;left:-9999px;top:-9999px;';
  document.body.appendChild(div);
  await new Promise<void>((resolve) => {
    const anim = lottie.loadAnimation({ container: div, renderer: 'canvas', loop: false, autoplay: false, path: src });
    anim.addEventListener('DOMLoaded', () => {
      anim.goToAndStop(0, true);
      const canvas = div.querySelector('canvas');
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); } catch { /* denied */ }
          }
          anim.destroy();
          document.body.removeChild(div);
          resolve();
        }, 'image/png');
      } else {
        anim.destroy();
        document.body.removeChild(div);
        resolve();
      }
    });
  });
}

async function exportLottiePng(src: string, filename: string) {
  const div = document.createElement('div');
  div.style.cssText = 'width:400px;height:400px;position:fixed;left:-9999px;top:-9999px;';
  document.body.appendChild(div);
  await new Promise<void>((resolve) => {
    const anim = lottie.loadAnimation({ container: div, renderer: 'canvas', loop: false, autoplay: false, path: src });
    anim.addEventListener('DOMLoaded', () => {
      anim.goToAndStop(0, true);
      const canvas = div.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) triggerDownload(blob, filename);
          anim.destroy();
          document.body.removeChild(div);
          resolve();
        }, 'image/png');
      } else {
        anim.destroy();
        document.body.removeChild(div);
        resolve();
      }
    });
  });
}

export function AgentMelResources() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pngBusy, setPngBusy] = useState<Record<string, boolean>>({});
  const [cpBusy, setCpBusy] = useState<Record<string, boolean>>({});
  const [allBusy, setAllBusy] = useState(false);

  useEffect(() => {
    if (!openId) return;
    const close = () => setOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openId]);

  const handlePng = async (src: string, name: string) => {
    setOpenId(null);
    setPngBusy((b) => ({ ...b, [name]: true }));
    try {
      await exportLottiePng(src, `agent-mel-${name}.png`);
    } finally {
      setPngBusy((b) => ({ ...b, [name]: false }));
    }
  };

  const handleCopy = async (src: string, key: string) => {
    setOpenId(null);
    setCpBusy((b) => ({ ...b, [key]: true }));
    try {
      await copyLottiePng(src);
    } finally {
      setCpBusy((b) => ({ ...b, [key]: false }));
    }
  };

  const makeDownloadZip = (files: [string, string][], zipName: string, setBusy: (b: boolean) => void, busy: boolean) =>
    async () => {
      if (busy) return;
      setBusy(true);
      try {
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        await Promise.all(
          files.map(async ([name]) => {
            const src = agentUrl(name);
            if (!src) return;
            const res = await fetch(src);
            if (res.ok) zip.file(`agent-mel-${name}.json`, await res.arrayBuffer());
          })
        );
        const blob = await zip.generateAsync({ type: 'blob' });
        triggerDownload(blob, zipName);
      } finally {
        setBusy(false);
      }
    };

  const downloadAll = makeDownloadZip(ALL_ANIM_FILES, 'agent-mel-animations.zip', setAllBusy, allBusy);

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <DownloadAllBanner
        count={ALL_ANIM_FILES.length}
        format=".zip (JSON)"
        busy={allBusy}
        onDownload={downloadAll}
        label="Download all animations"
      />
      <SectionTitle sub="Download each Agent Mel animation in any format - Lottie JSON for web, PNG for stills, GIF and MOV coming soon.">
        Download animations
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {ANIM_FILES.map(([name, label]) => {
          const src = agentUrl(name);
          if (!src) return null;
          const isOpen = openId === name;
          const busy = pngBusy[name];
          return (
            <div key={name} style={{ borderRadius: RADIUS.lg, border: `1px solid ${COLOR.hairline}`, position: 'relative', cursor: 'pointer', transition: 'border-color 120ms' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.outline; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLOR.hairline; }} onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : name); }}>
              <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.lilac100, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, overflow: 'hidden' }}>
                <AgentAnim url={src} size={72} />
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : name); }}
                  disabled={busy}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 12px', background: busy ? COLOR.hover : COLOR.white, border: 'none', borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, cursor: busy ? 'default' : 'pointer', textAlign: 'left', boxSizing: 'border-box', opacity: busy ? 0.6 : 1 }}
                  onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = COLOR.hover; }}
                  onMouseLeave={(e) => { if (!busy) e.currentTarget.style.background = COLOR.white; }}
                >
                  <DownloadIcon size={11} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>{busy ? 'Exporting...' : label}</span>
                </button>
                  {isOpen && (
                    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: COLOR.white, border: `1px solid ${COLOR.hairline}`, borderRadius: RADIUS.md, boxShadow: '0 12px 32px rgba(20,20,40,0.18)', minWidth: 200, zIndex: 200, padding: 6 }}>
                      <div style={{ fontSize: 11, color: COLOR.faint, padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                        Download {label}
                      </div>
                      <a
                        href={src}
                        download={`agent-mel-${name}.json`}
                        onClick={() => setOpenId(null)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, textDecoration: 'none', borderRadius: 8, background: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        JSON
                        <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>Lottie</span>
                      </a>
                      <button
                        onClick={() => handlePng(src, name)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, boxSizing: 'border-box' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        PNG
                        <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>first frame</span>
                      </button>
                      <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                      <button
                        onClick={() => handleCopy(src, name)}
                        disabled={!!cpBusy[name]}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, background: 'transparent', border: 'none', cursor: cpBusy[name] ? 'default' : 'pointer', textAlign: 'left', borderRadius: 8, boxSizing: 'border-box' }}
                        onMouseEnter={(e) => { if (!cpBusy[name]) e.currentTarget.style.background = COLOR.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {cpBusy[name] ? 'Copied!' : 'Copy'}
                        <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>to clipboard</span>
                      </button>
                      <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.faint, borderRadius: 8, cursor: 'not-allowed' }}>
                        GIF <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 500, background: '#F1F1F4', borderRadius: 999, padding: '2px 7px' }}>soon</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.faint, borderRadius: 8, cursor: 'not-allowed' }}>
                        MOV alpha <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 500, background: '#F1F1F4', borderRadius: 999, padding: '2px 7px' }}>soon</span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {([
        { files: ICON_SPARK_FILES, group: 'The Spark' },
        { files: ICON_MORPH_FILES, group: 'Morph' },
        { files: ICON_ICON_FILES, group: 'Icons' },
        { files: ICON_MOCKUP_FILES, group: 'Mockups' },
      ] as { files: [string, string][]; group: string }[]).map(({ files, group }, i) => (
        <div key={group} style={{ marginBottom: 24, marginTop: i === 0 ? 24 : 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLOR.muted, letterSpacing: 0.7, textTransform: 'uppercase', margin: '0 0 10px', fontFamily: FONT }}>{group}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {files.map(([name, label]) => {
            const src = agentUrl(name);
            if (!src) return null;
            const isOpen = openId === `icon-${name}`;
            const busy = pngBusy[`icon-${name}`];
            return (
              <div key={name} style={{ borderRadius: RADIUS.lg, border: `1px solid ${COLOR.hairline}`, position: 'relative', cursor: 'pointer', transition: 'border-color 120ms' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLOR.outline; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLOR.hairline; }} onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : `icon-${name}`); }}>
                <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.lilac100, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, overflow: 'hidden' }}>
                  <AgentAnim url={src} size={72} />
                </div>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : `icon-${name}`); }}
                    disabled={busy}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 12px', background: busy ? COLOR.hover : COLOR.white, border: 'none', borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, cursor: busy ? 'default' : 'pointer', textAlign: 'left', boxSizing: 'border-box', opacity: busy ? 0.6 : 1 }}
                    onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = COLOR.hover; }}
                    onMouseLeave={(e) => { if (!busy) e.currentTarget.style.background = COLOR.white; }}
                  >
                    <DownloadIcon size={11} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{busy ? 'Exporting...' : label}</span>
                  </button>
                    {isOpen && (
                      <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: COLOR.white, border: `1px solid ${COLOR.hairline}`, borderRadius: RADIUS.md, boxShadow: '0 12px 32px rgba(20,20,40,0.18)', minWidth: 200, zIndex: 200, padding: 6 }}>
                        <div style={{ fontSize: 11, color: COLOR.faint, padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                          Download {label}
                        </div>
                        <a
                          href={src}
                          download={`agent-mel-${name}.json`}
                          onClick={() => setOpenId(null)}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, textDecoration: 'none', borderRadius: 8, background: 'transparent' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          JSON <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>Lottie</span>
                        </a>
                        <button
                          onClick={() => handlePng(src, `icon-${name}`)}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, boxSizing: 'border-box' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          PNG <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>first frame</span>
                        </button>
                        <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                        <button
                          onClick={() => handleCopy(src, `icon-${name}`)}
                          disabled={!!cpBusy[`icon-${name}`]}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.ink, background: 'transparent', border: 'none', cursor: cpBusy[`icon-${name}`] ? 'default' : 'pointer', textAlign: 'left', borderRadius: 8, boxSizing: 'border-box' }}
                          onMouseEnter={(e) => { if (!cpBusy[`icon-${name}`]) e.currentTarget.style.background = COLOR.hover; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          {cpBusy[`icon-${name}`] ? 'Copied!' : 'Copy'}
                          <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>to clipboard</span>
                        </button>
                        <div style={{ height: 1, background: COLOR.hairline, margin: '4px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.faint, borderRadius: 8, cursor: 'not-allowed' }}>
                          GIF <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 500, background: '#F1F1F4', borderRadius: 999, padding: '2px 7px' }}>soon</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 10px', fontSize: 14, fontWeight: 500, color: COLOR.faint, borderRadius: 8, cursor: 'not-allowed' }}>
                          MOV alpha <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 500, background: '#F1F1F4', borderRadius: 999, padding: '2px 7px' }}>soon</span>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}

      <ResourceFooter
        title="Need a new animation state?"
        body="Agent Mel's motion system and animation specs live in the DS Foundations Figma file. Reach out to the design team before creating new states or poses."
        links={[
          { label: 'DS Foundations', href: 'https://www.figma.com/design/G6zl0KicUc7ZOA4euH5VEs/🤍-DS-Foundations-🤍', icon: <FigmaLogo /> },
          { label: 'Animation brief', disabled: true },
        ]}
        contacts={[
          { name: 'Shira Giladi', role: 'Interaction Design', slack: 'https://xero.enterprise.slack.com/team/U037ZDWL2MA', image: '/contacts/shira.png' },
          { name: 'Isaac Sheptovitsky', role: 'Design System', slack: 'https://xero.enterprise.slack.com/team/U07UQDS31FV', image: '/contacts/isaac.png' },
        ]}
      />
    </div>
  );
}
