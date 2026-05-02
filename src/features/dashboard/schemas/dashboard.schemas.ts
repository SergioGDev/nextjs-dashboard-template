import { z } from 'zod';

export const KPISummarySchema = z.object({
  totalRevenue: z.number(),
  revenueGrowth: z.number(),
  activeUsers: z.number(),
  userGrowth: z.number(),
  totalSessions: z.number(),
  sessionGrowth: z.number(),
  conversionRate: z.number(),
  conversionGrowth: z.number(),
});

export const ActivityItemSchema = z.object({
  id: z.string(),
  type: z.enum(['user_signup', 'sale', 'report', 'alert', 'login']),
  message: z.string(),
  timestamp: z.string(),
  user: z.string().optional(),
  avatar: z.string().optional(),
});

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'paused', 'completed']),
  revenue: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  roi: z.number(),
});
