export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: () => [...dashboardKeys.all, 'kpis'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  campaigns: () => [...dashboardKeys.all, 'campaigns'] as const,
};
