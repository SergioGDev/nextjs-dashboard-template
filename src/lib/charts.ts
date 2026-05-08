// Shared styling constants consumed by all chart wrappers.
// Import individually: import { chartTooltipStyle, ... } from '@lib/charts'

/** Tooltip box style — background, border, radius, font. */
export const chartTooltipStyle = {
  background: 'var(--surface-raised)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text-primary)',
} as const;

/** Tooltip label row style (the X-axis value shown above the value). */
export const chartTooltipLabelStyle = {
  color: 'var(--text-muted)',
} as const;

/** Common XAxis / YAxis props — tick style, no tick lines, no axis line. */
export const chartAxisProps = {
  tick: { fill: 'var(--text-muted)', fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

/** CartesianGrid props — horizontal dashes only. */
export const chartGridProps = {
  strokeDasharray: '3 3',
  stroke: 'var(--border)',
  vertical: false,
} as const;

/** Legend wrapperStyle for line and donut charts. */
export const chartLegendStyle = {
  fontSize: 12,
  color: 'var(--text-muted)',
} as const;
