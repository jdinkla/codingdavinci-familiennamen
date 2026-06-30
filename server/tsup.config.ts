import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/scripts/import.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  // @familiennamen/shared has no build step of its own (consumed as raw TS
  // by Vite/tsx, which both handle that natively) -- bundling it here is
  // what lets the compiled dist/*.js run under plain `node` in production
  // without needing a TS loader or a published/built shared package.
  noExternal: ['@familiennamen/shared'],
});
