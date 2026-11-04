import { useEffect, useState } from 'react';
import AnalyticsChart, { type ChartDataItem } from '../../components/AnalyticsChart/AnalyticsChart';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';
import { skillAPI } from '../../api/skill';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import type { ISkillStats } from '../../types/skill';
import { useTranslation } from 'react-i18next';

const monthKeys = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const StatsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const [stats, setStats] = useState<ISkillStats | null>(null);

  // month приходит с бэкенда в формате YYYY-MM
  const toChartData = (stats: ISkillStats): ChartDataItem[] =>
    stats.byMonth.map(({ month, count }) => {
      const idx = Number(month.slice(5, 7)) - 1;
      const key = monthKeys[idx];
      return {
        name: key ? t(`months.${key}`) : month,
        count,
      };
    });

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
        <h2>{t('stats.title')}</h2>
        {stats && (
          <ul className={style.profile__summary}>
            <li>
              <span>{t('stats.total')}</span>
              <b>{stats.total}</b>
            </li>
            <li>
              <span>{t('stats.active')}</span>
              <b>{stats.active}</b>
            </li>
            <li>
              <span>{t('stats.closed')}</span>
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
