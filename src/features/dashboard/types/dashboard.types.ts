import { type z } from 'zod';
import { type KPISummarySchema, type ActivityItemSchema, type CampaignSchema } from '../schemas/dashboard.schemas';

export type KPISummary = z.infer<typeof KPISummarySchema>;
export type ActivityItem = z.infer<typeof ActivityItemSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
