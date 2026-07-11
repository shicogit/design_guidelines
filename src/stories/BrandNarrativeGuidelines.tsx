import { type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Med } from './brandKit';

/* Brand Narrative - the story of Melio in words: mission, the difference, and more.
   Long-form editorial copy (not UI microcopy), written the Melio way: plain, warm,
   emphasis in medium weight (never bold in body), and a regular hyphen, never an em dash. */

// Shared two-column section: heading + left copy, grey narrative panel on the right.
function Section({ heading, left, children }: { heading: string; left: ReactNode; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 260px) 1fr',
        gap: 48,
        alignItems: 'start',
      }}
    >
      <div>
        <div style={{ fontSize: 26, fontWeight: 600, color: COLOR.ink, lineHeight: 1.3, margin: '0 0 20px' }}>
          {heading}
        </div>
        {left}
      </div>
      <div
        style={{
          background: COLOR.panel,
          borderRadius: RADIUS.xl,
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// A "Why / What / How" block with its own heading.
function Block({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 600, color: COLOR.ink, margin: '0 0 10px' }}>{heading}</div>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: COLOR.body, margin: 0 }}>{children}</p>
    </div>
  );
}

// A plain narrative paragraph inside a panel.
function P({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.75, color: COLOR.body, margin: 0 }}>{children}</p>;
}

// A personality trait: name on the left, description on the right.
function Trait({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 28, alignItems: 'start' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: COLOR.ink, lineHeight: 1.5 }}>{name}</div>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: COLOR.body, margin: 0 }}>{children}</p>
    </div>
  );
}

export function Principles() {
  return (
    <Section
      heading="Principles"
      left={
        <>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.body, margin: '0 0 16px' }}>
            Our mission is to keep small businesses in business - by making the way they pay and get paid simple,
            fast, and stress-free.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.ink, margin: 0, fontWeight: 600 }}>
            Business, made simpler.
          </p>
        </>
      }
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
        place, without losing sight of cash flow. The owner earning card rewards on rent, the bookkeeper juggling
        fifty vendors, the supplier waiting to get paid: Melio works for all of them.
      </Block>
      <Block heading="How">
        We believe managing money should feel calm, not daunting. So we pair smart technology with a clear, human
        experience - plain words, one obvious next step, and reassurance when it counts. We sweat the small details
        that make the ordinary feel cared for. And because we're on the owner's side, we design for fewer steps and
        no one ever feeling behind.
      </Block>
    </Section>
  );
}

export function MelioDifference() {
  return (
    <Section
      heading="The Melio Difference"
      left={
        <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.body, margin: 0 }}>
          Why small businesses are choosing Melio.
        </p>
      }
    >
      <P>
        We're the <Med>simplest way to handle business payments.</Med> Pay any bill any way you want - by card or
        bank transfer, even when your vendor only takes a check. They get paid however suits them, no new account
        needed.
      </P>
      <P>
        We put <Med>cash flow back in your control.</Med> Hold onto your money longer, put a big bill on a card to
        earn rewards, and schedule payments so nothing slips - all without draining the account.
      </P>
      <P>
        We're <Med>built for busy owners.</Med> Fewer steps, smart defaults, and a clear next move at every turn. No
        finance degree required, and never a moment that makes you feel behind.
      </P>
      <P>
        We <Med>fit the tools you already use.</Med> Melio syncs with accounting software like QuickBooks and Xero,
        so your books stay tidy without double entry or busywork.
      </P>
      <P>
        We've <Med>got your back.</Med> Real human support for the payments that matter most, and reassurance built
        into the moments that feel high-stakes.
      </P>
      <P>
        And we <Med>never stand still.</Med> Our team is always shipping new ways to pay and get paid, so the
        platform keeps getting simpler as your business grows.
      </P>
    </Section>
  );
}

export function BrandPersonality() {
  return (
    <Section
      heading="Brand Personality"
      left={
        <p style={{ fontSize: 16, lineHeight: 1.7, color: COLOR.body, margin: 0 }}>
          How we want the world to see us.
        </p>
      }
    >
      <Trait name="Warm">
        We sound like a helpful teammate, not a bank or a manual. Friendly, human, and on first-name terms - we meet
        small-business owners where they are and talk to them like people.
      </Trait>
      <Trait name="Clear">
        We'd rather be understood than admired. Plain words, one obvious next step, and nothing to decode. When
        money is involved, clarity is kindness.
      </Trait>
      <Trait name="Confident">
        We know our stuff, so we stay calm and steady - especially on the hard moments. Reassuring, never flashy or
        pushy. We lower the temperature instead of raising it.
      </Trait>
      <Trait name="On your side">
        We're always rooting for the owner. We design for fewer steps and helpful defaults, and we never make anyone
        feel behind. Your win is the whole point.
      </Trait>
      <Trait name="Human">
        Craft lives in the details - a well-timed animation, a friendly Mel, a tidy edge. We sweat the small things
        that make the ordinary feel cared for, so the brand feels like us even when no one can see the logo.
      </Trait>
    </Section>
  );
}
