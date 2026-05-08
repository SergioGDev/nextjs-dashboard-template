'use client';

import * as React from 'react';
import {
  AreaChart as ReAreaChart,
  Area,
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

interface AreaChartProps {
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

export function AreaChart({
  data,
  xKey,
  yKey,
  color = 'var(--accent)',
  yLabel,
  formatY,
  formatTooltip,
  height = 220,
}: AreaChartProps) {
  // useId produces ":r0:"-style strings — replace colons so the id is a safe SVG fragment.
  const gradientId = React.useId().replace(/:/g, 'g');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: 'var(--surface)' }}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
