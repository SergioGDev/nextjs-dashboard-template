import { MonthlyMetric, DailyMetric, TrafficSource } from '../types/analytics.types';

export const monthlyAnalytics: MonthlyMetric[] = [
  { month: 'May 2025', revenue: 48200, users: 1840, sessions: 9200, conversionRate: 2.1 },
  { month: 'Jun 2025', revenue: 52100, users: 2010, sessions: 10050, conversionRate: 2.3 },
  { month: 'Jul 2025', revenue: 61400, users: 2280, sessions: 11400, conversionRate: 2.5 },
  { month: 'Aug 2025', revenue: 58900, users: 2150, sessions: 10750, conversionRate: 2.2 },
  { month: 'Sep 2025', revenue: 67300, users: 2490, sessions: 12450, conversionRate: 2.7 },
  { month: 'Oct 2025', revenue: 73800, users: 2720, sessions: 13600, conversionRate: 2.9 },
  { month: 'Nov 2025', revenue: 82100, users: 3010, sessions: 15050, conversionRate: 3.1 },
  { month: 'Dec 2025', revenue: 91600, users: 3380, sessions: 16900, conversionRate: 3.4 },
  { month: 'Jan 2026', revenue: 78400, users: 2890, sessions: 14450, conversionRate: 3.0 },
  { month: 'Feb 2026', revenue: 84200, users: 3100, sessions: 15500, conversionRate: 3.2 },
  { month: 'Mar 2026', revenue: 96500, users: 3560, sessions: 17800, conversionRate: 3.6 },
  { month: 'Apr 2026', revenue: 108900, users: 4020, sessions: 20100, conversionRate: 3.9 },
];

function generateDailyData(): DailyMetric[] {
  const data: DailyMetric[] = [];
  const now = new Date('2026-04-30');
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 3200 + Math.sin(i * 0.5) * 800;
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(base + Math.random() * 1200),
      users: Math.round(120 + Math.random() * 60),
      sessions: Math.round(600 + Math.random() * 300),
      conversionRate: parseFloat((3.2 + Math.random() * 1.2).toFixed(2)),
    });
  }
  return data;
}

export const dailyAnalytics: DailyMetric[] = generateDailyData();

export const trafficSources: TrafficSource[] = [
  { name: 'Organic Search', value: 38, color: '#6366F1' },
  { name: 'Direct', value: 24, color: '#10B981' },
  { name: 'Social Media', value: 18, color: '#F59E0B' },
  { name: 'Email', value: 12, color: '#3B82F6' },
  { name: 'Referral', value: 8, color: '#F43F5E' },
];
