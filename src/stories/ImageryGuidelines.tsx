import { useState, useEffect, type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Med, Lead, Body, InfoCard, Hero, DsIcon, ResourceFooter, SubTitle, DownloadIcon } from './brandKit';
import { triggerDownload } from './downloadUtils';

/* Imagery - art direction and photography for the Melio brand. Guidelines cover subject,
   environment, tone, color, and common mistakes - images are shown as placeholders since
   the originals are licensed/third-party. */

const imgMods = import.meta.glob('../assets/guidelines/imagery/*.{jpg,png}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const imgUrl = (name: string) => imgMods[`../assets/guidelines/imagery/${name}`];

const melNycMods = import.meta.glob('../assets/guidelines/imagery/mel-in-images/nyc/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const melTlvMods = import.meta.glob('../assets/guidelines/imagery/mel-in-images/tlv/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const officeNycMods = import.meta.glob('../assets/guidelines/imagery/mel-in-images/office-nyc/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const officeTlvMods = import.meta.glob('../assets/guidelines/imagery/mel-in-images/office-tlv/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function ImgOrPlaceholder({ file, alt, ratio = '4 / 3' }: { file: string; alt: string; ratio?: string }) {
  const url = imgUrl(file);
  return (
    <div style={{ borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.panel, aspectRatio: ratio, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {url
        ? <img src={url} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <DsIcon name="image-add" size={28} style={{ color: COLOR.faint }} />
            <span style={{ fontSize: 12, color: COLOR.faint, textAlign: 'center', padding: '0 12px' }}>{alt}</span>
          </div>
      }
    </div>
  );
}

function Rule({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: RADIUS.md, background: ok ? '#F2FAF5' : '#FEF4F4', border: `1px solid ${ok ? '#D4EDDA' : '#FAD4D4'}` }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 999, background: ok ? '#E7F6EC' : '#FDE8E8', color: ok ? '#1F9254' : '#D64545', flexShrink: 0, marginTop: 1 }}>
        <DsIcon name={ok ? 'checked' : 'close'} size={12} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: COLOR.body, fontWeight: 500 }}>{label}</div>
        {detail && <div style={{ fontSize: 13, color: COLOR.muted, marginTop: 2, lineHeight: 1.5 }}>{detail}</div>}
      </div>
    </div>
  );
}

