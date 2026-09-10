import { useProfile } from '../../hooks/useProfile';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';

export const ProfilePage = () => {
  useProfile();

  return (
    <ProfileLayout>
      <div className={style.profile}>Hello world</div>
    </ProfileLayout>
  );
};
