import path from 'node:path';

/**
 * Resolves the FAMVIS_CLIENT_DIST env var (or a default) to an absolute
 * path. `res.sendFile()` in index.ts requires an absolute path -- a relative
 * `FAMVIS_CLIENT_DIST` value crashed it with "path must be absolute or
 * specify root to res.sendFile" until this was caught by a manual
 * production-build smoke test and fixed here.
 */
export const resolveClientDist = (rawEnvValue: string | undefined, defaultDir: string): string =>
  path.resolve(rawEnvValue ?? defaultDir);
