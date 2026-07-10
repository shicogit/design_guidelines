import { FONT, COLOR, Body } from './brandKit';
import { SectionCards } from './SectionCards';

export function WelcomeHome() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      {/* Cover - full-bleed, flush to the top */}
      <img src="/cover.png" alt="Melio Brand Guidelines" style={{ width: '100%', display: 'block' }} />

      {/* Padded content area */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 64px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 600, margin: '0 0 20px' }}>Welcome</h1>

        <Body style={{ fontSize: 16, marginBottom: 16 }}>
          Welcome to Melio's brand guidelines. Melio is a business payment platform built to help businesses stay in business - pay any bill, any way you want, by card, bank transfer, or international wire, without losing sight of cash flow.
        </Body>
        <Body style={{ fontSize: 16, marginBottom: 32 }}>
          Think of this as the Melio playbook - everything you need to make sure what we build looks, sounds, and feels like us. Whether you're on product, marketing, or the partner side, use it to keep things clear, human, and unmistakably Melio.
        </Body>

        <SectionCards />

      </div>
    </div>
  );
}
