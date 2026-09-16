import classNames from 'classnames';
import { Header } from '../../components/Header/Header';
import style from './ProfileViewLayout.module.scss';
import Block from '../../ui/Block/Block';
import { ProfileViewInfo } from '../../components/ProfileViewInfo/ProfileViewInfo';

interface ProfileViewLayoutProps {
  children: React.ReactNode;
}

export const ProfileViewLayout: React.FC<ProfileViewLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={classNames('container', style.main)}>
        <ProfileViewInfo className={style.main__profile} />
        <Block className={style.main__block}>{children}</Block>
      </main>
    </>
  );
};
