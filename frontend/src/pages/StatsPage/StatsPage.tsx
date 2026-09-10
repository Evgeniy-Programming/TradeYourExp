import AnalyticsChart from '../../components/AnalyticsChart/AnalyticsChart';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';

export const StatsPage = () => {
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
