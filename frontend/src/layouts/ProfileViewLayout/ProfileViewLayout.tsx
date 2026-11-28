import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { Header } from '../../components/Header/Header';
import Block from '../../ui/Block/Block';
import { ProfileViewInfo } from '../../components/ProfileViewInfo/ProfileViewInfo';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import type { IProfile } from '../../types/profile';
import style from './style.module.scss';

interface ProfileViewLayoutProps {
  children: React.ReactNode;
}

export const ProfileViewLayout: React.FC<ProfileViewLayoutProps> = ({ children }) => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState<IProfile | null>(null);
  const isLoading = Boolean(username && profile?.username !== username);

  useEffect(() => {
    if (!username) return;

    // TODO: заменить на реальный запрос, когда API будет готов
    // profileAPI.getByUsername(username)
    //   .then(setProfile)
    //   .catch((error) => dispatch(setErrorWithTimeout(error)))
    //   .finally(() => setLoading(false));

    const mock: IProfile = {
      id: 'testr2525tg-532-532-52t-g-4',
      username,
      avatar: null,
      email: '',
      firstName: 'Иван',
      lastName: 'Петров',
      link: 'https://example.com',
      createdAt: '2025-03-15T10:00:00Z',
    };

    const timer = setTimeout(() => {
      setProfile(mock);
    }, 200);

    return () => clearTimeout(timer);
  }, [username, dispatch]);

  return (
    <>
      <Header />
      <main className={classNames('container', style.main)}>
        {isLoading && (
          <Block className={style.main__profile}>
            <p className={style.main__loading}>Загрузка профиля…</p>
          </Block>
        )}

        {!isLoading && !profile && (
          <Block className={style.main__profile}>
            <p className={style.main__loading}>Профиль не найден</p>
          </Block>
        )}

        {!isLoading && profile && (
          <>
            <ProfileViewInfo profile={profile} className={style.main__profile} />
            <Block className={style.main__block}>{children}</Block>
          </>
        )}
      </main>
    </>
  );
};

export default ProfileViewLayout;
