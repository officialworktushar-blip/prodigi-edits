'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface OrdersByStatusDatum {
  status: string;
  count: number;
}

export interface OrdersByStatusChartProps {
  data: OrdersByStatusDatum[];
}

export function OrdersByStatusChart({ data }: OrdersByStatusChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: -18 }}
        >
          <CartesianGrid
            stroke="#E2E8F0"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="status"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            angle={-28}
            height={62}
            interval={0}
            textAnchor="end"
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            width={42}
          />
          <Tooltip
            cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
            contentStyle={{
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(15, 18, 34, 0.08)',
              fontSize: 12,
            }}
            labelStyle={{ color: '#0F1222', fontWeight: 600 }}
          />
          <Bar
            dataKey="count"
            name="Orders"
            fill="#4F46E5"
            maxBarSize={46}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
