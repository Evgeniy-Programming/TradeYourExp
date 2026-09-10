import AnalyticsChart from '../../components/AnalyticsChart/AnalyticsChart';
import { useProfile } from '../../hooks/useProfile';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';

export const StatsPage = () => {
  useProfile();

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <h2>Ваша статистика</h2>
        <div className={style.profile__skills}>
          <AnalyticsChart />
        </div>
      </div>
    </ProfileLayout>
  );
};
