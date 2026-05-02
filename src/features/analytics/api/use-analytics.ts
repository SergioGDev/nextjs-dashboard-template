'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsHandler } from './analytics.handler';
import { analyticsKeys } from './analytics.keys';
import { type DateRange } from '../types/analytics.types';

export function useAnalyticsMonthly() {
  return useQuery({
    queryKey: analyticsKeys.monthly(),
    queryFn: ({ signal }) => analyticsHandler.getMonthly({ signal }),
  });
}

export function useAnalyticsDaily(range: DateRange = '30d') {
  return useQuery({
    queryKey: analyticsKeys.daily(range),
    queryFn: ({ signal }) => analyticsHandler.getDaily(range, { signal }),
  });
}

export function useTrafficSources() {
  return useQuery({
    queryKey: analyticsKeys.traffic(),
    queryFn: ({ signal }) => analyticsHandler.getTrafficSources({ signal }),
  });
}
