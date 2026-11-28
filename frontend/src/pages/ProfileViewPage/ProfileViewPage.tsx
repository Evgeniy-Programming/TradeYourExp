import { ProfileViewLayout } from '../../layouts/ProfileViewLayout/ProfileViewLayout';
import { ProfileStats } from '../../components/ProfileStats/ProfileStats';
import { ProfileAllDeals } from '../../components/ProfileAllDeals/ProfileAllDeals';
import { ProfileReviews } from '../../components/ProfileReviews/ProfileReviews';
import style from './style.module.scss';

export const ProfileViewPage = () => {
  return (
    <ProfileViewLayout>
      <div className={style.profile}>
        <ProfileStats />
        <ProfileAllDeals />
        <ProfileReviews />
      </div>
    </ProfileViewLayout>
  );
};
