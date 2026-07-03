import { FONT, COLOR, Med, SectionTitle, Body, Lead, InfoCard, DsIcon } from './brandKit';
import { SectionCards } from './SectionCards';

export function WelcomeHome() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      {/* Cover - full-bleed, flush to the top */}
      <img src="/cover.png" alt="Melio Brand Guidelines" style={{ width: '100%', display: 'block' }} />

      {/* Padded content area */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 64px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 600, margin: '0 0 20px' }}>Introduction</h1>

        <Lead style={{ fontSize: 18, color: COLOR.ink }}>
          Melio's brand is how we show up for the small businesses we serve: clear, human, and dependable. These
          guidelines are the visual and verbal source of truth for everyone building Melio experiences, across product,
          marketing, and partners.
        </Lead>
        <Body style={{ fontSize: 16 }}>
          They introduce the core elements that make up Melio's complete visual vocabulary - logo, color, typography,
          voice, iconography, illustration, imagery, and our mascot Mel. Use them to stay consistent in how we share
          Melio's story and values, and to keep everything we make recognizable and unmistakably Melio.
        </Body>

        {/* Who we're for */}
        <SectionTitle sub="Everything we make is in service of one audience.">Who we're for</SectionTitle>
        <Body style={{ fontSize: 16 }}>
          <Med>Small-business owners.</Med> They wear every hat and have no time to spare. Melio takes the dread out of
          paying and getting paid, so they can get back to running the business. The brand should always feel like it's
          on their side - never corporate, never cold.
        </Body>

        {/* Personality */}
        <SectionTitle sub="Four traits that describe how the brand looks and feels.">What we stand for</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <InfoCard icon={<DsIcon name="chat" size={16} style={{ color: COLOR.ink }} />} label="Human" text="Warm and approachable. Made by people, for people." />
          <InfoCard icon={<DsIcon name="checked" size={16} style={{ color: COLOR.ink }} />} label="Clear" text="Simple and direct. We remove friction, not add to it." />
          <InfoCard icon={<DsIcon name="shield-check" size={16} style={{ color: COLOR.ink }} />} label="Dependable" text="Calm and trustworthy. Money is serious; we're steady." />
          <InfoCard icon={<DsIcon name="get-started" size={16} style={{ color: COLOR.ink }} />} label="Optimistic" text="Forward-looking and encouraging, with a light touch." />
        </div>


        {/* Design principles */}
        <SectionTitle sub="Use these as a tie-breaker in any design decision. If a choice fails one, it's probably the wrong choice.">Design principles</SectionTitle>
        <div>
          {[
            { n: '01', title: 'Clarity over cleverness', belief: 'The clearest version wins. We would rather be understood than admired.', test: 'Plain words, one obvious next step, nothing to decode.' },
            { n: '02', title: 'Calm by default', belief: 'Money is stressful. Our job is to lower the temperature, not raise it.', test: 'Generous space, steady color, reassuring copy on the hard moments.' },
            { n: '03', title: "On the owner's side", belief: 'We design for a busy small-business owner who has no time to spare.', test: 'Fewer steps, helpful defaults, and we never make anyone feel behind.' },
            { n: '04', title: 'Consistent, not rigid', belief: 'Reuse the system so things feel familiar - but keep the warmth and personality.', test: 'Same tokens and patterns everywhere, with room for a human touch.' },
            { n: '05', title: 'Sweat the small motions', belief: 'Craft lives in the details - a well-timed animation, a friendly Mel, a tidy edge.', test: 'Purposeful motion and finish that make the ordinary feel cared for.' },
          ].map(({ n, title, belief, test }) => (
            <div key={n} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: `1px solid ${COLOR.hairline}` }}>
              <div style={{ flex: '0 0 auto', fontSize: 20, fontWeight: 600, color: COLOR.purple, width: 36 }}>{n}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <Body style={{ margin: '0 0 4px' }}>{belief}</Body>
                <div style={{ fontSize: 13, color: COLOR.muted }}>Looks like: {test}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand elements - what & why + the "get started" cards (moved here from the old Identity overview) */}
        <SectionCards />

        <Body style={{ fontSize: 14, color: COLOR.muted, marginTop: 28 }}>
          Need the files fast? <Med>For Partners</Med> has a quick start and every download in one place.
        </Body>
      </div>
    </div>
  );
}
