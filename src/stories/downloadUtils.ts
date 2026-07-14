// Shared client-side download helpers (used by the icon + illustration galleries).

// Master switch for asset downloads on the published site.
// While false, all download controls are hidden and triggerDownload is a no-op,
// so no raw asset can be pulled from the site. Flip back to true (and wire the
// employee-only drive links) when downloads are re-enabled.
export const DOWNLOADS_ENABLED = false;

export function triggerDownload(blob: Blob, filename: string) {
  if (!DOWNLOADS_ENABLED) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Return a standalone, correctly-sized SVG string from a rendered <svg> element or raw markup. */
export function normalizeSvg(svgEl: SVGSVGElement | null, raw?: string): string | null {
  let svg: Element | null = svgEl;
  if (!svg && raw) svg = new DOMParser().parseFromString(raw, 'image/svg+xml').documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  let w = 0;
  let h = 0;
  const vb = clone.getAttribute('viewBox');
  if (vb) {
    const p = vb.split(/[\s,]+/).map(Number);
    if (p.length === 4) {
      w = p[2];
      h = p[3];
    }
  }
  if (!w) {
    w = parseFloat(clone.getAttribute('width') || '') || 0;
    h = parseFloat(clone.getAttribute('height') || '') || 0;
  }
  if (!w || !h) w = h = 500;
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(clone);
}

export async function svgToCanvas(svgStr: string, size: number, bg?: string): Promise<HTMLCanvasElement> {
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('svg load failed'));
      img.src = url;
    });
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d')!;
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
    }
    ctx.drawImage(img, 0, 0, size, size);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Rasterize an SVG string to a PNG or JPEG blob. */
export async function svgToRaster(svgStr: string, fmt: 'png' | 'jpeg', size = 512): Promise<{ blob: Blob; ext: string } | null> {
  const canvas = await svgToCanvas(svgStr, size, fmt === 'jpeg' ? '#FFFFFF' : undefined);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), fmt === 'jpeg' ? 'image/jpeg' : 'image/png', 0.92),
  );
  return blob ? { blob, ext: fmt === 'jpeg' ? 'jpg' : 'png' } : null;
}
