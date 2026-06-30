import { describe, expect, it } from 'vitest';
import { parseDepth } from '../src/validation/graphValidation.js';
import { ValidationError } from '../src/validation/ValidationError.js';

describe('parseDepth', () => {
  it('defaults to 1 when undefined', () => {
    expect(parseDepth(undefined)).toBe(1);
  });

  it('accepts "1" and "2"', () => {
    expect(parseDepth('1')).toBe(1);
    expect(parseDepth('2')).toBe(2);
  });

  it('rejects any other value', () => {
    expect(() => parseDepth('3')).toThrow(ValidationError);
    expect(() => parseDepth('abc')).toThrow(ValidationError);
    expect(() => parseDepth('')).toThrow(ValidationError);
  });
});
