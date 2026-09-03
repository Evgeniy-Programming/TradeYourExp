import classNames from 'classnames';
import { Header } from '../../components/Header/Header';
import style from './ProfileLayout.module.scss';
import Block from '../../ui/Block/Block';
import { ProfileEdit } from '../../components/ProfileEdit/ProfileEdit';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={classNames('container', style.main)}>
        <ProfileEdit />
        <Block className={style.main__block}>{children}</Block>
      </main>
    </>
  );
};
