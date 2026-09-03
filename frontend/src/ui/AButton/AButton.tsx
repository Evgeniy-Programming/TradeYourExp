import classNames from 'classnames';
import { Link } from 'react-router';

import style from './AButton.module.scss';

interface AButtonProps {
  to: string;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  className?: string;
  children: React.ReactNode;
}

const AButton: React.FC<AButtonProps> = ({
  to,
  isMaxWidth = false,
  isDanger = false,
  className,
  children,
}) => {
  return (
    <Link
      className={classNames(
        style.aButton,
        isMaxWidth && 'max-width',
        isDanger && style.aButton_danger,
        className
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

export default AButton;
