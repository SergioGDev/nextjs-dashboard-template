import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Globals (describe/it/expect) are intentionally NOT enabled — see docs/testing.md.
// Alias resolution comes from tsconfig.json via Vite's native tsconfig-paths resolver,
// not duplicated here — tsconfig.json stays the single source of truth for all nine aliases.
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules/**', '.next/**', '.claude/**'],
  },
});
