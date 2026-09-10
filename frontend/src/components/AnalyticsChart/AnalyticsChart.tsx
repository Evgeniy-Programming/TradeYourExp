import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ChartDataItem {
  name: string;
  sales: number;
  uv: number;
}

const data: ChartDataItem[] = [
  { name: 'Янв', sales: 4000, uv: 2400 },
  { name: 'Фев', sales: 3000, uv: 1398 },
  { name: 'Мар', sales: 5000, uv: 9800 },
  { name: 'Апр', sales: 4780, uv: 3908 },
  { name: 'Май', sales: 6890, uv: 4800 },
  { name: 'Июн', sales: 7500, uv: 3800 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
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
          Продажи: {payload[0].value} ₽
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart(): React.JSX.Element {
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
        Статистика продаж
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
          <YAxis stroke="#6c6c8c" tickLine={false} axisLine={false} />

          {/* Передаем типизированный кастомный тултип */}
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="sales"
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
