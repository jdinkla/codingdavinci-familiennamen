/**
 * Ported from the original public/javascripts/color.js (golden-ratio HSL
 * generator, https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/).
 * One behavioral fix versus the original: hex channels are now zero-padded
 * to 2 digits — the original's bare `.toString(16)` could emit a malformed
 * (too-short) hex color whenever a channel rounded below 16.
 */

const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

const hue2rgb = (p: number, q: number, t: number): number => {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
};

const toHex = (channel: number): string => Math.round(channel * 255).toString(16).padStart(2, '0');

export const hslToRgb = (h: number, s: number, l: number): string => {
  if (s === 0) {
    return `#${toHex(l)}${toHex(l)}${toHex(l)}`;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/** Returns a `next()` generator producing well-separated colors via the golden ratio conjugate. */
export const createColorGenerator = (seed: number = Math.random()): (() => string) => {
  let hue = seed;
  return () => {
    hue = (hue + GOLDEN_RATIO_CONJUGATE) % 1;
    return hslToRgb(hue, 0.5, 0.6);
  };
};
