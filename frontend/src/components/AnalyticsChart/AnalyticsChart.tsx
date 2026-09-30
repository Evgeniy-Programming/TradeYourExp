import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface ChartDataItem {
  name: string;
  count: number;
}

interface AnalyticsChartProps {
  data: ChartDataItem[];
}

const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#1e1e2f',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid #3f3f5f',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>{label}</p>
        <p style={{ margin: '5px 0 0', color: '#82ca9d', fontSize: '14px' }}>
          Обменов: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }: AnalyticsChartProps): React.JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: 400,
        background: '#11111b',
        padding: '20px',
        borderRadius: '16px',
      }}
    >
      <h3 style={{ color: '#fff', fontFamily: 'sans-serif', marginBottom: '20px' }}>
        Опубликованные обмены
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#252538" vertical={false} />

          <XAxis dataKey="name" stroke="#6c6c8c" tickLine={false} axisLine={false} />
          <YAxis stroke="#6c6c8c" tickLine={false} axisLine={false} allowDecimals={false} />

          {/* Передаем типизированный кастомный тултип */}
          <Tooltip content={CustomTooltip} />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#82ca9d"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
