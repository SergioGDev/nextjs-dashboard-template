import { z } from 'zod';

export const ReportSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['financial', 'user', 'analytics', 'custom']),
  status: z.enum(['ready', 'processing', 'failed']),
  createdAt: z.string(),
  size: z.string(),
  downloadUrl: z.string(),
});
