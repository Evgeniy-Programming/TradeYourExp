import { useEffect, useState } from 'react';
import AnalyticsChart, { type ChartDataItem } from '../../components/AnalyticsChart/AnalyticsChart';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';
import { skillAPI } from '../../api/skill';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
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
  const profile = useAppSelector((state) => state.profile.profile);
  const [stats, setStats] = useState<ISkillStats | null>(null);

  useEffect(() => {
    if (!profile) return;

    skillAPI
      .getStats(profile.username)
      .then(setStats)
      .catch((error) => dispatch(setErrorWithTimeout(error)));
  }, [dispatch, profile]);

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <h2>Ваша статистика</h2>
        {stats && (
          <ul className={style.profile__summary}>
            <li>
              <span>Всего обменов</span>
              <b>{stats.total}</b>
            </li>
            <li>
              <span>Активных</span>
              <b>{stats.active}</b>
            </li>
            <li>
              <span>Завершённых</span>
              <b>{stats.closed}</b>
            </li>
          </ul>
        )}
        <div className={style.profile__skills}>
          <AnalyticsChart data={stats ? toChartData(stats) : []} />
        </div>
      </div>
    </ProfileLayout>
  );
};
