import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/shared', 'server', 'client'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
