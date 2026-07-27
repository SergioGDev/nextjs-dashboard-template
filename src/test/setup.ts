import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// No jsdom API stubs yet (matchMedia, ResizeObserver, IntersectionObserver).
// Add here, commented with which test needs it, the moment a real test requires one —
// do not add speculative stubs.
