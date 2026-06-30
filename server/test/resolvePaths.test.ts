import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveClientDist } from '../src/resolvePaths.js';

describe('resolveClientDist', () => {
  it('uses the default when no env value is set', () => {
    const result = resolveClientDist(undefined, '/app/client/dist');
    expect(result).toBe('/app/client/dist');
  });

  it('passes an already-absolute env value through unchanged', () => {
    const result = resolveClientDist('/custom/dist', '/app/client/dist');
    expect(result).toBe('/custom/dist');
  });

  it('resolves a relative env value to an absolute path (the bug this guards against)', () => {
    const result = resolveClientDist('client/dist', '/app/client/dist');
    expect(path.isAbsolute(result)).toBe(true);
    expect(result).toBe(path.resolve('client/dist'));
  });
});
