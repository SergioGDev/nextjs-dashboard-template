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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatY}
          width={50}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-primary)',
          }}
          formatter={(v, key) => [
            formatTooltip ? formatTooltip(Number(v), String(key)) : String(v),
            series.find((s) => s.key === String(key))?.label ?? String(key),
          ]}
          labelStyle={{ color: 'var(--text-muted)' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }}
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
