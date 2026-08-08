import { Link } from 'react-router';

import style from './A.module.scss';

interface AProps {
  to: string;
  children: React.ReactNode;
}

const A: React.FC<AProps> = ({ to, children }) => {
  return (
    <Link className={style.a} to={to}>
      {children}
    </Link>
  );
};

export default A;
