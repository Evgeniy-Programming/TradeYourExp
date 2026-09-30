import { useEffect, useState } from 'react';
import AnalyticsChart, { type ChartDataItem } from '../../components/AnalyticsChart/AnalyticsChart';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';
import { skillAPI } from '../../api/skill';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import type { ISkillStats } from '../../types/skill';

const monthNames = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];

// month приходит с бэкенда в формате YYYY-MM
const toChartData = (stats: ISkillStats): ChartDataItem[] =>
  stats.byMonth.map(({ month, count }) => ({
    name: monthNames[Number(month.slice(5, 7)) - 1] ?? month,
    count,
  }));

export const StatsPage = () => {
  const dispatch = useAppDispatch();
  const [stats, setStats] = useState<ISkillStats | null>(null);

  useEffect(() => {
    skillAPI
      .getStats()
      .then(setStats)
      .catch((error) => dispatch(setErrorWithTimeout(error)));
  }, [dispatch]);

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <h2>Ваша статистика</h2>
        {stats && (
          <p>
            Всего обменов: {stats.total} · Активных: {stats.active} · Завершённых: {stats.closed}
          </p>
        )}
        <div className={style.profile__skills}>
          <AnalyticsChart data={stats ? toChartData(stats) : []} />
        </div>
      </div>
    </ProfileLayout>
  );
};
