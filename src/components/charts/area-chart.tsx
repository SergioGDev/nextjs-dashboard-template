'use client';

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  formatY?: (v: number) => string;
  formatTooltip?: (v: number) => string;
  height?: number;
}

export function AreaChart({
  data,
  xKey,
  yKey,
  color = 'var(--accent)',
  formatY,
  formatTooltip,
  height = 220,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`grad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${yKey})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: 'var(--surface)' }}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
