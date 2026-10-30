'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface OrdersPerWeekDatum {
  week: string;
  orders: number;
}

export interface OrdersPerWeekChartProps {
  data: OrdersPerWeekDatum[];
}

export function OrdersPerWeekChart({ data }: OrdersPerWeekChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
        >
          <defs>
            <linearGradient id="ordersPerWeekFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="#E2E8F0"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            interval={0}
            tickMargin={10}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            width={42}
          />
          <Tooltip
            cursor={{ stroke: '#CBD5E1', strokeDasharray: '3 3' }}
            contentStyle={{
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(15, 18, 34, 0.08)',
              fontSize: 12,
            }}
            labelStyle={{ color: '#0F1222', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#ordersPerWeekFill)"
            activeDot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
