import { type z } from 'zod';
import { type MonthlyMetricSchema, type DailyMetricSchema, type TrafficSourceSchema } from '../schemas/analytics.schemas';

export type MonthlyMetric = z.infer<typeof MonthlyMetricSchema>;
export type DailyMetric = z.infer<typeof DailyMetricSchema>;
export type TrafficSource = z.infer<typeof TrafficSourceSchema>;

export type DateRange = '7d' | '30d' | '90d' | '12m';
