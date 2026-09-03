import classNames from 'classnames';
import { Header } from '../../components/Header/Header';
import { ProfileInfo } from '../../components/ProfileInfo/ProfileInfo';
import style from './GeneralLayout.module.scss';
import Block from '../../ui/Block/Block';

interface GeneralLayoutProps {
  children: React.ReactNode;
}

export const GeneralLayout: React.FC<GeneralLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={classNames('container', style.main)}>
        <ProfileInfo />
        <Block className={style.main__block}>{children}</Block>
      </main>
    </>
  );
};
