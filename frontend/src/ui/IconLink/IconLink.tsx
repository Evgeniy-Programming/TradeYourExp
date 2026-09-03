import { Link } from 'react-router';

import style from './IconLink.module.scss';
import classNames from 'classnames';

interface IconLinkProps {
  to: string;
  icon: React.ReactNode;
  text?: string;
  className?: string;
}

const IconLink: React.FC<IconLinkProps> = ({ to, text, className, icon }) => {
  return (
    <Link className={classNames(style.iconLink, className)} to={to}>
      {icon}
      <div className={style.iconLink__text}>
        <p>{text}</p>
      </div>
    </Link>
  );
};

export default IconLink;
