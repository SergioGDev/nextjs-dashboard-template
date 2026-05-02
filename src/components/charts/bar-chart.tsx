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

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  formatY?: (v: number) => string;
  formatTooltip?: (v: number) => string;
  height?: number;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = 'var(--accent)',
  formatY,
  formatTooltip,
  height = 220,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
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
          formatter={(v) => [formatTooltip ? formatTooltip(Number(v)) : String(v), yKey]}
          labelStyle={{ color: 'var(--text-muted)' }}
          cursor={{ fill: 'var(--border)' }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={32} />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
