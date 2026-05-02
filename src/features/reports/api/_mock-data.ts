import { Report } from '../types/reports.types';

export const mockReports: Report[] = [
  { id: 'r1', name: 'Q1 2026 Financial Summary', type: 'financial', status: 'ready', createdAt: '2026-04-30T08:30:00Z', size: '2.4 MB', downloadUrl: '#' },
  { id: 'r2', name: 'User Acquisition Report — March', type: 'user', status: 'ready', createdAt: '2026-04-02T10:00:00Z', size: '1.1 MB', downloadUrl: '#' },
  { id: 'r3', name: 'Monthly Analytics Digest', type: 'analytics', status: 'ready', createdAt: '2026-04-01T00:05:00Z', size: '3.8 MB', downloadUrl: '#' },
  { id: 'r4', name: 'Campaign Performance — Spring', type: 'custom', status: 'ready', createdAt: '2026-03-31T16:45:00Z', size: '0.9 MB', downloadUrl: '#' },
  { id: 'r5', name: 'Q4 2025 Financial Summary', type: 'financial', status: 'ready', createdAt: '2026-01-05T09:00:00Z', size: '2.6 MB', downloadUrl: '#' },
  { id: 'r6', name: 'Annual User Report 2025', type: 'user', status: 'ready', createdAt: '2026-01-03T11:30:00Z', size: '5.2 MB', downloadUrl: '#' },
  { id: 'r7', name: 'Conversion Funnel Analysis', type: 'analytics', status: 'ready', createdAt: '2026-03-15T14:20:00Z', size: '1.7 MB', downloadUrl: '#' },
  { id: 'r8', name: 'Enterprise Accounts Overview', type: 'custom', status: 'ready', createdAt: '2026-03-10T10:00:00Z', size: '0.6 MB', downloadUrl: '#' },
  { id: 'r9', name: 'April Revenue Projections', type: 'financial', status: 'processing', createdAt: '2026-04-30T09:00:00Z', size: '—', downloadUrl: '#' },
  { id: 'r10', name: 'Churn Analysis — Q1 2026', type: 'user', status: 'ready', createdAt: '2026-04-20T13:00:00Z', size: '1.3 MB', downloadUrl: '#' },
  { id: 'r11', name: 'SEO Traffic Breakdown', type: 'analytics', status: 'ready', createdAt: '2026-04-18T09:30:00Z', size: '2.1 MB', downloadUrl: '#' },
  { id: 'r12', name: 'Custom Segment: Power Users', type: 'custom', status: 'failed', createdAt: '2026-04-28T15:00:00Z', size: '—', downloadUrl: '#' },
  { id: 'r13', name: 'Billing & Invoicing Report', type: 'financial', status: 'ready', createdAt: '2026-04-15T08:00:00Z', size: '0.8 MB', downloadUrl: '#' },
  { id: 'r14', name: 'New User Onboarding Metrics', type: 'user', status: 'processing', createdAt: '2026-04-30T09:05:00Z', size: '—', downloadUrl: '#' },
  { id: 'r15', name: 'Product Usage Heatmap', type: 'analytics', status: 'ready', createdAt: '2026-04-22T12:00:00Z', size: '4.1 MB', downloadUrl: '#' },
];
