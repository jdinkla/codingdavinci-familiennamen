import { describe, expect, it } from 'vitest';
import { createColorGenerator, hslToRgb } from './color.js';

describe('hslToRgb', () => {
  it('returns a gray hex (achromatic branch) when saturation is 0', () => {
    expect(hslToRgb(0.5, 0, 0.5)).toBe('#808080');
  });

  it('returns a well-formed 7-character hex color for a typical chromatic input', () => {
    const hex = hslToRgb(0.1, 0.5, 0.6);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('zero-pads channels that round below 16 (the original bug this fixes)', () => {
    // h=0, s=1, l=0.03 -> r,g,b all small, several channels round under 16/255.
    const hex = hslToRgb(0, 1, 0.03);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('covers all three hue2rgb wraparound branches across the hue range', () => {
    for (const h of [0, 1 / 6 - 0.01, 1 / 6, 0.4, 2 / 3, 0.9, 1]) {
      expect(hslToRgb(h, 0.5, 0.6)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe('createColorGenerator', () => {
  it('produces a well-formed hex color on every call', () => {
    const next = createColorGenerator(0);
    for (let i = 0; i < 10; i++) {
      expect(next()).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('is deterministic for a given seed', () => {
    const a = createColorGenerator(0.25);
    const b = createColorGenerator(0.25);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it('produces different colors across consecutive calls', () => {
    const next = createColorGenerator(0);
    const first = next();
    const second = next();
    expect(first).not.toBe(second);
  });
});
