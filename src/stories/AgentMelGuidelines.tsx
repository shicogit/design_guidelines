import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import lottie from 'lottie-web';
import { FONT, COLOR, RADIUS, Body, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon, DownloadAllBanner, FigmaLogo, ResourceFooter } from './brandKit';
import { triggerDownload, DOWNLOADS_ENABLED } from './downloadUtils';
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

function SplitRow({
  visual,
  title,
  body,
  noDivider,
}: {
  visual: ReactNode;
  title: string;
  body: ReactNode;
  noDivider?: boolean;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 190px',
        gap: 36,
        padding: '36px 0',
        borderTop: noDivider ? undefined : `1px solid ${COLOR.hairline}`,
        alignItems: 'start',
      }}
    >
      <div>{visual}</div>
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px', lineHeight: 1.25 }}>
          {title}
        </h3>
        <div style={{ fontFamily: FONT, fontSize: 13, color: COLOR.body, lineHeight: 1.65 }}>{body}</div>
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

      <SplitRow
        visual={<VideoClip src={demoUrl} />}
        title="A first look"
        body="A quick look at Agent Mel in motion, across its states."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ width: 130, height: 130, borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.white }}>
              {MEL_MASCOT
                ? <img src={MEL_MASCOT} alt="Mel mascot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DsIcon name="image-add" size={24} style={{ color: COLOR.faint }} /></div>
              }
            </div>
            <DsIcon name="arrow right" size={24} style={{ color: COLOR.muted }} />
            <div style={{ width: 130, height: 130 }}>
              <AgentAnim url={agentUrl('blink')} width="100%" height="100%" still />
            </div>
          </div>
        }
        title="From mascot to squircle"
        body="We took Mel, Melio's mascot, and reshaped it into a technologic, app-like squircle - a friendly, robot-ish form that feels at home inside an interface."
      />

      <SplitRow
        noDivider
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ width: 130, height: 130 }}>
              <AgentAnim url={agentUrl('blink')} width="100%" height="100%" />
            </div>
            <DsIcon name="add" size={24} style={{ color: COLOR.muted }} />
            <div style={{ width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 100, height: 100 }}>
                <AgentAnim url={agentUrl('spark-standalone')} width="100%" height="100%" />
              </div>
            </div>
          </div>
        }
        title="Fused with the spark"
        body={
          <>
            Then we fused it with the well-known <Med>spark</Med> and its magic touch, in Melio's brand colors - the
            result is <Med>Agent Mel</Med>: a recognizable face for AI that's unmistakably Melio.
          </>
        }
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgentAnim url={agentUrl('yay')} size={160} />
          </div>
        }
        title="Vision & purpose"
        body={
          <>
            Humanize digital interactions - make the agent feel like a <Med>helpful companion</Med> rather than faceless
            technology, while reinforcing Melio's brand identity. A recognizable face for the AI, not a generic spark.
          </>
        }
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: '12px 16px 16px', display: 'flex', gap: 8, justifyContent: 'center' }}>
            {([['blink', 'Blink'], ['look', 'Look'], ['yes', 'Yes'], ['no', 'No'], ['yay', 'Yay'], ['shock', 'Shock'], ['voice-listening', 'Listening']] as [string, string][]).map(([n, l]) => (
              <div key={n} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: 100, aspectRatio: '1 / 1' }}>
                  <AgentAnim url={agentUrl(n)} width="100%" height="100%" />
                </div>
                <span style={{ fontSize: 11, color: COLOR.muted, marginTop: -8 }}>{l}</span>
              </div>
            ))}
          </div>
        }
        title="Expressions & states"
        body="A small repertoire of states and expressions keeps Agent Mel feeling alive and responsive."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.panel, borderRadius: 15, padding: 16, display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            <InfoCard icon={<DsIcon name="chat" size={16} style={{ color: COLOR.ink }} />} label="Tone" text="Friendly, empathetic, encouraging." />
            <InfoCard icon={<DsIcon name="play-circle-outline" size={16} style={{ color: COLOR.ink }} />} label="Behavior" text="Always present, never static." />
            <InfoCard icon={<DsIcon name="heart" size={16} style={{ color: COLOR.ink }} />} label="Emotion" text="Light and approachable - but never childish." />
          </div>
        }
        title="Tone & personality"
        body="Warm, approachable, and subtly playful - always active and engaged, the way a person responds in conversation."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgentAnim url={agentUrl('icon-button-hover')} size={112} />
          </div>
        }
        title="Motion is the core"
        body="Agent Mel morphs to communicate what it's doing - never a fixed icon. The interactive icon button morphs as you interact with it."
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgentAnim url={agentUrl('menu-icon-button')} width={340} height={158} />
          </div>
        }
        title="Menu entry point"
        body="In the toolbar, Agent Mel sits among the actions as a tappable menu icon - the way in to start a conversation."
      />

      <SplitRow
        noDivider
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgentAnim url={agentUrl('loader')} width={300} height={90} />
          </div>
        }
        title="Loading state"
        body={`While the agent works, a loading state keeps it present and reassuring - e.g. "Looking up the latest data...".`}
      />

      <SplitRow
        visual={
          <div style={{ background: COLOR.lilac100, borderRadius: 15, padding: '12px 16px 16px', display: 'flex', gap: 8, justifyContent: 'center' }}>
            {([['spark', 'Spark'], ['chat', 'Chat'], ['scan', 'Scan'], ['search', 'Search']] as [string, string][]).map(([n, l], i) => (
              <div key={n} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', maxWidth: 140, aspectRatio: '1 / 1' }}>
                  <AgentAnim url={agentUrl(n)} width="100%" height="100%" delay={i * 400} />
                </div>
                <span style={{ fontSize: 12, color: COLOR.muted }}>{l}</span>
              </div>
            ))}
          </div>
        }
        title="The purple spark"
        body="The purple spark is the anchor of Mel's transformations - the magic of AI, always tied back to Mel as a character rather than an abstract effect."
      />

      <SplitRow
        visual={<VideoClip src={riveUrl} />}
        title="Built in Rive"
        body={
          <>
            Unlike the Lottie previews elsewhere on this page, the production icon button is a real-time <Med>Rive</Med>{' '}
            <Med>state machine</Med> - it follows interaction rather than playing a fixed timeline.
          </>
        }
      />
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
      <Hero
        title="Agent Mel animations"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Lottie JSON files for all Agent Mel states - ready to drop into any product surface.</Lead>
      </Hero>
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
            <div key={name} style={{ borderRadius: RADIUS.lg, border: `1px solid ${COLOR.hairline}`, position: 'relative', cursor: DOWNLOADS_ENABLED ? 'pointer' : 'default', transition: 'border-color 120ms' }} onMouseEnter={DOWNLOADS_ENABLED ? (e) => { e.currentTarget.style.borderColor = COLOR.outline; } : undefined} onMouseLeave={DOWNLOADS_ENABLED ? (e) => { e.currentTarget.style.borderColor = COLOR.hairline; } : undefined} onClick={DOWNLOADS_ENABLED ? (e) => { e.stopPropagation(); setOpenId(isOpen ? null : name); } : undefined}>
              <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.lilac100, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, overflow: 'hidden' }}>
                <AgentAnim url={src} size={72} />
              </div>
              <div style={{ position: 'relative' }}>
                {DOWNLOADS_ENABLED ? (
                  <>
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
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 12px', background: COLOR.white, borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>{label}</span>
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
              <div key={name} style={{ borderRadius: RADIUS.lg, border: `1px solid ${COLOR.hairline}`, position: 'relative', cursor: DOWNLOADS_ENABLED ? 'pointer' : 'default', transition: 'border-color 120ms' }} onMouseEnter={DOWNLOADS_ENABLED ? (e) => { e.currentTarget.style.borderColor = COLOR.outline; } : undefined} onMouseLeave={DOWNLOADS_ENABLED ? (e) => { e.currentTarget.style.borderColor = COLOR.hairline; } : undefined} onClick={DOWNLOADS_ENABLED ? (e) => { e.stopPropagation(); setOpenId(isOpen ? null : `icon-${name}`); } : undefined}>
                <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.lilac100, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, overflow: 'hidden' }}>
                  <AgentAnim url={src} size={72} />
                </div>
                <div style={{ position: 'relative' }}>
                  {DOWNLOADS_ENABLED ? (
                    <>
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
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 12px', background: COLOR.white, borderTop: `1px solid ${COLOR.hairline}`, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, boxSizing: 'border-box' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
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
      />
    </div>
  );
}
