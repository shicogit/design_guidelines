import { type ReactNode } from 'react';
import { FONT, COLOR, RADIUS, Med, Lead, SectionTitle, InfoCard, Hero, DsIcon } from './brandKit';

const tovMods = import.meta.glob('../assets/guidelines/tone-of-voice/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const tovUrl = (name: string) => tovMods[`../assets/guidelines/tone-of-voice/${name}`];

/* Voice & Tone - how Melio sounds in writing. Plain language, written the way we ask
   everyone to write: short, human, and with a regular hyphen, never an em dash. */

function VoiceHero() {
  return (
    <div
      style={{
        width: 236,
        height: 236,
        borderRadius: RADIUS.lg,
        background: COLOR.purple,
        color: COLOR.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 6,
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>“Let's pay that bill.”</div>
      <div style={{ fontSize: 14, opacity: 0.85 }}>Clear, human, and on your side.</div>
    </div>
  );
}

// A do / don't example pair.
function Swap({ dont, doIt }: { dont: string; doIt: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
      <Line ok={false} text={dont} />
      <Line ok text={doIt} />
    </div>
  );
}

function Line({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        background: ok ? '#F2FAF5' : '#FEF4F4',
        border: `1px solid ${ok ? '#D4EDDA' : '#FAD4D4'}`,
        borderRadius: RADIUS.md,
        padding: '12px 14px',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: 999,
          background: ok ? '#E7F6EC' : '#FDE8E8',
          color: ok ? '#1F9254' : '#D64545',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <DsIcon name={ok ? 'checked' : 'close'} size={12} />
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.5, color: COLOR.body }}>{text}</span>
    </div>
  );
}

function Principle({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <InfoCard icon={icon} label={title} text={text} />;
}

export function VoiceToneGuidelines() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <Hero title="How Melio sounds" visual={<VoiceHero />}>
        <Lead style={{ margin: 0 }}>
          We talk to small-business owners like a <Med>helpful teammate</Med>, not a bank or a manual. Warm, clear, and
          confident. The words matter as much as the visuals: they are how the brand feels when no one can see the logo.
        </Lead>
      </Hero>

      <SectionTitle sub="Four traits that describe the Melio voice, wherever it shows up.">Personality</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Principle
          icon={<DsIcon name="chat" size={16} style={{ color: COLOR.ink }} />}
          title="Human"
          text="We sound like a person, not a system. Plain words, short sentences, real warmth."
        />
        <Principle
          icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />}
          title="Clear"
          text="We get to the point. No jargon, no filler, no hedging. Say the useful thing first."
        />
        <Principle
          icon={<DsIcon name="heart" size={16} style={{ color: COLOR.ink }} />}
          title="Encouraging"
          text="Money is stressful. We're calm and reassuring, and we never make anyone feel behind."
        />
        <Principle
          icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />}
          title="Confident"
          text="We know our stuff and we keep it simple. Confident, never flashy or pushy."
        />
      </div>

      <SectionTitle sub="The rules of thumb behind every line we write.">Writing principles</SectionTitle>
      <ul style={{ fontSize: 14, lineHeight: 1.9, color: COLOR.body, margin: 0, paddingLeft: 20 }}>
        <li>
          <Med>Write in plain English.</Med> If a simpler word works, use it. Skip jargon and acronyms.
        </li>
        <li>
          <Med>Use active voice.</Med> "Melio sent the payment," not "the payment was sent."
        </li>
        <li>
          <Med>Lead with the useful part.</Med> Put the answer or the action first, the detail after.
        </li>
        <li>
          <Med>Stay positive.</Med> Say what someone can do, not what they can't.
        </li>
        <li>
          <Med>Talk to one person.</Med> "You," not "users." Speak to the business owner in front of you.
        </li>
        <li>
          <Med>Match the moment.</Med> Lighten up on a success screen, slow down and reassure on an error.
        </li>
      </ul>

      <SectionTitle sub="Same message, written two ways.">Do this, not that</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Swap
          dont="Utilize Melio to facilitate the remittance of your outstanding invoices."
          doIt="Use Melio to pay the bills you owe."
        />
        <Swap
          dont="Error: the transaction could not be completed at this time."
          doIt="That payment didn't go through. Let's try again."
        />
        <Swap
          dont="Users are required to verify their account prior to initiating a payment."
          doIt="Verify your account and you're ready to pay."
        />
      </div>

      <SectionTitle sub="The same message written in active and passive voice - active is always clearer.">Active vs passive</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
        {(['Active.png', 'Passive.png'] as const).map((file) => {
          const url = tovUrl(file);
          return url ? (
            <div key={file} style={{ borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.panel }}>
              <img src={url} alt={file.replace('.png', '')} style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
            </div>
          ) : null;
        })}
      </div>

      <SectionTitle sub="Real writing examples - what Melio sounds like, and what to avoid.">Visual examples</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 24 }}>
        {(['Do.png', 'Do-1.png', 'Do-2.png', 'Do-3.png', "Don't.png", "Don't-1.png", "Don't-2.png"] as const).map((file) => {
          const url = tovUrl(file);
          return url ? (
            <div key={file} style={{ borderRadius: RADIUS.lg, overflow: 'hidden', background: COLOR.panel }}>
              <img src={url} alt={file.replace('.png', '')} style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
            </div>
          ) : null;
        })}
      </div>

      <SectionTitle sub="A small set of house rules for consistency.">House style</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <InfoCard
          icon={<DsIcon name="close" size={16} style={{ color: COLOR.ink }} />}
          label="Hyphens, not em dashes"
          text="Always use a regular hyphen ( - ), the short dash. Never use the long em dash. No exceptions."
        />
        <InfoCard
          icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />}
          label="Sentence case"
          text="Headlines and buttons in sentence case. Capitalize the first word only, plus names."
        />
        <InfoCard
          icon={<DsIcon name="info" size={16} style={{ color: COLOR.ink }} />}
          label="One space, no Oxford fuss"
          text="One space after a period. Keep numbers and dates simple and readable."
        />
      </div>
    </div>
  );
}
