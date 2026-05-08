'use client';

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  chartTooltipStyle,
  chartTooltipLabelStyle,
  chartAxisProps,
  chartGridProps,
} from '@lib/charts';

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  /** Optional human-readable label shown in the tooltip instead of the raw yKey. */
  yLabel?: string;
  formatY?: (v: number) => string;
  formatTooltip?: (v: number) => string;
  height?: number;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = 'var(--accent)',
  yLabel,
  formatY,
  formatTooltip,
  height = 220,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis {...chartAxisProps} dataKey={xKey} interval="preserveStartEnd" />
        <YAxis {...chartAxisProps} tickFormatter={formatY} width={50} />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(v) => [
            formatTooltip ? formatTooltip(Number(v)) : String(v),
            yLabel ?? yKey,
          ]}
          labelStyle={chartTooltipLabelStyle}
          cursor={{ fill: 'var(--border)' }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={32} />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
