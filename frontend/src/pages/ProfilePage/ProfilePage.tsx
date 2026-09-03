import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';

export const ProfilePage = () => {
  return (
    <ProfileLayout>
      <div className={style.profile}>Hello world</div>
    </ProfileLayout>
  );
};
