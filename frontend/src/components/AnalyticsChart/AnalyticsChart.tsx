import React, { useEffect, useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';

export interface ChartDataItem {
  name: string;
  count: number;
}

interface AnalyticsChartProps {
  data: ChartDataItem[];
}

interface ChartTheme {
  background: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipBorder: string;
  accent: string;
  grid: string;
  axis: string;
  title: string;
}

const FALLBACK_THEME: ChartTheme = {
  background: 'var(--color-block)',
  tooltipBackground: 'var(--color-block)',
  tooltipText: 'var(--color-text-base)',
  tooltipBorder: 'var(--color-line)',
  accent: 'var(--color-element)',
  grid: 'var(--color-line)',
  axis: 'var(--color-text-transparent)',
  title: 'var(--color-text-title)',
};

const readTheme = (): ChartTheme => {
  if (typeof window === 'undefined') return FALLBACK_THEME;

  const styles = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

  return {
    background: get('--color-block', '#ffffff'),
    tooltipBackground: get('--color-block', '#ffffff'),
    tooltipText: get('--color-text-base', '#1f3327'),
    tooltipBorder: get('--color-line', '#dce7df'),
    accent: get('--color-element', '#2e7d52'),
    grid: get('--color-line', '#dce7df'),
    axis: get('--color-text-transparent', 'rgb(31 51 39 / 55%)'),
    title: get('--color-text-title', '#14281d'),
  };
};

const useChartTheme = (): ChartTheme => {
  const [theme, setTheme] = useState<ChartTheme>(FALLBACK_THEME);

  useEffect(() => {
    const update = () => setTheme(readTheme());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const CustomTooltip = (
  theme: ChartTheme,
  t: (key: string) => string,
  { active, payload, label }: TooltipContentProps<ValueType, NameType>
) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: theme.tooltipBackground,
          color: theme.tooltipText,
          padding: '10px 15px',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-block)',
          border: `1px solid ${theme.tooltipBorder}`,
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>{label}</p>
        <p style={{ margin: '5px 0 0', color: theme.accent, fontSize: '14px' }}>
          {t('chart.exchanges')}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }: AnalyticsChartProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useChartTheme();

  const tooltipContent = useMemo(
    () => (props: TooltipContentProps<ValueType, NameType>) => CustomTooltip(theme, t, props),
    [theme, t]
  );

  return (
    <div
      style={{
        width: '100%',
        height: 400,
        background: theme.background,
        padding: '20px',
        borderRadius: 'var(--border-radius-large)',
        border: `1px solid ${theme.tooltipBorder}`,
        boxShadow: 'var(--shadow-block)',
      }}
    >
      <h3
        style={{
          color: theme.title,
          fontFamily: 'var(--font-family-base)',
          marginBottom: '20px',
        }}
      >
        {t('chart.publishedExchanges')}
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.accent} stopOpacity={0.4} />
              <stop offset="95%" stopColor={theme.accent} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />

          <XAxis dataKey="name" stroke={theme.axis} tickLine={false} axisLine={false} />
          <YAxis stroke={theme.axis} tickLine={false} axisLine={false} allowDecimals={false} />

          <Tooltip content={tooltipContent} />

          <Area
            type="monotone"
            dataKey="count"
            stroke={theme.accent}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
