import { describe, expect, it } from 'vitest';
import { requirePattern } from '../src/validation/patternValidation.js';
import { ValidationError } from '../src/validation/ValidationError.js';

describe('requirePattern', () => {
  it('rejects an empty pattern', () => {
    expect(() => requirePattern('')).toThrow(ValidationError);
  });

  it('rejects patterns of length 1 to 3', () => {
    expect(() => requirePattern('a')).toThrow(ValidationError);
    expect(() => requirePattern('ab')).toThrow(ValidationError);
    expect(() => requirePattern('abc')).toThrow(ValidationError);
  });

  it('allows a pattern of exactly length 4 through unchanged', () => {
    expect(requirePattern('abcd')).toBe('abcd');
  });

  it('allows longer patterns through unchanged', () => {
    expect(requirePattern('müller')).toBe('müller');
  });

  it('checks raw string length, not alphanumeric-stripped length', () => {
    // '%%%%' has raw length 4 even though it has zero alphanumeric characters;
    // the server only ever enforced the raw-length-4 rule (the alphanumeric
    // stripping was a client-side-only AngularJS behavior, not part of the
    // server contract).
    expect(requirePattern('%%%%')).toBe('%%%%');
  });
});
