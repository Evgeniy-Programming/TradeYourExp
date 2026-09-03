import { Link } from 'react-router';

import style from './A.module.scss';
import classNames from 'classnames';

interface AProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const A: React.FC<AProps> = ({ to, className, children }) => {
  return (
    <Link className={classNames(style.a, className)} to={to}>
      {children}
    </Link>
  );
};

export default A;
