import { describe, expect, it } from 'vitest';
import { requireNames } from '../src/validation/namesValidation.js';
import { ValidationError } from '../src/validation/ValidationError.js';

describe('requireNames', () => {
  it('returns the array unchanged for two or more names', () => {
    expect(requireNames(['müller', 'mueller'])).toEqual(['müller', 'mueller']);
  });

  it('wraps a single name (Express yields a bare string for one param)', () => {
    expect(requireNames('müller')).toEqual(['müller']);
  });

  it('throws when the parameter is entirely absent', () => {
    expect(() => requireNames(undefined)).toThrow(ValidationError);
  });

  it('throws when the only supplied name is an empty string (?names= with no value)', () => {
    expect(() => requireNames('')).toThrow(ValidationError);
    expect(() => requireNames([''])).toThrow(ValidationError);
  });

  it('throws when any entry among several is an empty string', () => {
    expect(() => requireNames(['müller', ''])).toThrow(ValidationError);
  });
});
