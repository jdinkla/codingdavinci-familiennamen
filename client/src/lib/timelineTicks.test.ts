import { describe, expect, it } from 'vitest';
import { getCenturies, getYears } from './timelineTicks.js';

// Cases ported verbatim from test/browser_utils_test.js.
describe('getCenturies', () => {
  it('getCenturies(1431, 1887)', () => {
    expect(getCenturies(1431, 1887)).toEqual([1500, 1600, 1700, 1800]);
  });

  it('getCenturies(1481, 1800)', () => {
    expect(getCenturies(1481, 1800)).toEqual([1500, 1600, 1700, 1800]);
  });

  it('getCenturies(1499, 1800)', () => {
    expect(getCenturies(1499, 1800)).toEqual([1500, 1600, 1700, 1800]);
  });

  it('getCenturies(1500, 1800)', () => {
    expect(getCenturies(1500, 1800)).toEqual([1500, 1600, 1700, 1800]);
  });

  it('getCenturies(1501, 1800)', () => {
    expect(getCenturies(1501, 1800)).toEqual([1600, 1700, 1800]);
  });

  it('getCenturies(1501, 1799)', () => {
    expect(getCenturies(1501, 1799)).toEqual([1600, 1700]);
  });

  it('returns an empty array when start and end fall in the same century', () => {
    expect(getCenturies(1620, 1650)).toEqual([]);
  });
});

describe('getYears', () => {
  it('getYears(1431, 1887)', () => {
    expect(getYears(1431, 1887)).toEqual([1431, 1500, 1600, 1700, 1800, 1887]);
  });

  it('getYears(1431, 1813)', () => {
    expect(getYears(1431, 1813)).toEqual([1431, 1500, 1600, 1700, 1800]);
  });

  it('getYears(1431, 1850)', () => {
    expect(getYears(1431, 1850)).toEqual([1431, 1500, 1600, 1700, 1800, 1850]);
  });

  it('getYears(1431, 1851)', () => {
    expect(getYears(1431, 1851)).toEqual([1431, 1500, 1600, 1700, 1800, 1851]);
  });

  it('getYears(1597, 1834)', () => {
    expect(getYears(1597, 1834)).toEqual([1597, 1700, 1800, 1834]);
  });

  it('getYears(1597, 1802)', () => {
    expect(getYears(1597, 1802)).toEqual([1597, 1700, 1802]);
  });

  it('falls back to [start, end] when no century falls in range (deliberate deviation from the original, which silently returned [])', () => {
    expect(getYears(1620, 1650)).toEqual([1620, 1650]);
  });
});
