import { type z } from 'zod';
import { type ReportSchema } from '../schemas/reports.schemas';

export type Report = z.infer<typeof ReportSchema>;
