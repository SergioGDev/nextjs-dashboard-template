import { z } from 'zod';

export const MonthlyMetricSchema = z.object({
  month: z.string(),
  revenue: z.number(),
  users: z.number(),
  sessions: z.number(),
  conversionRate: z.number(),
});

export const DailyMetricSchema = z.object({
  date: z.string(),
  revenue: z.number(),
  users: z.number(),
  sessions: z.number(),
  conversionRate: z.number(),
});

export const TrafficSourceSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});
