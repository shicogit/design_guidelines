// Minimal type shim for gifenc (ships no types). Only the surface we use.
declare module 'gifenc' {
  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: { palette?: number[][]; delay?: number; transparent?: boolean; dispose?: number; first?: boolean },
    ): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
    bytesView(): Uint8Array<ArrayBuffer>;
  }
  export function GIFEncoder(): GIFEncoderInstance;
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    opts?: { format?: string; oneBitAlpha?: boolean | number; clearAlpha?: boolean; clearAlphaThreshold?: number },
  ): number[][];
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: number[][],
    format?: string,
  ): Uint8Array;
}
