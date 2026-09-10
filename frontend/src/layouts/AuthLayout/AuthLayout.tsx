import style from './AuthLayout.module.scss';
import Block from '../../ui/Block/Block';
import IconLink from '../../ui/IconLink/IconLink';
import ArrowSVG from '../../ui/svg/ArrowSVG';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={style.layout}>
      <Block className={style.box}>
        <IconLink className={style.arrow} to="/" icon={<ArrowSVG direction="left" />} />
        {children}
      </Block>
    </div>
  );
};
