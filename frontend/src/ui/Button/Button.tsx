import classNames from 'classnames';

import style from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  isCircle?: boolean;
  isMini?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  isMaxWidth = false,
  isDanger = false,
  isCircle = false,
  isMini = false,
  disabled = false,
  children,
  ...rest
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      className={classNames(
        style.button,
        isMaxWidth && 'max-width',
        isDanger && style.button_danger,
        isCircle && style.button_circle,
        isMini && style.button_mini,
        disabled && style.button_disabled
      )}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
