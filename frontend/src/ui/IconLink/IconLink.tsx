import { Link } from 'react-router';

import style from './IconLink.module.scss';

interface IconLinkProps {
  to: string;
  icon: React.ReactNode;
  text?: string;
  className?: string;
}

const IconLink: React.FC<IconLinkProps> = ({ to, text, icon }) => {
  return (
    <Link className={style.iconLink} to={to}>
      {icon}
      <div className={style.iconLink__text}>
        <p>{text}</p>
      </div>
    </Link>
  );
};

export default IconLink;
