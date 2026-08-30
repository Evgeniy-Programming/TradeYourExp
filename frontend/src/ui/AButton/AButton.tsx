import classNames from 'classnames';
import { Link } from 'react-router';

import style from './AButton.module.css';

interface AButtonProps {
  to: string;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  children: React.ReactNode;
}

const AButton: React.FC<AButtonProps> = ({
  to,
  isMaxWidth = false,
  isDanger = false,
  children,
}) => {
  return (
    <Link
      className={classNames(
        style.aButton,
        isMaxWidth && 'max-width',
        isDanger && style.aButton_danger
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

export default AButton;
