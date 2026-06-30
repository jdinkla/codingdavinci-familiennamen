import { describe, expect, it } from 'vitest';
import { buildNamesQuery, parseNamesParam } from './namesQuery.js';

describe('buildNamesQuery', () => {
  it('returns an empty string for an empty list', () => {
    expect(buildNamesQuery([])).toBe('');
  });

  it('encodes a single name', () => {
    expect(buildNamesQuery(['müller'])).toBe('names=m%C3%BCller');
  });

  it('joins multiple names with &, each as its own names= param', () => {
    expect(buildNamesQuery(['müller', 'mueller'])).toBe('names=m%C3%BCller&names=mueller');
  });

  it('encodes a name with an embedded comma and space safely', () => {
    expect(buildNamesQuery(['meier, von'])).toBe('names=meier%2C%20von');
  });

  it('leaves parentheses un-escaped (encodeURIComponent treats them as unreserved, and they are not query-string delimiters)', () => {
    expect(buildNamesQuery(['(oo)'])).toBe('names=(oo)');
  });
});

describe('parseNamesParam', () => {
  it('returns an empty array when the param is absent', () => {
    expect(parseNamesParam(undefined)).toEqual([]);
  });

  it('wraps a single value (Express yields a bare string for one param)', () => {
    expect(parseNamesParam('müller')).toEqual(['müller']);
  });

  it('passes through an array unchanged (Express yields an array for 2+ params)', () => {
    expect(parseNamesParam(['müller', 'mueller'])).toEqual(['müller', 'mueller']);
  });

  it('filters out non-string entries from a malformed array', () => {
    expect(parseNamesParam(['müller', 42, { nested: true }])).toEqual(['müller']);
  });

  it('returns an empty array for an unexpected type', () => {
    expect(parseNamesParam(42)).toEqual([]);
    expect(parseNamesParam({ nested: true })).toEqual([]);
  });
});
