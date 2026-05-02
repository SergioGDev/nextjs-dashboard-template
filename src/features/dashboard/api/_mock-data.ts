import { KPISummary, ActivityItem, Campaign } from '../types/dashboard.types';

export const mockKPIs: KPISummary = {
  totalRevenue: 108900,
  revenueGrowth: 12.8,
  activeUsers: 4020,
  userGrowth: 8.4,
  totalSessions: 20100,
  sessionGrowth: 6.2,
  conversionRate: 3.9,
  conversionGrowth: 0.3,
};

export const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'user_signup', message: 'Tobias Müller joined as Manager', timestamp: '2026-04-30T09:15:00Z', user: 'Tobias Müller', avatar: 'https://ui-avatars.com/api/?name=Tobias+Muller&background=F59E0B&color=fff&size=64' },
  { id: 'a2', type: 'sale', message: 'New sale: Enterprise Plan — $4,800/mo', timestamp: '2026-04-30T08:52:00Z' },
  { id: 'a3', type: 'report', message: 'Q1 2026 Financial Report generated', timestamp: '2026-04-30T08:30:00Z' },
  { id: 'a4', type: 'login', message: 'Aria Blackwood logged in from new device', timestamp: '2026-04-30T08:14:00Z', user: 'Aria Blackwood', avatar: 'https://ui-avatars.com/api/?name=Aria+Blackwood&background=6366F1&color=fff&size=64' },
  { id: 'a5', type: 'alert', message: 'API response time exceeded threshold (2.3s)', timestamp: '2026-04-30T07:48:00Z' },
  { id: 'a6', type: 'sale', message: 'New sale: Pro Plan — $299/mo', timestamp: '2026-04-30T07:22:00Z' },
  { id: 'a7', type: 'user_signup', message: 'Cleo Andersen joined as Editor', timestamp: '2026-04-30T06:55:00Z', user: 'Cleo Andersen', avatar: 'https://ui-avatars.com/api/?name=Cleo+Andersen&background=10B981&color=fff&size=64' },
  { id: 'a8', type: 'report', message: 'Weekly user analytics digest sent', timestamp: '2026-04-29T23:00:00Z' },
  { id: 'a9', type: 'sale', message: 'New sale: Starter Plan — $49/mo', timestamp: '2026-04-29T21:14:00Z' },
  { id: 'a10', type: 'alert', message: 'Scheduled maintenance completed successfully', timestamp: '2026-04-29T20:00:00Z' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'Spring Launch 2026', status: 'active', revenue: 28400, clicks: 14200, conversions: 312, roi: 184 },
  { id: 'c2', name: 'Enterprise Outreach', status: 'active', revenue: 41200, clicks: 6800, conversions: 94, roi: 218 },
  { id: 'c3', name: 'Product Hunt Launch', status: 'completed', revenue: 18900, clicks: 32100, conversions: 445, roi: 156 },
  { id: 'c4', name: 'Q1 Re-engagement', status: 'paused', revenue: 9200, clicks: 5400, conversions: 108, roi: 97 },
  { id: 'c5', name: 'Developer Newsletter', status: 'active', revenue: 11300, clicks: 8900, conversions: 167, roi: 129 },
];
