export const QUERY = {
  STALE_TIME: 30_000,
  GC_TIME: 5 * 60_000,
  RETRY_COUNT: 1,
} as const;

export const API = {
  TIMEOUT_MS: 30_000,
  MOCK_DELAY_RANGE: [400, 800] as const,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
} as const;

export const THEME = {
  STORAGE_KEY: 'nexdash-theme',
  UI_STORAGE_KEY: 'nexdash-ui',
  DEFAULT_ACCENT: 'indigo',
  ACCENTS: ['indigo', 'violet', 'emerald', 'rose', 'amber', 'cyan'] as const,
} as const;
