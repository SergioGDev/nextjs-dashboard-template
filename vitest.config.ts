import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Globals (describe/it/expect) are intentionally NOT enabled — see docs/testing.md.
// Alias resolution comes from tsconfig.json via vite-tsconfig-paths, not duplicated here.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules/**', '.next/**', '.claude/**'],
  },
});
