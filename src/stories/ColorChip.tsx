// A color code shown as a pill filled with that color, with an ADA-contrast (WCAG) text color.
// Use this anywhere a hex code is displayed in the UI.

const expand = (hex: string) => {
  const h = hex.replace('#', '').trim();
  return h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0').slice(0, 6);
};

const relLuminance = (hex: string): number => {
  const h = expand(hex);
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = ch.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};

/** Pick black or white for the best WCAG contrast ratio against a background hex. */
export const adaTextColor = (hex: string): '#000000' | '#FFFFFF' => {
  const L = relLuminance(hex);
  const onWhiteText = 1.05 / (L + 0.05); // contrast of white text on this bg
  const onBlackText = (L + 0.05) / 0.05; // contrast of black text on this bg
  return onWhiteText >= onBlackText ? '#FFFFFF' : '#000000';
};

/** WCAG contrast ratio between two hex colors (1 to 21). */
export const contrastRatio = (a: string, b: string): number => {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

export function ColorChip({ hex }: { hex: string }) {
  const fg = adaTextColor(hex);
  return (
    <span
      style={{
        display: 'inline',
        background: hex,
        color: fg,
        borderRadius: 5,
        padding: '0 5px',
        marginRight: 3,
        fontWeight: 600,
        fontSize: 'inherit',
        lineHeight: 'inherit',
        fontFamily: 'inherit',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
        whiteSpace: 'nowrap',
      }}
    >
      {hex.toUpperCase()}
    </span>
  );
}
