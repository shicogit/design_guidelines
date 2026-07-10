import { type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Med } from './brandKit';

/* Brand Narrative - the story of Melio in words: mission, and the why / what / how
   behind it. Long-form editorial copy (not UI microcopy), written the Melio way:
   plain, warm, and with a regular hyphen, never an em dash. */

// One "Why / What / How" block inside the narrative panel.
function Block({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px' }}>{heading}</div>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: COLOR.body, margin: 0 }}>{children}</p>
    </div>
  );
}

function Principles() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 300px) 1fr',
        gap: 48,
        alignItems: 'start',
      }}
    >
      {/* Left: mission statement */}
      <div>
        <div style={{ fontSize: 26, fontWeight: 600, color: COLOR.ink, lineHeight: 1.3, margin: '0 0 20px' }}>
          Principles
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.body, margin: '0 0 16px' }}>
          Our mission is to keep small businesses in business - by making the way they pay and get paid simple,
          fast, and stress-free.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.ink, margin: 0, fontWeight: 600 }}>
          Business, made simpler.
        </p>
      </div>

      {/* Right: why / what / how panel */}
      <div
        style={{
          background: COLOR.panel,
          borderRadius: RADIUS.xl,
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <Block heading="Why">
          Small businesses are the backbone of the economy, but the money side is where they get stuck - bills to
          chase, invoices to send, cash flow to watch. It's manual, slow, and stressful. Melio exists to take that
          weight off their shoulders so they can get back to the work they actually care about. When paying and
          getting paid is easy, <Med>staying in business gets easier too.</Med>
        </Block>

        <Block heading="What">
          Melio is a B2B payments platform. Pay any business bill any way you want - by card or bank transfer, even
          when the other side only takes a check - and get paid the way that works for you. It all happens in one
          place, without losing sight of cash flow. The owner who wants to earn card rewards on rent, the bookkeeper
          juggling fifty vendors, the supplier waiting to get paid: Melio works for all of them.
        </Block>

        <Block heading="How">
          We believe managing money should feel calm, not daunting. So we pair smart technology with a clear, human
          experience - plain words, one obvious next step, and reassurance when it counts. We sweat the small
          details that make the ordinary feel cared for. And because we're on the owner's side, we design for fewer
          steps and no one ever feeling behind.
        </Block>
      </div>
    </div>
  );
}

export function BrandNarrativeGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Principles />
    </div>
  );
}
