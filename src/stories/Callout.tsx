import type { ReactNode } from 'react';
import { FONT, RADIUS, DsIcon } from './brandKit';

/**
 * Warning / "needs attention" callout - amber palette with a warning icon.
 * Use for flags like pending/missing content (distinct from the lilac brand-info callouts).
 */
export function WarningCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        background: '#FFF8E6',
        border: '1px solid #F3D27E',
        borderRadius: RADIUS.lg,
        padding: '16px 18px',
      }}
    >
      <h3
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '0 0 6px',
          fontSize: 16,
          fontWeight: 600,
          color: '#8A5A00',
        }}
      >
        <DsIcon name="warning Type=Outline" size={18} style={{ color: '#C68A0A' }} />
        {title}
      </h3>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#7A5B14' }}>{children}</div>
    </div>
  );
}
