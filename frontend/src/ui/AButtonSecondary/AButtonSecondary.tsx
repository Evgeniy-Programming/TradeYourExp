import classNames from 'classnames';
import { Link } from 'react-router';

import style from './AButtonSecondary.module.scss';

interface AButtonSecondaryProps {
  to: string;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AButtonSecondary: React.FC<AButtonSecondaryProps> = ({
  to,
  isMaxWidth = false,
  isDanger = false,
  children,
  className,
}) => {
  return (
    <Link
      className={classNames(
        style.aButtonSecondary,
        isMaxWidth && 'max-width',
        isDanger && style.aButtonSecondary_danger,
        className
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

export default AButtonSecondary;
