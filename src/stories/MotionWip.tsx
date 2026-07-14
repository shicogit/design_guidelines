import { FONT, COLOR } from './brandKit';
import { MelAnim, melioUrl } from './IllustrationsGuidelines';
import { Suggestions } from './BrandPage';

/* Motion isn't ported yet - a friendly work-in-progress placeholder with the construction Mel,
   plus the shared "Explore more" section so the page still offers somewhere to go. */
export function MotionWip() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '55vh',
          padding: '40px 24px',
        }}
      >
        <MelAnim url={melioUrl('construction')} size={120} />
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: '24px 0 10px' }}>Under construction</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: COLOR.body, maxWidth: 400, margin: 0 }}>
          The motion guidelines are still being built. Check back soon - we're on it.
        </p>
      </div>

      <Suggestions />
    </div>
  );
}
