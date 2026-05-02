'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardHandler } from './dashboard.handler';
import { dashboardKeys } from './dashboard.keys';

export function useDashboardKPIs() {
  return useQuery({
    queryKey: dashboardKeys.kpis(),
    queryFn: ({ signal }) => dashboardHandler.getKPIs({ signal }),
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: dashboardKeys.activity(),
    queryFn: ({ signal }) => dashboardHandler.getRecentActivity({ signal }),
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: dashboardKeys.campaigns(),
    queryFn: ({ signal }) => dashboardHandler.getCampaigns({ signal }),
  });
}
