import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    // reporters: [''],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'cobertura'],
      enabled: true,
      exclude: [
        '**/node_modules/**',
        '**/*.d.ts',
        '**/dist/**',
        '**/*.config.js',
        '**/*.pnp.cjs',
        '**/*.mjs',
        'src/index.ts',
      ],
    },
  },
});
