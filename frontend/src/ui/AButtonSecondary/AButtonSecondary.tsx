import classNames from 'classnames';
import { Link } from 'react-router';

import style from './AButtonSecondary.module.css';

interface AButtonSecondaryProps {
  to: string;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  children: React.ReactNode;
}

const AButtonSecondary: React.FC<AButtonSecondaryProps> = ({
  to,
  isMaxWidth = false,
  isDanger = false,
  children,
}) => {
  return (
    <Link
      className={classNames(
        style.aButtonSecondary,
        isMaxWidth && 'max-width',
        isDanger && style.aButtonSecondary_danger
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

export default AButtonSecondary;
