'use client';

import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  chartTooltipStyle,
  chartTooltipLabelStyle,
  chartAxisProps,
  chartGridProps,
  chartLegendStyle,
} from '@lib/charts';

interface Series {
  key: string;
  color: string;
  label?: string;
}

interface LineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: Series[];
  formatY?: (v: number) => string;
  formatTooltip?: (v: number, key: string) => string;
  height?: number;
}

export function LineChart({ data, xKey, series, formatY, formatTooltip, height = 240 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis {...chartAxisProps} dataKey={xKey} interval="preserveStartEnd" />
        <YAxis {...chartAxisProps} tickFormatter={formatY} width={50} />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(v, key) => [
            formatTooltip ? formatTooltip(Number(v), String(key)) : String(v),
            series.find((s) => s.key === String(key))?.label ?? String(key),
          ]}
          labelStyle={chartTooltipLabelStyle}
        />
        <Legend
          wrapperStyle={chartLegendStyle}
          formatter={(value) => series.find((s) => s.key === value)?.label ?? value}
        />
        {series.map(({ key, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: 'var(--surface)' }}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
}
