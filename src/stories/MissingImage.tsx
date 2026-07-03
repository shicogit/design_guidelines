import type { CSSProperties } from 'react';

/**
 * Placeholder shown where a Zeroheight image hasn't been migrated.
 * We intentionally don't recreate the source images - this stands in for them.
 */
export function MissingImage({
  label = 'Image not migrated',
  ratio = '16 / 9',
  style,
}: {
  /** Optional caption describing what the original image showed. */
  label?: string;
  /** CSS aspect-ratio string, e.g. "16 / 9", "4 / 3", "1 / 1". */
  ratio?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        aspectRatio: ratio,
        width: '100%',
        background: '#F1F1F4',
        border: '1.5px dashed #CFCFD8',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: '#9AA0AA',
        textAlign: 'center',
        padding: 16,
        boxSizing: 'border-box',
        fontFamily: '"Poppins", -apple-system, sans-serif',
        ...style,
      }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="#B6B9C2" strokeWidth="1.5" />
        <circle cx="8.5" cy="9.5" r="1.6" fill="#B6B9C2" />
        <path d="M4 18l5-5 3.5 3.5L16 12l4 4" stroke="#B6B9C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3.5" y1="3.5" x2="20.5" y2="20.5" stroke="#B6B9C2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 13, lineHeight: 1.4, maxWidth: 280 }}>{label}</span>
    </div>
  );
}
