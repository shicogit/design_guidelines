import { type ReactNode } from 'react';
import { FONT, COLOR, Med, Lead, Body, DsIcon } from './brandKit';

/* Changelog - a running log of what changed in these guidelines, newest first.
   Kept current by the daily brand-skill sync, and updated by hand for bigger changes. */

type Entry = {
  date: string;
  title: string;
  tag: 'New' | 'Update' | 'Fix';
  items: string[];
};

const TAG_STYLE: Record<Entry['tag'], { c: string; b: string }> = {
  New: { c: '#1F9254', b: '#E7F6EC' },
  Update: { c: '#7849FF', b: '#EAEDFE' },
  Fix: { c: '#9A6700', b: '#FFF4D6' },
};

const ENTRIES: Entry[] = [
  {
    date: 'July 10, 2026',
    title: 'New "Writing" section',
    tag: 'New',
    items: [
      'New top-level "Writing" section in the sidebar, styled like Identity.',
      'Voice & Tone moved into Writing.',
      'New "Brand Narrative" page, starting with the Principles section: mission, plus the why, what, and how behind it.',
    ],
  },
  {
    date: 'July 10, 2026',
    title: 'Collaborators hub redesign',
    tag: 'Update',
    items: [
      'Download cards: each asset type now shows a visual preview (Lottie, logo strip, color swatch, icon grid, illustration) instead of a pill button.',
      'Color card: swatches are clickable mini cards - click to copy the hex value.',
      '"How we work" steps redesigned: numbered (1, 2, 3) with the number stacked above the title, no circle badges.',
      'All card descriptions trimmed to 2 lines max.',
      'Removed "The non-negotiables", "Before you hand off", and "Questions & approvals" sections.',
      'Partners illustration card now uses the local partners kit Lottie (accent recolored to partner brand).',
      'Logo card footers always white, even on the dark (White logo) card.',
    ],
  },
  {
    date: 'June 28, 2026',
    title: 'Site-wide visual alignment, Imagery, and Simplified UI',
    tag: 'Update',
    items: [
      'Voice & Tone: Do/Don\'t row colors updated to match the global green/red convention (#F2FAF5 / #FEF4F4).',
      'Imagery: page rewritten with real art-direction principles - subject, environment, color treatment, and a full Do/Don\'t set.',
      'Simplified UI: leveled up with "when to use," "how to do it," and a Do/Don\'t rule set.',
      'For Partners: "Download all" zip now includes all brand assets (fonts, logos, icons, illustrations, Agent Mel _mov alpha files).',
      'For Partners: cards wrapped in a grey container with a "Download all" header; "How we work" section moved above files.',
      'Sidebar: clicking a collapsed section now navigates to its first page; sections accordion (one open at a time).',
    ],
  },
  {
    date: 'June 26, 2026',
    title: 'Motion, spacing, principles, accessibility, and data viz',
    tag: 'New',
    items: [
      'New "Principles" page: the five beliefs that guide design decisions.',
      'New "Motion" page: principles, duration scale, easing, choreography, and reduced-motion guidance.',
      'New "Spacing & Layout" page: the 8-point grid, the spacing scale, and corner radii.',
      'New "Accessibility" page: the WCAG AA baseline and a pre-ship checklist.',
      'New "Data Visualization" page: the categorical palette and chart principles.',
    ],
  },
  {
    date: 'June 25, 2026',
    title: 'Foundations, voice, and a partner hub',
    tag: 'New',
    items: [
      'New "For Partners" page: a quick-start, a one-click starter-kit download, and every file in one place.',
      'New "Voice & Tone" page: personality, writing principles, and house style.',
      'Overview rewritten with brand foundations (who we\'re for, what we stand for) and section navigation cards.',
      'Color now shows live WCAG contrast pairings and a color-usage hierarchy.',
      'Agent Mel page rebuilt: the mascot-to-squircle story, expressions, in-product use, and the Rive build.',
    ],
  },
  {
    date: 'June 18, 2026',
    title: 'Typography and downloadable assets',
    tag: 'Update',
    items: [
      'PolySans (Standard, Mono, Wide) and Poppins available to download or link.',
      'Logo modes are downloadable, with a co-branding section.',
      'Icon and illustration galleries with per-asset and "download all" exports.',
    ],
  },
];

function Tag({ tag }: { tag: Entry['tag'] }) {
  const s = TAG_STYLE[tag];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: s.c, background: s.b, borderRadius: 999, padding: '2px 10px' }}>
      {tag}
    </span>
  );
}

function EntryCard({ e }: { e: Entry }) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: '0 0 130px', fontSize: 13, color: COLOR.muted, paddingTop: 2 }}>{e.date}</div>
      <div style={{ flex: '1 1 320px', minWidth: 0, borderLeft: `2px solid ${COLOR.lilac300}`, paddingLeft: 18, paddingBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{e.title}</div>
          <Tag tag={e.tag} />
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, color: COLOR.body, fontSize: 14, lineHeight: 1.7 }}>
          {e.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Wrap({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: FONT, color: COLOR.ink, maxWidth: 820 }}>{children}</div>;
}

export function ChangelogGuidelines() {
  return (
    <Wrap>
      <h1 style={{ fontSize: 30, fontWeight: 600, margin: '4px 0 12px' }}>What's new</h1>
      <Lead style={{ maxWidth: 640 }}>
        A running log of changes to the brand guidelines, newest first. Bigger changes are noted by hand; the smaller
        day-to-day sync keeps the rest current.
      </Lead>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 28px', fontSize: 13, color: COLOR.muted }}>
        <DsIcon name="refresh-circle-outline" size={15} style={{ color: COLOR.muted }} />
        <span>
          Reviewed daily. Last updated <Med>July 10, 2026</Med>.
        </span>
      </div>

      {ENTRIES.map((e) => (
        <EntryCard key={e.date} e={e} />
      ))}

      <Body style={{ fontSize: 13, color: COLOR.faint, marginTop: 8 }}>
        Spotted something out of date? Tell your Melio contact and we'll fix it.
      </Body>
    </Wrap>
  );
}
