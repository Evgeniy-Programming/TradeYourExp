import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import { ProfileStats } from '../../components/ProfileStats/ProfileStats';
import { ProfileActiveDeals } from '../../components/ProfileActiveDeals/ProfileActiveDeals';
import { ProfileReviews } from '../../components/ProfileReviews/ProfileReviews';
import style from './style.module.scss';

export const ProfilePage = () => {
  return (
    <ProfileLayout>
      <div className={style.profile}>
        <ProfileStats />
        <ProfileActiveDeals />
        <ProfileReviews />
      </div>
    </ProfileLayout>
  );
};