// Section row: rich visual content on the left, section title + short description on the right.
// borderTop marks a section boundary; pass noDivider for rows that belong to the same group.
function SplitRow({ visual, title, body, noDivider = false }: { visual: ReactNode; title: string; body: ReactNode; noDivider?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 36, padding: '36px 0', borderTop: noDivider ? undefined : `1px solid ${COLOR.hairline}`, alignItems: 'start' }}>
      <div>{visual}</div>
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px', lineHeight: 1.25 }}>{title}</h3>
        <p style={{ fontFamily: FONT, fontSize: 13, color: COLOR.body, lineHeight: 1.65, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

function ImageryHero() {
  return (
    <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.lilac100, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, padding: 12, boxSizing: 'border-box' }}>
      {[COLOR.lilac200, '#D8E8D8', '#EAE0F8', COLOR.panel].map((bg, i) => (
        <div key={i} style={{ background: bg, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DsIcon name="image-add" size={22} style={{ color: COLOR.faint }} />
        </div>
      ))}
    </div>
  );
}

export function ImageryGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="Real people, real work" visual={<ImageryHero />}>
        <Lead>
          Melio's photography shows <Med>small-business owners in their element</Med> - working, not posing. Warm,
          genuine, and full of light.
        </Lead>
        <Lead style={{ margin: 0 }}>
          Images serve the brand by making Melio feel like it belongs in the real world of running a business, not in a
          stock-photo studio.
        </Lead>
      </Hero>

      <SplitRow
        title="Art direction principles"
        body="The qualities every Melio image should have."
        visual={
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <InfoCard icon={<DsIcon name="chat" size={16} style={{ color: COLOR.ink }} />} label="Authentic" text="Real business owners, real moments. No over-styled stock. The people look like they actually run a business." />
            <InfoCard icon={<DsIcon name="light-sun" size={16} style={{ color: COLOR.ink }} />} label="Warm and bright" text="Natural or natural-feeling light. Clean, optimistic, never dark or dramatic. The mood should be calm and forward-looking." />
            <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="In context" text="Subjects in their environment - a kitchen, a shop, a home office. The setting tells the story of their business." />
            <InfoCard icon={<DsIcon name="file" size={16} style={{ color: COLOR.ink }} />} label="Editorial over posed" text="Candid or near-candid moments over stiff, direct-camera poses. People at work, in motion, in thought." />
            <InfoCard icon={<DsIcon name="info" size={16} style={{ color: COLOR.ink }} />} label="Generous space" text="Clean, uncluttered backgrounds. Give the subject room to breathe. Busy scenes compete with the message." />
            <InfoCard icon={<DsIcon name="shield-check" size={16} style={{ color: COLOR.ink }} />} label="Diverse and inclusive" text="Melio's customers come from every background. Photography should reflect that without stereotyping industry or role." />
          </div>
        }
      />

      <SplitRow
        title="Subject and environment"
        body="The settings and subjects that feel on-brand."
        visual={
          <>
            <Body style={{ marginTop: 0 }}>
              Melio is for small businesses of all kinds. Photography should cover a range of industries -{' '}
              <Med>restaurants, retail, professional services, tradespeople, freelancers</Med> - and show them as
              equally valid. The common thread is a real person doing real work.
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, margin: '4px 0 8px' }}>
              <ImgOrPlaceholder file="subject-restaurant.jpg" alt="Restaurant owner in kitchen" />
              <ImgOrPlaceholder file="subject-retail.jpg" alt="Retail shop owner" />
              <ImgOrPlaceholder file="subject-office.jpg" alt="Professional in home office" />
              <ImgOrPlaceholder file="subject-trade.jpg" alt="Tradesperson on the job" />
            </div>
            <Body style={{ fontSize: 13, color: COLOR.faint, margin: 0 }}>
              Image placeholders - drop in licensed photography once available. Source from authentic stock libraries (e.g. Unsplash, Getty Editorial) or commission original photography.
            </Body>
          </>
        }
      />

      <SplitRow
        title="Color and treatment"
        body="Keep it natural and warm."
        visual={
          <>
            <Body style={{ marginTop: 0 }}>
              Prefer <Med>natural color grading</Med>: balanced exposure, warm whites, and no heavy saturation. The
              photos should feel like the moment looked - not like a filter was applied. Avoid desaturating to
              grey/black-and-white or adding a strong color wash.
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <Rule ok label="Natural warm tones, balanced exposure" detail="Feels like daylight. Clean and approachable." />
              <Rule ok label="Soft, diffused shadows" detail="No harsh directional flash. Light feels ambient." />
              <Rule ok={false} label="Heavy color grade or preset" detail="Mood filters, duotones, or teal-and-orange looks." />
              <Rule ok={false} label="Dark or low-key photography" detail="Reserved for developer / pro-persona content only." />
            </div>
          </>
        }
      />

      <SplitRow
        title="What to avoid"
        body="What never to do with Melio imagery."
        visual={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Rule ok={false} label="Generic stock cliches" detail="Handshakes, people staring at laptops with exaggerated smiles, diverse teams around a whiteboard - anything that feels like a stock search result." />
            <Rule ok={false} label="Busy or cluttered scenes" detail="Too much going on in the background. The subject should own the frame." />
            <Rule ok={false} label="Adding text directly onto photography" detail="Place text on a solid or gradient overlay, not straight onto a photo - contrast breaks down on busy shots." />
            <Rule ok={false} label="Lifestyle photography that ignores the business" detail="Beach sunsets and general 'living your best life' imagery. Melio is for work - show the work." />
            <Rule ok={false} label="Logos or products from competitors" detail="No competitor brand marks or clearly identifiable competitor interfaces visible in any shot." />
          </div>
        }
      />

      <SplitRow
        title="Photography and illustration together"
        body="How photography and illustration coexist."
        visual={
          <Body style={{ margin: 0 }}>
            Photography and Mel-based illustration can coexist in a layout, but <Med>not in the same frame</Med> - keep
            them in separate zones or separate assets. When a layout needs both, use a clear spatial separation (e.g.
            image on one side, illustration on the other, with a neutral background between them).
          </Body>
        }
      />

      <SplitRow
        title="Vendor and SMB image composition"
        body="Technical rules for placing vendor thumbnails and SMB images together."
        visual={
          <>
            <Body style={{ marginTop: 0 }}>
              The proportion between the vendor thumbnail and the SMB primary image is <Med>1:3 (width)</Med> and{' '}
              <Med>1:4 (height)</Med>. Never place a thumbnail at the top or bottom of the SMB image's vertical axis safe
              zone. When placing two vendor thumbnails, stagger them at different heights to create a balanced composition.
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '4px 0 8px' }}>
              {(['do-08.jpg', 'dont-08.jpg', 'do-09.jpg', 'dont-09.jpg'] as const).map((file) => {
                const url = imgUrl(file);
                const isOk = file.startsWith('do');
                return (
                  <div key={file} style={{ borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.panel }}>
                    {url
                      ? <img src={url} alt={`${isOk ? 'Do' : "Don't"}: vendor thumbnail composition`} style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
                      : <div style={{ aspectRatio: '4 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                          <DsIcon name="image-add" size={28} style={{ color: COLOR.faint }} />
                          <span style={{ fontSize: 12, color: COLOR.faint }}>{isOk ? 'Do' : "Don't"} example</span>
                        </div>
                    }
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '4px 0 8px' }}>
              <Rule ok label="Vendor thumbnail at 1/3 the width of the primary SMB image" detail="The size proportion anchors the hierarchy - vendor is supporting, SMB is primary." />
              <Rule ok={false} label="Vendor thumbnails without their rounded frame" detail="Always show the thumbnail inside its frame - never bare." />
              <Rule ok={false} label="Frame around primary SMB images" detail="Primary SMB images never get a container frame - only vendor thumbnails use frames." />
              <Rule ok={false} label="Vendor thumbnail floating without border intersection" detail="The thumbnail must overlap the primary image edge; never float separately beside it." />
            </div>
          </>
        }
      />

      <SplitRow
        title="Images and simplified UI"
        body="How to combine photography with simplified UI (Mini Mock) overlays."
        visual={
          <>
            <Body style={{ marginTop: 0 }}>
              When combining a simplified UI with a landscape image, its <Med>width should be 1/3 of the primary image's
              width</Med>. Place the mini-mock on any side except the top. Two simplified UIs on a single image should sit
              on opposing vertical edges at different heights for visual balance - never on the same edge.
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, margin: '4px 0 8px' }}>
              {(['image-with-mock.png', 'image-with-mock-1.png', 'image-with-mock-2.png', 'image-with-mock-3.png', 'image-with-2-mocks.png'] as const).map((file) => {
                const url = imgUrl(file);
                return url ? (
                  <div key={file} style={{ borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.panel }}>
                    <img src={url} alt="Image with simplified UI overlay" style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
                  </div>
                ) : null;
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '4px 0 8px' }}>
              <Rule ok label="Mini-mock at 1/3 the width of the primary image" />
              <Rule ok label="Place on any side of the image except the top edge" />
              <Rule ok={false} label="Don't center the simplified UI on the image" />
              <Rule ok={false} label="Don't place two simplified UIs on the same edge" detail="Use opposing edges at different heights for visual balance." />
            </div>
          </>
        }
      />

      <SplitRow
        title="SMB Badge"
        body="Accompanies every real Melio customer image in marketing, product, or internal uses."
        visual={
          <>
            <Body style={{ marginTop: 0 }}>
              The <Med>SMB Badge</Med> states the business name, owner name, and the year they joined Melio. It
              accompanies any image of a real Melio customer - marketing, product, or internal - as a promise to keep
              small business in business.
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '4px 0 8px' }}>
              <ImgOrPlaceholder file="smb-badge.png" alt="SMB Badge dimensions and edge positioning" ratio="4 / 3" />
              <ImgOrPlaceholder file="smb-badge-positioning.png" alt="SMB Badge on-image positioning" ratio="4 / 3" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '4px 0 8px' }}>
              <Rule ok label="Place the SMB Badge within the specified positioning zone" detail="Follow the on-image positioning diagram for correct placement." />
              <Rule ok={false} label="Don't place an SMB Badge outside its defined positioning zone" />
            </div>
          </>
        }
      />

      <div style={{ background: COLOR.lilac100, border: `1px solid ${COLOR.lilac300}`, borderRadius: RADIUS.md, padding: '14px 16px', marginTop: 36 }}>
        <Body style={{ margin: 0 }}>
          <Med>Art direction questions?</Med> Contact the design team before commissioning new photography.
          They can brief the photographer on these guidelines and approve selects before delivery.
        </Body>
      </div>
    </div>
  );
}

