import successSvg from '../assets/illustrations/penny-partners/success.svg?raw';
import paymentLinkSvg from '../assets/illustrations/penny-partners/payment-request-link.svg?raw';
import aiIconSvg from '../assets/icons/penny/ai-fill.svg?raw';
import giftIconSvg from '../assets/icons/penny/gift.svg?raw';
import ilFlagSvg from '../assets/flags/penny/IL.svg?raw';
import amexSvg from '../assets/brand-symbols/penny/amex.svg?raw';
import visaSvg from '../assets/brands/penny/visa.svg?raw';

// Round 2 — new types
import alarmSmallSvg from '../assets/icons/penny-small/alarm-clock.svg?raw';
import quickbooksNeutralSvg from '../assets/brands/penny/quickbooks-neutral.svg?raw';
import melioInverseSvg from '../assets/brands/penny/melio-inverse.svg?raw';
import xeroSvg from '../assets/brand-symbols/penny/xero.svg?raw';
import usFlagSvg from '../assets/flags/penny/US.svg?raw';
import { FONT } from './brandKit';

// Penny illustration token colors — from packages/penny-assets/src/styles/illustrations.css
const PENNY_CSS = `
  .penny-illustration-border          { fill: #18191b; }
  .penny-illustration-background      { fill: #ffffff; }
  .penny-illustration-brand-primary   { fill: #7849ff; }
  .penny-illustration-brand-secondary { fill: #f6f2fd; }
  .penny-illustration-stroke-border          { stroke: #18191b; }
  .penny-illustration-stroke-background      { stroke: #ffffff; }
  .penny-illustration-stroke-brand-primary   { stroke: #7849ff; }
  .penny-illustration-stroke-brand-secondary { stroke: #f6f2fd; }
`;

const PURPLE = '#7849ff';

const ASSETS: { svg: string; name: string; type: string; size?: number; bg?: string }[] = [
  // Round 1
  { svg: successSvg,           name: 'success.svg',              type: 'Illustration',        size: 120 },
  { svg: paymentLinkSvg,       name: 'payment-request-link.svg', type: 'Illustration',        size: 120 },
  { svg: aiIconSvg,            name: 'ai-fill.svg',              type: 'Icon · medium',       size: 40 },
  { svg: giftIconSvg,          name: 'gift.svg',                 type: 'Icon · medium',       size: 40 },
  { svg: ilFlagSvg,            name: 'IL.svg',                   type: 'Flag',                size: 48 },
  { svg: amexSvg,              name: 'amex.svg',                 type: 'Brand symbol',        size: 64 },
  { svg: visaSvg,              name: 'visa.svg',                 type: 'Brand',               size: 80 },
  // Round 2 — new types
  { svg: alarmSmallSvg,        name: 'alarm-clock.svg',          type: 'Icon · small',        size: 24 },
  { svg: quickbooksNeutralSvg, name: 'quickbooks-neutral.svg',   type: 'Brand · neutral',     size: 80 },
  { svg: melioInverseSvg,      name: 'melio-inverse.svg',        type: 'Brand · inverse',     size: 80, bg: '#1A1A2E' },
  { svg: xeroSvg,              name: 'xero.svg',                 type: 'Brand symbol',        size: 64 },
  { svg: usFlagSvg,            name: 'US.svg',                   type: 'Flag',                size: 48 },
];

export function PennyTestPage() {
  return (
    <div style={{ fontFamily: FONT, padding: '40px 48px' }}>
      <style>{PENNY_CSS}</style>

      <p style={{ fontSize: 12, color: '#9AA0AA', margin: '0 0 32px', letterSpacing: 0.2 }}>
        All assets fetched directly from <span style={{ color: PURPLE, fontWeight: 600 }}>melio/penny</span> on GitHub
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
        {ASSETS.map(({ svg, name, type, size = 80, bg }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '20px 16px 16px',
              border: '1px solid #ECECF1',
              borderRadius: 14,
              background: bg ?? '#FAFAFB',
            }}
          >
            <div
              style={{ width: size, height: size, color: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: bg ? '#ffffff99' : '#9AA0AA', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 0.4 }}>{type}</p>
              <p style={{ fontSize: 12, color: bg ? '#fff' : PURPLE, fontWeight: 600, margin: 0, wordBreak: 'break-all' }}>{name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
