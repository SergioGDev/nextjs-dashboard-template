import { type DateRange } from '../types/analytics.types';

export const analyticsKeys = {
  all: ['analytics'] as const,
  monthly: () => [...analyticsKeys.all, 'monthly'] as const,
  daily: (range: DateRange) => [...analyticsKeys.all, 'daily', range] as const,
  traffic: () => [...analyticsKeys.all, 'traffic'] as const,
};
