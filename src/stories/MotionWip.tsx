import { FONT, COLOR } from './brandKit';
import { MelAnim, melioUrl } from './IllustrationsGuidelines';

/* Motion isn't ported yet - a friendly work-in-progress placeholder with the construction Mel. */
export function MotionWip() {
  return (
    <div
      style={{
        fontFamily: FONT,
        color: COLOR.ink,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '62vh',
        padding: '40px 24px',
      }}
    >
      <MelAnim url={melioUrl('construction')} size={120} />
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: '24px 0 10px' }}>Under construction</h1>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: COLOR.body, maxWidth: 400, margin: 0 }}>
        The motion guidelines are still being built. Check back soon - we're on it.
      </p>
    </div>
  );
}
