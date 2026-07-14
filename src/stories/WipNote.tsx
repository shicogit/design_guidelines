import { FONT, COLOR } from './brandKit';
import { MelAnim, melioUrl } from './IllustrationsGuidelines';

/* Shared "under construction" placeholder: the construction Mel, a title, and one sentence.
   Used on WIP pages/sections (Motion, Simplified UI, Imagery Guidelines).
   Pass minHeight to vertically center it on a full page; omit it inside a section. */
export function WipNote({ text, minHeight }: { text: string; minHeight?: string }) {
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
        minHeight,
        padding: '40px 24px',
      }}
    >
      <MelAnim url={melioUrl('construction')} size={120} />
      <div style={{ fontSize: 20, fontWeight: 600, color: COLOR.ink, margin: '32px 0 12px' }}>Under construction</div>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: COLOR.body, maxWidth: 400, margin: 0 }}>{text}</p>
    </div>
  );
}
