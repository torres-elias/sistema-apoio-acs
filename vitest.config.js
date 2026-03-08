import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{js,ts,jsx,tsx}', 'src/**/tests/**/*.test.{js,ts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
