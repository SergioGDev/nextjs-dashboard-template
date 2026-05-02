import { z } from 'zod';
import { monthlyAnalytics, dailyAnalytics, trafficSources } from './_mock-data';
import { MonthlyMetricSchema, DailyMetricSchema, TrafficSourceSchema } from '../schemas/analytics.schemas';
import { type DateRange } from '../types/analytics.types';
import { randomDelay } from '@lib/utils';
import { USE_MOCKS } from '@lib/api/config';
import { api } from '@lib/api/client';
import { validate } from '@lib/api/validate';

type Opts = { signal?: AbortSignal };

export const analyticsHandler = {
  async getMonthly(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(MonthlyMetricSchema), monthlyAnalytics);
    }
    const data = await api.get<unknown>('/analytics/monthly', opts);
    return validate(z.array(MonthlyMetricSchema), data);
  },

  async getDaily(range: DateRange = '30d', opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      const rangeMap: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 30, '12m': 30 };
      const days = rangeMap[range];
      return validate(z.array(DailyMetricSchema), dailyAnalytics.slice(-days));
    }
    const data = await api.get<unknown>('/analytics/daily', { ...opts, params: { range } });
    return validate(z.array(DailyMetricSchema), data);
  },

  async getTrafficSources(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(TrafficSourceSchema), trafficSources);
    }
    const data = await api.get<unknown>('/analytics/traffic-sources', opts);
    return validate(z.array(TrafficSourceSchema), data);
  },
};
