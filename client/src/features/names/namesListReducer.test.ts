import { describe, expect, it } from 'vitest';
import {
  containsName,
  findNameIndex,
  getColorForName,
  getNames,
  namesListReducer,
  type NameEntry,
} from './namesListReducer.js';

const add = (state: NameEntry[], name: string, color = '#000000'): NameEntry[] =>
  namesListReducer(state, { type: 'ADD', name, color });

describe('namesListReducer', () => {
  it('ADD appends to an empty list', () => {
    const state = add([], 'abc');
    expect(state).toHaveLength(1);
    expect(state[0]).toEqual({ name: 'abc', color: '#000000' });
  });

  it('ADD keeps the list sorted by name regardless of insertion order', () => {
    let state: NameEntry[] = [];
    state = add(state, 'ghi');
    state = add(state, 'def');
    state = add(state, 'abc');
    expect(getNames(state)).toEqual(['abc', 'def', 'ghi']);
  });

  it('ADD is idempotent for an already-present name (new behavior vs. the original, which relied on the caller to check first)', () => {
    let state: NameEntry[] = [];
    state = add(state, 'abc', '#111111');
    state = add(state, 'abc', '#222222');
    expect(state).toHaveLength(1);
    expect(state[0]?.color).toBe('#111111');
  });

  it('REMOVE deletes by index, preserving order of the remainder', () => {
    let state: NameEntry[] = [];
    state = add(state, 'ghi');
    state = add(state, 'def');
    state = add(state, 'abc');
    expect(getNames(state)).toEqual(['abc', 'def', 'ghi']);

    state = namesListReducer(state, { type: 'REMOVE', index: 1 });
    expect(getNames(state)).toEqual(['abc', 'ghi']);

    state = namesListReducer(state, { type: 'REMOVE', index: 1 });
    expect(getNames(state)).toEqual(['abc']);

    state = namesListReducer(state, { type: 'REMOVE', index: 0 });
    expect(state).toEqual([]);
  });

  it('RESET clears the list', () => {
    let state: NameEntry[] = [];
    state = add(state, 'ghi');
    state = add(state, 'def');
    expect(state).toHaveLength(2);

    state = namesListReducer(state, { type: 'RESET' });
    expect(state).toEqual([]);
  });
});

describe('findNameIndex / containsName', () => {
  const state: NameEntry[] = [
    { name: 'abc', color: '#1' },
    { name: 'def', color: '#2' },
    { name: 'ghi', color: '#3' },
  ];

  it('findNameIndex returns the index of a present name', () => {
    expect(findNameIndex(state, 'abc')).toBe(0);
    expect(findNameIndex(state, 'def')).toBe(1);
    expect(findNameIndex(state, 'ghi')).toBe(2);
  });

  it('findNameIndex returns -1 for an absent name', () => {
    expect(findNameIndex(state, 'xyz')).toBe(-1);
  });

  it('containsName mirrors findNameIndex', () => {
    expect(containsName(state, 'abc')).toBe(true);
    expect(containsName(state, 'xyz')).toBe(false);
  });
});

describe('getColorForName', () => {
  it('returns the color for a present name', () => {
    const state: NameEntry[] = [
      { name: 'abc', color: 'c1' },
      { name: 'def', color: 'c2' },
    ];
    expect(getColorForName(state, 'abc')).toBe('c1');
    expect(getColorForName(state, 'def')).toBe('c2');
  });

  it('returns undefined for an absent name', () => {
    expect(getColorForName([], 'xyz')).toBeUndefined();
  });
});

describe('getNames', () => {
  it('projects just the name field, in list order', () => {
    const state: NameEntry[] = [
      { name: 'abc', color: 'c1' },
      { name: 'def', color: 'c2' },
    ];
    expect(getNames(state)).toEqual(['abc', 'def']);
  });

  it('returns an empty array for an empty list', () => {
    expect(getNames([])).toEqual([]);
  });
});