const CROP_POS: Record<string, string> = {
  // NYC — portrait images, Mel position varies
  'NY 01.png': 'top',
  'NY 02.png': 'bottom',
  'NY 03.png': 'bottom',
  'NY 04.png': 'center',
  'NY 05.png': 'center',
  // TLV — portrait images
  'TLV 01.png': 'center',
  'TLV 02.png': '30%',
  'TLV 03.png': 'bottom',
  'TLV 04.png': 'bottom',
  // Office NYC
  'Melio office NYC 01.png': 'center',
  'Melio office NYC 02.png': 'bottom',
  'Melio office NYC 03.png': 'center',
  // Office TLV
  'Melio office TLV 01.png': 'top right',
  'Melio office TLV 08.png': 'center',
  'Melio office TLV 10.png': 'center',
  'Melio office TLV 11.png': 'top',
  'Melio office TLV 12.png': 'center',
  'Melio office TLV 13.png': 'top',
  'Melio office TLV 17.png': 'top right',
  'Melio office TLV 18.png': 'top',
};

function MelImageCard({
  url, alt, id, openId, setOpenId, onPreview,
}: {
  url: string; alt: string; id: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onPreview: () => void;
}) {
  const isOpen = openId === id;
  const [hovered, setHovered] = useState(false);
  const objectPosition = CROP_POS[id.split('/').pop() || ''] ?? 'center';
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);

  const filename = decodeURIComponent(url.split('/').pop() || 'image.png');

  const download = async () => {
    if (downloading) return;
    setOpenId(null);
    setDownloading(true);
    try {
      const res = await fetch(url);
      triggerDownload(await res.blob(), filename);
    } finally { setDownloading(false); }
  };

  const copy = async () => {
    if (copying) return;
    setOpenId(null);
    setCopying(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch { /* clipboard denied */ }
    finally { setCopying(false); }
  };

  const rows = [
    { label: 'Preview', ext: 'full screen', action: () => { setOpenId(null); onPreview(); } },
    { label: downloading ? 'Downloading...' : 'Download', ext: '.png', action: download },
    { label: copying ? 'Copied!' : 'Copy', ext: 'to clipboard', action: copy },
  ];

  const label = filename.replace(/\.[^.]+$/, '');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : id); }}
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      {/* Image + hover overlay (clipped together) */}
      <div style={{
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid ${hovered || isOpen ? COLOR.outline : COLOR.hairline}`,
        transition: 'border-color 120ms',
      }}>
        <img src={url} alt={alt} style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4 / 3', objectPosition }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '36px 12px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'white',
          opacity: hovered || isOpen ? 1 : 0,
          transition: 'opacity 150ms',
          pointerEvents: 'none',
        }}>
          <DownloadIcon size={11} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        </div>
      </div>

      {/* Dropdown - outside overflow:hidden so it isn't clipped */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
            background: COLOR.white, border: `1px solid ${COLOR.hairline}`,
            borderRadius: RADIUS.md, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            minWidth: 210, zIndex: 200, overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px 14px 6px', borderBottom: `1px solid ${COLOR.hairline}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: COLOR.faint, letterSpacing: 0.6, textTransform: 'uppercase' as const }}>
              {label}
            </span>
          </div>
          {rows.map(({ label: rowLabel, ext, action }) => (
            <div
              key={rowLabel}
              onClick={(e) => { e.stopPropagation(); action(); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 12px', fontSize: 13, fontWeight: 500, color: COLOR.ink, cursor: 'pointer', borderRadius: 8 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{rowLabel}</span>
              <span style={{ fontSize: 11, color: COLOR.faint, fontWeight: 400 }}>{ext}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoGrid({
  mods, alt, openId, setOpenId, onPreview,
}: {
  mods: Record<string, string>; alt: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onPreview: (url: string) => void;
}) {
  const entries = Object.entries(mods);
  if (!entries.length) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {entries.map(([path, url], i) => (
        <MelImageCard
          key={path}
          id={path}
          url={url}
          alt={`${alt} ${i + 1}`}
          openId={openId}
          setOpenId={setOpenId}
          onPreview={() => onPreview(url)}
        />
      ))}
    </div>
  );
}

function MelInImagesHero() {
  const nycUrls = Object.values(melNycMods);
  const tlvUrls = Object.values(melTlvMods);
  const picks = [...nycUrls.slice(0, 2), ...tlvUrls.slice(0, 2)];
  return (
    <div style={{ width: 236, height: 236, borderRadius: RADIUS.lg, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
      {picks.map((url, i) => (
        <div key={i} style={{ overflow: 'hidden', borderRadius: RADIUS.md }}>
          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: i === 0 ? 'top' : 'center', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

export function MelInImages() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const close = () => setOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openId]);

  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <button
            onClick={() => setPreviewUrl(null)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: 999, width: 36, height: 36,
              color: 'white', fontSize: 20, lineHeight: 1,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}
          >
            &times;
          </button>
          <img
            src={previewUrl}
            onClick={(e) => e.stopPropagation()}
            alt="Preview"
            style={{
              maxWidth: '100%', maxHeight: '100%',
              borderRadius: RADIUS.lg,
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              display: 'block', objectFit: 'contain',
            }}
          />
        </div>
      )}

      <Hero title="Mel in images" visual={<MelInImagesHero />}>
        <Lead style={{ margin: 0 }}>
          Mel alongside real photography - in cities, offices, and branded environments. These images show the character living in the world.
        </Lead>
      </Hero>

      <SubTitle style={{ margin: '0 0 6px' }}>New York</SubTitle>
      <p style={{ fontSize: 14, color: COLOR.body, margin: '0 0 12px', lineHeight: 1.6 }}>
        Mel in the NYC environment - lifestyle photography featuring the illustrated character alongside real scenes.
      </p>
      <div style={{ margin: '0 0 32px' }}>
        <PhotoGrid mods={melNycMods} alt="Mel in NYC" openId={openId} setOpenId={setOpenId} onPreview={setPreviewUrl} />
      </div>

      <SubTitle style={{ margin: '0 0 6px' }}>Tel Aviv</SubTitle>
      <p style={{ fontSize: 14, color: COLOR.body, margin: '0 0 12px', lineHeight: 1.6 }}>
        Mel in the Tel Aviv environment - lifestyle photography featuring the illustrated character alongside real scenes.
      </p>
      <div style={{ margin: '0 0 32px' }}>
        <PhotoGrid mods={melTlvMods} alt="Mel in TLV" openId={openId} setOpenId={setOpenId} onPreview={setPreviewUrl} />
      </div>

      <SubTitle style={{ margin: '0 0 6px' }}>Melio office - New York</SubTitle>
      <p style={{ fontSize: 14, color: COLOR.body, margin: '0 0 12px', lineHeight: 1.6 }}>
        Mel in the NYC office - murals, wall art, and branded environments.
      </p>
      <div style={{ margin: '0 0 32px' }}>
        <PhotoGrid mods={officeNycMods} alt="Melio NYC office" openId={openId} setOpenId={setOpenId} onPreview={setPreviewUrl} />
      </div>

      <SubTitle style={{ margin: '0 0 6px' }}>Melio office - Tel Aviv</SubTitle>
      <p style={{ fontSize: 14, color: COLOR.body, margin: '0 0 12px', lineHeight: 1.6 }}>
        Mel in the TLV office - murals, wall art, and branded environments.
      </p>
      <div style={{ margin: '0 0 8px' }}>
        <PhotoGrid mods={officeTlvMods} alt="Melio TLV office" openId={openId} setOpenId={setOpenId} onPreview={setPreviewUrl} />
      </div>
    </div>
  );
}

export function ImageryResources() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero
        title="Photography resources"
        visual={<DsIcon name="download" size={144} style={{ color: COLOR.purple }} />}
      >
        <Lead style={{ margin: 0 }}>Sourcing guides, brief templates, and contacts for licensed, on-brand photography.</Lead>
      </Hero>
      <ResourceFooter
        title="Photography sourcing"
        body={<>Melio's photography must be licensed, authentic, and approved before use. Source from stock libraries or commission original photography - always brief against these guidelines. <Med>Contact the design team</Med> before commissioning; they review and approve image selects before delivery.</>}
        links={[
          { label: 'Stock library', disabled: true },
          { label: 'Photo brief template', disabled: true },
        ]}
        contacts={[
          { name: 'Shira Giladi', role: 'Interaction Design', slack: 'https://xero.enterprise.slack.com/team/U037ZDWL2MA', image: '/contacts/shira.png' },
          { name: 'Isaac Sheptovitsky', role: 'Design System', slack: 'https://xero.enterprise.slack.com/team/U07UQDS31FV', image: '/contacts/isaac.png' },
        ]}
      />
    </div>
  );
}
