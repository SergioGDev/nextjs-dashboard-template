import { z } from 'zod';
import { mockReports } from './_mock-data';
import { ReportSchema } from '../schemas/reports.schemas';
import { randomDelay } from '@lib/utils';
import { USE_MOCKS } from '@lib/api/config';
import { api } from '@lib/api/client';
import { validate } from '@lib/api/validate';
import { type Report } from '../types/reports.types';

type Opts = { signal?: AbortSignal };

const reportsStore: Report[] = [...mockReports];

export const reportsHandler = {
  async getAll(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(ReportSchema), [...reportsStore]);
    }
    const data = await api.get<unknown>('/reports', opts);
    return validate(z.array(ReportSchema), data);
  },

  async getById(id: string, opts: Opts = {}): Promise<Report | undefined> {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      const found = reportsStore.find((r) => r.id === id);
      return found ? validate(ReportSchema, found) : undefined;
    }
    const data = await api.get<unknown>(`/reports/${id}`, opts);
    return validate(ReportSchema, data);
  },
};
