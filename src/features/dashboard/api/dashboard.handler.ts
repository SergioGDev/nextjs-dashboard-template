import { z } from 'zod';
import { mockKPIs, mockActivity, mockCampaigns } from './_mock-data';
import { KPISummarySchema, ActivityItemSchema, CampaignSchema } from '../schemas/dashboard.schemas';
import { randomDelay } from '@lib/utils';
import { USE_MOCKS } from '@lib/api/config';
import { api } from '@lib/api/client';
import { validate } from '@lib/api/validate';

type Opts = { signal?: AbortSignal };

export const dashboardHandler = {
  async getKPIs(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(KPISummarySchema, mockKPIs);
    }
    const data = await api.get<unknown>('/dashboard/kpis', opts);
    return validate(KPISummarySchema, data);
  },

  async getRecentActivity(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(ActivityItemSchema), mockActivity);
    }
    const data = await api.get<unknown>('/dashboard/activity', opts);
    return validate(z.array(ActivityItemSchema), data);
  },

  async getCampaigns(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(CampaignSchema), mockCampaigns);
    }
    const data = await api.get<unknown>('/dashboard/campaigns', opts);
    return validate(z.array(CampaignSchema), data);
  },
};
